# Module 1 ML: Smart Complaint Category Classification

- **Branch**: `feature/complaints`
- **Owner**: Member 1
- **Focus**: NLP / Text Classification for citizen grievance triage

## Pipeline Stages
1. Text Ingestion & Cleaning (tokenization, stop words, lemmatization)
2. Feature Representation (TF-IDF, sentence embeddings, or lightweight transformer)
3. Classifier (e.g. Logistic Regression, Linear SVM, or fine-tuned text model)
4. Calibration: Confidence probability score & Priority ranking (Urgent, High, Medium, Low)

## Integration Point
Implement concrete inference class inheriting from `ml.shared.BaseMLModule`.
Export inference service to `backend/app/modules/complaints/service.py`.
