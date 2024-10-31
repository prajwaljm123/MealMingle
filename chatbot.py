import requests
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_chatbot_response(user_message, conversation_history):
    API_KEY = 'AIzaSyBe_uKiZ9KIcUmqvvk0CaJ-261_nL2lLGU'  # Replace with your new API key
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}'
    
    # Prepare the prompt including conversation history
    prompt = "You are a helpful assistant. Maintain context of the conversation. "
    for message in conversation_history:
        prompt += f"\nUser: {message['user']}\nAssistant: {message.get('assistant', '')}"
    
    prompt += f"\nUser: {user_message}\nAssistant:"

    # JSON body for API call
    request_body = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }

    try:
        response = requests.post(url, headers={'Content-Type': 'application/json'}, data=json.dumps(request_body))
        if response.status_code == 200:
            response_data = response.json()
            generated_text = response_data['candidates'][0]['content']['parts'][0]['text']
            return generated_text.strip()
        else:
            return f"Error {response.status_code}: {response.text}"
    
    except Exception as e:
        return f"Error generating response: {str(e)}"

# Chatbot route
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    conversation_history = data.get('history', [])  # Retrieve conversation history
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    # Get response from the chatbot API
    bot_response = get_chatbot_response(user_message, conversation_history)
    conversation_history.append({'user': user_message, 'assistant': bot_response})
    
    return jsonify({'response': bot_response, 'history': conversation_history}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Running chatbot on a different port
