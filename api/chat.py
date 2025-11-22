from http.server import BaseHTTPRequestHandler
import json
import os
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
generation_config = {
    "temperature": 0.7,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

model = genai.GenerativeModel(model_name="gemini-2.0-flash-exp", generation_config=generation_config)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Get content length and read body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            message = data.get('message', '')
            context = data.get('context')
            
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
            
            user_message = message
            if context:
                user_message = f"[Context: Current scan detected {context}] User Question: {message}"
            
            response = chat.send_message(user_message)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response_data = json.dumps({"response": response.text})
            self.wfile.write(response_data.encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = json.dumps({"error": str(e)})
            self.wfile.write(error_response.encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
