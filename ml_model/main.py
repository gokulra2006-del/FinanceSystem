from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import os

app = FastAPI(title="SentinelIQ ML Microservice")

# Load model path
MODEL_PATH = os.path.dirname(os.path.abspath(__file__))

# Try to load model using distilbert base
print("Loading model and tokenizer...")
try:
    tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
    model = AutoModelForSequenceClassification.from_pretrained(
        "distilbert-base-uncased", 
        num_labels=3,
        state_dict=torch.load(os.path.join(MODEL_PATH, "model.safetensors")) if os.path.exists(os.path.join(MODEL_PATH, "model.safetensors")) else None
    )
    # If the user uploaded a custom model, we assume 3 labels (Negative, Neutral, Positive)
    # The above assumes the state dict matches distilbert.
except Exception as e:
    print(f"Warning: Could not load custom state dict. {e}")
    # Fallback to base model for demo if it fails to load the custom safetensors
    tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
    model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=3, ignore_mismatched_sizes=True)

class PredictRequest(BaseModel):
    text: str

@app.post("/predict")
async def predict(request: PredictRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    inputs = tokenizer(request.text, return_tensors="pt", truncation=True, padding=True)
    
    with torch.no_grad():
        outputs = model(**inputs)
        
    logits = outputs.logits
    probabilities = torch.nn.functional.softmax(logits, dim=-1)
    
    # 0: Negative, 1: Neutral, 2: Positive
    labels = ["Negative", "Neutral", "Positive"]
    pred_idx = torch.argmax(probabilities, dim=-1).item()
    confidence = probabilities[0][pred_idx].item()
    
    return {
        "label": labels[pred_idx],
        "confidence": round(confidence * 100, 2),
        "probabilities": {
            "Negative": round(probabilities[0][0].item() * 100, 2),
            "Neutral": round(probabilities[0][1].item() * 100, 2),
            "Positive": round(probabilities[0][2].item() * 100, 2)
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
