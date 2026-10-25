"""Module 1 ML Engine: Smart Complaint Category Classification & Priority Triage.

Implements an advanced NLP pipeline for classifying citizen grievances, calculating
confidence probabilities, extracting hazard indicators, and determining SLA urgency.
"""

import re
from typing import Any, Dict, List, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from ml.shared.base_model import BaseMLModule, ModelStatus

# Expanded comprehensive corpus of realistic citizen grievances & public safety complaints
TRAINING_SAMPLES = [
    # 1. Electrical Hazard & Power Infrastructure
    ("High voltage electrical wire sparking after thunderstorm", "Multiple exposed lines touching water ponding near school gate", "Electrical Hazard & Power Infrastructure", "Urgent", "Power & Electrical Utilities"),
    ("Transformer explosion in Sector 4", "The local power transformer blew up with flames, sparking power line hanging low", "Electrical Hazard & Power Infrastructure", "Urgent", "Power & Electrical Utilities"),
    ("Streetlight pole sparking and live wire exposed", "Pedestrians at risk near bus stop due to live hanging cable emitting sparks", "Electrical Hazard & Power Infrastructure", "Urgent", "Power & Electrical Utilities"),
    ("Broken electric pole leaning dangerously over footpath", "Wooden pole damaged by truck collision, high tension cables sagging to head height", "Electrical Hazard & Power Infrastructure", "High", "Power & Electrical Utilities"),
    ("Substation humming loudly with smoke smell", "Power grid unit emitting burning electrical insulation odors and popping sounds", "Electrical Hazard & Power Infrastructure", "High", "Power & Electrical Utilities"),
    ("Streetlights flickering and blacked out for three blocks", "Dark street causing safety concern for night commuters and pedestrians", "Electrical Hazard & Power Infrastructure", "Medium", "Power & Electrical Utilities"),
    ("Low hanging cable snared on truck trailer", "Overhead electricity cable pulled down across intersection blocking both lanes", "Electrical Hazard & Power Infrastructure", "Urgent", "Power & Electrical Utilities"),
    ("Frequent power surges damaging household electronics", "Voltage fluctuations in residential area burning refrigerators and appliances", "Electrical Hazard & Power Infrastructure", "Medium", "Power & Electrical Utilities"),
    ("Feeder pillar box open and exposed live fuses", "Open junction box on pedestrian sidewalk accessible to children near park", "Electrical Hazard & Power Infrastructure", "Urgent", "Power & Electrical Utilities"),
    ("Underground power cable short circuit smoking from manhole", "Thick black smoke and burning plastic odor issuing from electrical duct", "Electrical Hazard & Power Infrastructure", "Urgent", "Power & Electrical Utilities"),

    # 2. Water Supply & Sewage Contamination
    ("Raw sewage overflowing onto main market road", "Manhole cap broken, toxic dark sludge flooding hospital entrance and retail shops", "Water Supply & Sewage Contamination", "Urgent", "Water & Sanitation Authority"),
    ("Drinking water pipe burst mixing with sewer drainage", "Tap water in colony smells foul with brown sediment, risk of waterborne outbreak", "Water Supply & Sewage Contamination", "Urgent", "Water & Sanitation Authority"),
    ("Major water main rupture flooding subway underpass", "Underpass submerged in 3 feet of pressurized water, vehicular traffic trapped", "Water Supply & Sewage Contamination", "Urgent", "Water & Sanitation Authority"),
    ("Storm drain choked causing basement flooding", "Drainage canal blocked with construction debris, rain water backing up into residential basements", "Water Supply & Sewage Contamination", "High", "Water & Sanitation Authority"),
    ("Contaminated tap water with chemical sheen", "Residents in block C reporting nausea and sulfur smell from municipal supply", "Water Supply & Sewage Contamination", "High", "Water & Sanitation Authority"),
    ("Low water pressure in residential sector for past week", "Water supply timing restricted to 15 minutes daily with insufficient pressure", "Water Supply & Sewage Contamination", "Low", "Water & Sanitation Authority"),
    ("Sewage backflow into residential ground floor toilets", "Main municipal sewer blocked causing filthy wastewater backing up into bathrooms", "Water Supply & Sewage Contamination", "Urgent", "Water & Sanitation Authority"),
    ("Chlorine gas leak alarm at water treatment plant", "Strong pungent bleach odor spreading to adjacent neighborhoods from reservoir", "Water Supply & Sewage Contamination", "Urgent", "Water & Sanitation Authority"),
    ("Open storm water drain overflowing into vegetable market", "Stagnant filthy wastewater stagnating near food vendors creating severe health hazard", "Water Supply & Sewage Contamination", "High", "Water & Sanitation Authority"),

    # 3. Road Safety & Infrastructure Hazards
    ("Massive sinkhole opened on national highway bypass", "Deep 2-meter sinkhole collapsed suddenly in the middle lane, heavy trucks swerving", "Road Safety & Infrastructure Hazards", "Urgent", "Roads & Highway Department"),
    ("Uncovered deep manhole on dark school bus route", "Open storm pit without barricade or warning sign, severe pedestrian fall risk", "Road Safety & Infrastructure Hazards", "Urgent", "Roads & Highway Department"),
    ("Collapsed metal guardrail on elevated flyover curve", "Sharp drop after collision destroyed barrier, high risk of vehicles falling off bridge", "Road Safety & Infrastructure Hazards", "High", "Roads & Highway Department"),
    ("Severe clusters of deep potholes on arterial ring road", "Vehicles losing control, bike skidding and suspension damage reported daily", "Road Safety & Infrastructure Hazards", "Medium", "Roads & Highway Department"),
    ("Missing traffic signal head at busy four-way junction", "Signal lights blinking erratically, causing near-miss collisions during rush hour", "Road Safety & Infrastructure Hazards", "High", "Traffic Management"),
    ("Faded zebra crossing and missing speed breakers", "Speeding vehicles near children playground needing painted crossing and rumble strips", "Road Safety & Infrastructure Hazards", "Low", "Roads & Highway Department"),
    ("Bridge expansion joint separated creating tire blowout ridge", "Steel plate protruding 4 inches above asphalt on river bridge deck", "Road Safety & Infrastructure Hazards", "High", "Roads & Highway Department"),
    ("Landslide debris blocking mountain access pass", "Boulders and mud tumbled onto highway blocking lane after cloudburst", "Road Safety & Infrastructure Hazards", "Urgent", "Roads & Highway Department"),
    ("Traffic signal lights completely non-functional during peak hours", "Gridlock and repeated near collisions at central junction with no traffic police", "Road Safety & Infrastructure Hazards", "High", "Traffic Management"),

    # 4. Public Health & Hazardous Waste
    ("Illegal dumping of biomedical hospital waste in empty plot", "Used syringes, blood bags, and discarded pharmaceutical vials left exposed", "Public Health & Hazardous Waste", "Urgent", "Public Health & Environment"),
    ("Chemical barrels leaking pungent acidic liquid into ditch", "Industrial drums abandoned in green belt, strong chemical odor causing respiratory stinging", "Public Health & Hazardous Waste", "Urgent", "Public Health & Environment"),
    ("Rotting animal carcasses attracting packs of aggressive dogs", "Municipal garbage collection stopped for 10 days, severe biohazard and stench", "Public Health & Hazardous Waste", "High", "Public Health & Environment"),
    ("Stagnant water ponding breeding massive mosquito swarm", "Construction site basement stagnant for months, dengue and malaria cluster in locality", "Public Health & Hazardous Waste", "High", "Public Health & Environment"),
    ("Uncollected municipal garbage bins overflowing across walkway", "Commercial food waste spilling into street, blocking pedestrian sidewalk", "Public Health & Hazardous Waste", "Medium", "Public Health & Environment"),
    ("Dead tree branches hanging over park walkway", "Dry branches may fall during strong winds onto joggers path", "Public Health & Hazardous Waste", "Low", "Parks & Horticulture"),
    ("Toxic industrial effluent discharged into public pond", "Fish dying and frothing scum on surface of community lake near dyeing factory", "Public Health & Hazardous Waste", "Urgent", "Public Health & Environment"),
    ("Asbestos insulation debris dumped near residential playground", "Demolition contractors left fibrous insulation tiles unprotected in wind", "Public Health & Hazardous Waste", "High", "Public Health & Environment"),

    # 5. Law & Order & Public Disturbance
    ("Armed brawl and weapon brandishing in market parking", "Violent altercation between two groups with sticks and blades, shopkeepers locking gates", "Law & Order & Public Disturbance", "Urgent", "Police & Public Safety"),
    ("Repeated night trespassing and vandalism at public library", "Broken windows, graffiti, and locks tampered with after midnight", "Law & Order & Public Disturbance", "High", "Police & Public Safety"),
    ("Illegal high-decibel loudspeakers blasting past 2 AM", "Continuous noise violation disturbing elderly residents and hospital silence zone", "Law & Order & Public Disturbance", "Medium", "Police & Public Safety"),
    ("Public drinking and harassment near women transit station", "Unruly crowd loitering around bus terminal exit, shouting threatening remarks", "Law & Order & Public Disturbance", "High", "Police & Public Safety"),
    ("Illegal parking blocking emergency ambulance gate", "Delivery vans continuously parking in designated emergency vehicle lane", "Law & Order & Public Disturbance", "High", "Traffic Management"),
    ("Mobile phone stolen at bus stand during rush hour", "Pickpocket snatched smartphone from commuter boarding city bus", "Law & Order & Public Disturbance", "High", "Police & Public Safety"),
    ("Extortion threats made to neighborhood retail store owners", "Gang members demanding weekly protection money and intimidating shopkeepers", "Law & Order & Public Disturbance", "Urgent", "Police & Public Safety"),
    ("Online scam and cyber phishing extortion campaign", "Citizens receiving malicious SMS threatening power disconnection to harvest credentials", "Law & Order & Public Disturbance", "High", "Police & Public Safety"),
    ("Motorcycle chain snatching at dark street corner", "Two riders grabbed gold necklace from walking woman and fled on motorcycle", "Law & Order & Public Disturbance", "Urgent", "Police & Public Safety"),

    # 6. Fire, Gas & Thermal Emergency
    ("Strong smell of commercial LPG gas leak near apartment duct", "Hissing sound and intense mercaptan gas odor coming from ground floor pipe connection", "Fire, Gas & Thermal Emergency", "Urgent", "Fire & Emergency Services"),
    ("Building fire safety exits padlocked and obstructed by crates", "Commercial complex locked both emergency stairwells, extreme fire trap for workers", "Fire, Gas & Thermal Emergency", "Urgent", "Fire & Emergency Services"),
    ("Dry brush fire spreading rapidly toward chemical warehouse fence", "Tall grass blazing close to fuel storage tank, sparks flying over perimeter wall", "Fire, Gas & Thermal Emergency", "Urgent", "Fire & Emergency Services"),
    ("Broken fire hydrant leaking pressurized water in industrial park", "Main valve cap detached, hydrant out of service in case of industrial fire", "Fire, Gas & Thermal Emergency", "High", "Fire & Emergency Services"),
    ("Expired and empty fire extinguishers in public cinema hall", "Annual safety audit overdue, safety audit tags show expiration from two years ago", "Fire, Gas & Thermal Emergency", "Medium", "Fire & Emergency Services"),
    ("Dense toxic smoke billowing from scrapyard rubber tire fire", "Accidental blaze in tire warehouse producing zero visibility and choking fumes", "Fire, Gas & Thermal Emergency", "Urgent", "Fire & Emergency Services"),
    ("CNG cylinder station pipeline valve leaking gas", "High pressure natural gas hissing loudly from refilling dispenser valve", "Fire, Gas & Thermal Emergency", "Urgent", "Fire & Emergency Services"),

    # 7. Building Structural Safety & Dilapidation
    ("Masonry concrete balcony slabs cracking and dropping chunks", "Old residential facade disintegrating, chunks of concrete falling onto crowded street", "Building Structural Safety & Dilapidation", "Urgent", "Building Safety & Inspection"),
    ("Deep diagonal stress cracks appearing on boundary retaining wall", "Wall tilting outward towards pedestrian walkway following heavy rain", "Building Structural Safety & Dilapidation", "High", "Building Safety & Inspection"),
    ("Abandoned derelict structure used for illicit activities", "Roof partially collapsed, exposed rusted rebar posing hazard to neighborhood children", "Building Structural Safety & Dilapidation", "Medium", "Building Safety & Inspection"),
    ("Basement column concrete spalling exposing corroded rebar", "Underground parking support pillar showing severe compression cracks and rebar buckling", "Building Structural Safety & Dilapidation", "Urgent", "Building Safety & Inspection"),
    ("Unauthorized floor construction exceeding foundation permit", "Adding third story to brick masonry house without architectural approval", "Building Structural Safety & Dilapidation", "High", "Building Safety & Inspection"),
]

