import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Ensure you import the styles

function RecipeForm({ onGenerate }) {
    const [ingredients, setIngredients] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ingredientsArray = ingredients.split(',').map(item => item.trim());
        
        const response = await fetch('http://127.0.0.1:5000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients: ingredientsArray }),
        });

        if (response.ok) {
            const recipeDetails = await response.json();
            console.log(recipeDetails); // Print recipe details to console for debugging
            localStorage.setItem('recipeDetails', JSON.stringify(recipeDetails));
            navigate('/recipe');
        } else {
            alert('Error generating recipe');
        }
    };

    return (
        <div className="recipe-form">
            <h2>Generate a Recipe</h2>
            <form onSubmit={handleSubmit} className="recipe-form-container">
                <label htmlFor="ingredients-input">
                    Enter Ingredients (comma-separated):
                    <input
                        id="ingredients-input"
                        type="text"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        className="ingredients-input" // Optional class for custom styling
                    />
                </label>
                <button type="submit" className="generate-button">Generate Recipe</button>
            </form>
        </div>
    );
}

export default RecipeForm;
