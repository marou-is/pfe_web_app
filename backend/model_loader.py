"""
model_loader.py
---------------
Loads the best transformer checkpoint once at process startup and
exposes a single `predict(text)` function used by the API routes.

Expected directory layout (adjust MODEL_DIR if yours differs):

  model_3/
  └── transformers/
      └── roberta-base-seed42/        <-- or whichever seed won
          ├── config.json
          ├── tokenizer_config.json
          ├── vocab.json / merges.txt
          └── model.safetensors (or pytorch_model.bin)

If you saved the model with Keras (.keras file) instead of the
HuggingFace format, see the KERAS VARIANT comment below.
"""

import os
import logging
from pathlib import Path
from typing import Optional

import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration — edit these two lines to match your winning model
# ---------------------------------------------------------------------------
MODEL_DIR = Path("../model_3/transformers/xlm-roberta-base-seed7")
# Labels must match whatever you used during training (0=Human, 1=AI  or vice-versa)
ID2LABEL = {0: "Human", 1: "AI"}

MAX_LENGTH = 512          # keep in sync with your training max_length
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ---------------------------------------------------------------------------
# Module-level singletons — populated once by load_model()
# ---------------------------------------------------------------------------
_tokenizer: Optional[AutoTokenizer] = None
_model: Optional[AutoModelForSequenceClassification] = None


def load_model() -> None:
    """Call this once inside FastAPI's startup event."""
    global _tokenizer, _model

    if not MODEL_DIR.exists():
        raise FileNotFoundError(
            f"Model directory not found: {MODEL_DIR.resolve()}\n"
            "Update MODEL_DIR in model_loader.py to point at your saved checkpoint."
        )

    logger.info(f"Loading tokenizer from {MODEL_DIR} ...")
    _tokenizer = AutoTokenizer.from_pretrained("roberta-base")

    logger.info(f"Loading model from {MODEL_DIR} on {DEVICE} ...")
    _model = AutoModelForSequenceClassification.from_pretrained(str(MODEL_DIR))
    _model.to(DEVICE)
    _model.eval()

    logger.info("Model loaded successfully.")

    # -----------------------------------------------------------------------
    # KERAS VARIANT
    # If your checkpoint is a .keras file (e.g. from step-5-pretrained-models.ipynb)
    # replace the block above with:
    #
    #   import tensorflow as tf
    #   from transformers import TFAutoModelForSequenceClassification
    #
    #   _tokenizer = AutoTokenizer.from_pretrained("roberta-base")  # base name
    #   _model = TFAutoModelForSequenceClassification.from_pretrained(
    #       str(MODEL_DIR / "roberta-base-seed42.keras")
    #   )
    #
    # Then in _run_inference below, replace the torch inference block with:
    #
    #   outputs = _model(inputs)
    #   logits  = outputs.logits.numpy()
    # -----------------------------------------------------------------------


def _run_inference(text: str) -> tuple[str, float, float]:
    """
    Tokenise `text`, run a forward pass, return (label, ai_prob, human_prob).
    """
    assert _tokenizer is not None and _model is not None, \
        "Model not loaded — call load_model() first."

    inputs = _tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=MAX_LENGTH,
        padding=True,
    )
    inputs = {k: v.to(DEVICE) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = _model(**inputs)

    probs = torch.softmax(outputs.logits, dim=-1).squeeze().cpu().numpy()

    # probs shape: [num_labels]  (typically [p_human, p_ai])
    predicted_id = int(np.argmax(probs))
    label = ID2LABEL[predicted_id]
    ai_prob = float(probs[1])       # index 1 = AI (adjust if your label mapping differs)
    human_prob = float(probs[0])

    return label, ai_prob, human_prob


# ---------------------------------------------------------------------------
# Public API used by main.py
# ---------------------------------------------------------------------------

def predict_paragraph(text: str) -> dict:
    """
    Single-block prediction — used for the Paragraph mode.

    Returns
    -------
    {
        "label":      "AI" | "Human",
        "ai_prob":    0.93,
        "human_prob": 0.07,
        "word_count": 142
    }
    """
    label, ai_prob, human_prob = _run_inference(text)
    return {
        "label":      label,
        "ai_prob":    round(ai_prob, 4),
        "human_prob": round(human_prob, 4),
        "word_count": len(text.split()),
    }


def predict_article(text: str) -> dict:
    """
    Sentence-level prediction — used for the Article mode.

    Each sentence is scored independently.  The document-level score is the
    mean of per-sentence AI probabilities (simple and interpretable).

    Returns
    -------
    {
        "label":           "AI" | "Human",
        "ai_prob":         0.87,
        "human_prob":      0.13,
        "word_count":      843,
        "sentence_scores": [
            {"sentence": "The cat sat ...", "ai_prob": 0.91, "label": "AI"},
            ...
        ]
    }
    """
    import nltk
    try:
        sentences = nltk.sent_tokenize(text)
    except LookupError:
        nltk.download("punkt", quiet=True)
        nltk.download("punkt_tab", quiet=True)
        sentences = nltk.sent_tokenize(text)

    # Filter out very short fragments (headings, stray punctuation)
    sentences = [s.strip() for s in sentences if len(s.split()) >= 4]

    if not sentences:
        # Fallback: treat the whole text as one block
        return predict_paragraph(text)

    sentence_scores = []
    ai_probs = []

    for sent in sentences:
        lbl, ai_p, human_p = _run_inference(sent)
        ai_probs.append(ai_p)
        sentence_scores.append({
            "sentence": sent,
            "ai_prob":  round(ai_p, 4),
            "label":    lbl,
        })

    doc_ai_prob    = float(np.mean(ai_probs))
    doc_human_prob = 1.0 - doc_ai_prob
    doc_label      = ID2LABEL[1] if doc_ai_prob >= 0.5 else ID2LABEL[0]

    return {
        "label":            doc_label,
        "ai_prob":          round(doc_ai_prob, 4),
        "human_prob":       round(doc_human_prob, 4),
        "word_count":       len(text.split()),
        "sentence_scores":  sentence_scores,
    }