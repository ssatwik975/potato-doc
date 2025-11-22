import sys

from fastapi import FastAPI, HTTPException, APIRouter, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
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
    "https://potato-doc.vercel.app",
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@router.get("/")
async def root():
    return RedirectResponse(url="/docs")

@router.get("/ping")
async def ping():
    return "Hello, I am alive"

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

# Fallback for Vercel 405 issues - explicitly handle OPTIONS for /api/chat if needed
@app.options("/api/chat")
async def chat_options():
    return JSONResponse(content="OK", headers={"Allow": "POST, OPTIONS"})

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)

