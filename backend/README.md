---
title: PFE Backend
emoji: 🔍
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 8888
pinned: false
---

# AI Text Detector — FastAPI Backend

REST API for detecting AI-generated vs human-written text using `openai-community/roberta-base-openai-detector`.

## Endpoints

- `POST /predict` — paragraph or article detection
- `POST /predict/batch` — batch detection
- `GET /health` — liveness probe
- `GET /model/info` — model metadata