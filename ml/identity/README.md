# Module 2 ML: AI Smart Identity Verification + Face Matching

- **Branch**: `feature/identity`
- **Owner**: Member 2
- **Focus**: Computer Vision / Biometric Verification Decision-Support

## Pipeline Stages
1. Image Quality & Face Detection Check (bounding box, alignment)
2. Feature Embedding Extraction (e.g. ArcFace, Facenet, or ResNet-based backbone)
3. Distance Metric (Cosine similarity / Euclidean L2 distance against reference ID)
4. Verification Decision Threshold & Match Probability
5. Human-in-the-Loop review flag for borderline scores

## Responsible AI Warning
Outputs are confidence similarity scores strictly to aid human verification officers.
Never state automated identity confirmation as absolute truth without verification protocol.
Never commit real human biometric photos or sensitive IDs to git.
