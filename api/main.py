import sys
import importlib.metadata
import importlib_metadata

# Monkeypatch importlib.metadata.packages_distributions for Python < 3.10
if not hasattr(importlib.metadata, 'packages_distributions'):
    importlib.metadata.packages_distributions = importlib_metadata.packages_distributions

from fastapi import FastAPI, File, UploadFile, HTTPException, APIRouter
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
router = APIRouter()

# Configure Gemini
# Ensure you have GOOGLE_API_KEY in your .env file
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
generation_config = {
  "temperature": 0.7,
  "top_p": 1,
  "top_k": 1,
  "max_output_tokens": 2048,
}

model = genai.GenerativeModel(model_name="gemini-2.5-flash-lite", generation_config=generation_config)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://potato-doc.vercel.app", # Add your Vercel domain here if known, or use "*"
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model with error handling for Vercel environment where model might not be present
MODEL = None
try:
    if os.path.exists("../models/1/model.keras"):
        MODEL = tf.keras.models.load_model("../models/1/model.keras")
    elif os.path.exists("models/1/model.keras"):
        MODEL = tf.keras.models.load_model("models/1/model.keras")
    else:
        print("Warning: Model file not found. Prediction endpoint will fail.")
except Exception as e:
    print(f"Error loading model: {e}")

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@router.get("/")
async def root():
    return RedirectResponse(url="/docs")

@router.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@router.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    if MODEL is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
        
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    
    predictions = MODEL.predict(img_batch)

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

from typing import Optional

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        system_prompt = """You are 'Potato Doc', an expert agricultural AI assistant specializing in potato crops. 
        Your goal is to help farmers and users diagnose diseases, suggest treatments, and provide advice on potato farming.
        
        Traits:
        - Professional yet accessible.
        - Highly knowledgeable about Early Blight, Late Blight, and general crop health.
        - Concise and conversational. Speak naturally like a human expert, not a robot.
        - Avoid excessive bulleted lists. Use paragraphs and natural language to explain things briefly.
        - Only use lists if describing a strict step-by-step process.
        
        If a context is provided (e.g., "Early Blight detected"), tailor your advice specifically to that diagnosis.
        If the user asks about something unrelated to agriculture or potatoes, politely steer them back to the topic.
        """
        
        chat = model.start_chat(history=[
            {"role": "user", "parts": [system_prompt]},
            {"role": "model", "parts": ["Understood. I am Potato Doc, ready to assist with potato crop diagnostics and advice."]}
        ])
        
        user_message = request.message
        if request.context:
            user_message = f"[Context: Current scan detected {request.context}] User Question: {request.message}"
            
        response = chat.send_message(user_message)
        return {"response": response.text}
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Include router at root and at /api
app.include_router(router)
app.include_router(router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)