URGENT_KEYWORDS = {
    "sparking", "sparks", "fire", "explosion", "flames", "burst", "sinkhole", "toxic",
    "sewage", "gas leak", "hissing", "armed", "weapon", "blew up", "live wire", "uncovered manhole",
    "sludge", "syringes", "biomedical", "acidic", "cracking", "collapsed", "emergency", "stolen",
    "snatching", "blaze", "leaking gas"
}

HIGH_KEYWORDS = {
    "flooding", "broken", "leaning", "contaminat", "choked", "carcasses", "odors",
    "trespassing", "harassment", "obstruction", "hydrant", "substation", "manhole", "bacteria",
    "theft", "extortion", "scam", "phishing", "potholes", "signal"
}

CATEGORY_DEPARTMENTS = {
    "Electrical Hazard & Power Infrastructure": "Power & Electrical Utilities",
    "Water Supply & Sewage Contamination": "Water & Sanitation Authority",
    "Road Safety & Infrastructure Hazards": "Roads & Highway Infrastructure",
    "Public Health & Hazardous Waste": "Public Health & Environment",
    "Law & Order & Public Disturbance": "Police & Public Safety",
    "Fire, Gas & Thermal Emergency": "Fire & Emergency Services",
    "Building Structural Safety & Dilapidation": "Building Safety & Structural Engineering",
}

