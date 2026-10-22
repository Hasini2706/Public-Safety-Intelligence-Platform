# Data Directory Policy

## IMPORTANT: Do NOT Commit Large Datasets to Git

Git is designed for tracking source code, not gigabytes of video, imagery, or large CSVs.
Committing large datasets slows down cloning and risks hitting GitHub repository size limits.

### Directory Structure

- `data/raw/`: Original, immutable raw data dumps (git-ignored except `.gitkeep`).
- `data/processed/`: Cleaned, normalized feature tables or tokenized text (git-ignored except `.gitkeep`).
- `data/interim/`: Intermediate transformations or cached steps (git-ignored except `.gitkeep`).

### How to Add Data to Your Module

1. Place your local data files into:
   - `data/raw/<module-name>/`
   - e.g., `data/raw/complaints/`, `data/raw/identity/`, etc.
2. In your module's README or ML guide (`ml/<module-name>/README.md`), document:
   - Dataset source / download link (e.g., Kaggle, Hugging Face, government open data portal).
   - Expected file schema or structure.
   - Script to download or prepare sample synthetic data.
3. For unit testing, place minimal synthetic test fixtures (< 50 KB) in `tests/fixtures/` or your module's test folder.
