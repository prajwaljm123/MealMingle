import re
import requests
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def generate_recipe(ingredients):
    API_KEY = 'AIzaSyB_Empni6uRc3DU7gwexuSDeRFg_fSQQok'  # Replace with your API key
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}'

    prompt = (
        f"Create an Indian recipe using only the following ingredients: {', '.join(ingredients)}. "
        f"You can also use basic pantry items like oil, water, salt, and pepper, but avoid any other ingredients. "
        f"Generated recipe should contain Recipe Name, Ingredients, Instructions, and Calories."
    )

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
            print("Raw Generated Recipe Text:\n", generated_text)  # Debugging: Show raw output
            return generated_text
        else:
            return f"Error {response.status_code}: {response.text}"

    except Exception as e:
        return f"Error generating recipe: {str(e)}"

def extract_recipe_details(generated_text):
    # Updated regex patterns to remove look-behind and ensure fixed width where needed
    name_pattern = r'^\s*##\s*(.*?)\s*\n'  # Match the recipe name after "##"
    ingredients_pattern = r'\*\*Ingredients:\*\*\s*\n(.*?)\n\n'  # Match ingredients after "**Ingredients:**"
    instructions_pattern = r'\*\*Instructions:\*\*\s*\n(.*?)\n\n'  # Match instructions after "**Instructions:**"
    calories_pattern = r'\*\*Calories:\*\*\s*(.*?)\n'  # Match calories after "**Calories:**"

    recipe_details = {
        'recipe_name': None,
        'ingredients': [],
        'instructions': "",
        'calories': "Not provided",
    }

    # Extract recipe name
    name_match = re.search(name_pattern, generated_text, re.MULTILINE)
    print("Recipe Name Match:", name_match.group(1) if name_match else "None")  # Debugging
    if name_match:
        recipe_details['recipe_name'] = name_match.group(1).strip()

    # Extract ingredients
    ingredients_match = re.search(ingredients_pattern, generated_text, re.DOTALL)
    print("Ingredients Match:", ingredients_match.group(1) if ingredients_match else "None")  # Debugging
    if ingredients_match:
        ingredients = ingredients_match.group(1).strip().split('\n')
        recipe_details['ingredients'] = [ingredient.strip() for ingredient in ingredients if ingredient.strip()]

    # Extract instructions
    instructions_match = re.search(instructions_pattern, generated_text, re.DOTALL)
    print("Instructions Match:", instructions_match.group(1) if instructions_match else "None")  # Debugging
    if instructions_match:
        instructions = instructions_match.group(1).strip().split('\n')
        recipe_details['instructions'] = '\n'.join([f"{step.strip()}" for i, step in enumerate(instructions)])

    # Extract calories
    calories_match = re.search(calories_pattern, generated_text)
    print("Calories Match:", calories_match.group(1) if calories_match else "None")  # Debugging
    if calories_match:
        recipe_details['calories'] = calories_match.group(1).strip()

    return recipe_details

@app.route('/generate', methods=['POST'])
def generate_recipe_endpoint():
    data = request.json
    ingredients = data.get('ingredients', [])
    generated_recipe = generate_recipe(ingredients)  # Call your existing function
    
    recipe_details = extract_recipe_details(generated_recipe)  # Extract details
    if recipe_details and recipe_details['recipe_name']:  # Ensure the recipe name is not None
        return jsonify(recipe_details), 200
    else:
        return jsonify({'error': 'Failed to generate a valid recipe.'}), 400

if __name__ == '__main__':
    app.run(debug=True)