CATEGORY_SLA = {
    "Urgent": 2,     # 2 hours target
    "High": 8,       # 8 hours target
    "Medium": 24,    # 24 hours target
    "Low": 72,       # 72 hours target
}


class ComplaintClassifierModule(BaseMLModule):
    """Machine learning model for automated citizen grievance classification and priority triage."""

    def __init__(self, version: str = "1.0.0"):
        super().__init__(module_name="complaints", version=version)
        self.pipeline: Optional[Pipeline] = None
        self._categories: List[str] = []
        self._train_pipeline()

    def _train_pipeline(self):
        """Fit an optimized, highly accurate NLP pipeline on the enriched grievance dataset."""
        texts = [f"{t} {d}" for t, d, _, _, _ in TRAINING_SAMPLES]
        labels = [c for _, _, c, _, _ in TRAINING_SAMPLES]

        self.pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 3),
                sublinear_tf=True,
                max_features=4000,
                token_pattern=r"(?u)\b\w+\b"
            )),
            ("clf", LogisticRegression(
                C=4.0,
                max_iter=2000,
                class_weight="balanced",
                random_state=42
            )),
        ])

        self.pipeline.fit(texts, labels)
        self._categories = list(self.pipeline.classes_)
        self._status = ModelStatus.READY

    def load_model(self, artifact_path: Optional[str] = None) -> bool:
        if not self.pipeline:
            self._train_pipeline()
        return True

    def preprocess(self, raw_input: Any) -> str:
        """Combine and clean title, description, and optional hint."""
        if isinstance(raw_input, dict):
            title = raw_input.get("title", "")
            desc = raw_input.get("description", "")
            hint = raw_input.get("department_hint", "") or ""
            text = f"{title} {desc} {hint}"
        else:
            text = str(raw_input)

        cleaned = re.sub(r"[^\w\s-]", " ", text.lower())
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned

    def predict(self, raw_input: Any) -> Dict[str, Any]:
        """Execute NLP inference, calculate confidence distribution, and compute priority."""
        if self._status != ModelStatus.READY:
            self.load_model()

        cleaned_text = self.preprocess(raw_input)
        if not cleaned_text:
            return {
                "category": "General Public Inquiries",
                "confidence": 0.50,
                "priority": "Low",
                "department": "Municipal Grievance Cell",
                "sla_hours": 72,
                "requires_human_review": True,
                "key_risk_factors": ["Insufficient text details supplied"],
                "model_version": self.version,
            }

        # Predict probability distribution
        probas = self.pipeline.predict_proba([cleaned_text])[0]
        top_idx = probas.argmax()
        predicted_category = str(self._categories[top_idx])
        raw_conf = float(probas[top_idx])

        # Temperature calibration for sharp decision boundaries
        calibrated_conf = min(0.99, max(0.55, raw_conf ** 0.85))

        # Priority calculation using category base + text risk cues
        priority, risk_factors = self._evaluate_priority(cleaned_text, predicted_category, calibrated_conf)
        department = CATEGORY_DEPARTMENTS.get(predicted_category, "Municipal Grievance Cell")
        sla_hours = CATEGORY_SLA.get(priority, 24)

        return {
            "category": predicted_category,
            "confidence": round(calibrated_conf, 4),
            "priority": priority,
            "department": department,
            "sla_hours": sla_hours,
            "requires_human_review": True,
            "key_risk_factors": risk_factors,
            "model_version": self.version,
        }

    def _evaluate_priority(self, text: str, category: str, confidence: float) -> tuple[str, List[str]]:
        """Calibrate priority level based on hazard indicators and keywords."""
        risk_factors: List[str] = []

        urgent_matches = [kw for kw in URGENT_KEYWORDS if kw in text]
        if urgent_matches:
            risk_factors.append(f"Immediate hazard cues detected: {', '.join(urgent_matches[:3])}")

        high_matches = [kw for kw in HIGH_KEYWORDS if kw in text]
        if high_matches:
            risk_factors.append(f"Escalation keywords detected: {', '.join(high_matches[:3])}")

        if category in ["Electrical Hazard & Power Infrastructure", "Fire, Gas & Thermal Emergency"]:
            risk_factors.append("Domain carries inherent risk to human life")

        if urgent_matches or category == "Fire, Gas & Thermal Emergency":
            priority = "Urgent"
        elif high_matches or category in ["Electrical Hazard & Power Infrastructure", "Water Supply & Sewage Contamination"]:
            priority = "High"
        elif category in ["Road Safety & Infrastructure Hazards", "Law & Order & Public Disturbance"]:
            priority = "High" if confidence > 0.6 else "Medium"
        else:
            priority = "Medium" if len(text.split()) > 10 else "Low"

        if not risk_factors:
            risk_factors.append("Standard municipal service turnaround applicable")

        return priority, risk_factors


# Singleton instance
complaint_classifier_module = ComplaintClassifierModule()
