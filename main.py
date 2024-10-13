import requests
import json

def generate_recipe(ingredients):
    API_KEY = 'AIzaSyB_Empni6uRc3DU7gwexuSDeRFg_fSQQok'  # Replace with your actual API key
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}'

    prompt = f"Generate a recipe using the following ingredients: {', '.join(ingredients)}"

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
        print('Response:', response.json())  # Debugging line

        if response.status_code == 200:
            response_data = response.json()
            generated_text = response_data['candidates'][0]['content']['parts'][0]['text']
            return generated_text
        else:
            return f"Error {response.status_code}: {response.text}"

    except Exception as e:
        return f"Error generating recipe: {str(e)}"

def interactive_mode():
    print("Welcome to MealMingle! Let's create some delicious recipes.")
    
    while True:
        ingredients_input = input("Enter ingredients (comma-separated) or type 'exit' to quit: ")
        
        if ingredients_input.lower() == 'exit':
            print("Thank you for using MealMingle! Goodbye!")
            break
        
        ingredients = [ingredient.strip() for ingredient in ingredients_input.split(',')]
        recipe = generate_recipe(ingredients)
        
        print("\nGenerated Recipe:\n", recipe)
        print("\n" + "="*50 + "\n")  # Separator for clarity

if __name__ == "__main__":
    interactive_mode()
