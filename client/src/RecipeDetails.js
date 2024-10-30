import React, { useEffect, useState } from 'react';
import './styles.css'; // Ensure to import your CSS styles

function RecipeDetails() {
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const recipeData = localStorage.getItem('recipeDetails');
        if (recipeData) {
            setRecipe(JSON.parse(recipeData));
        }
    }, []);

    if (!recipe) {
        return <div className="loading">Loading recipe...</div>;
    }

    const cleanInstructions = (instructions) => {
        return instructions
            .split('\n') // Split by new lines
            .filter(line => line.trim() !== '') // Remove empty lines
            .map((step, index) => {
                const cleanedStep = step.replace(/[*#]/g, '').trim(); // Clean unwanted symbols
                return <p key={index}>&nbsp;&nbsp;{`${cleanedStep}`}</p>;
            });
    };

    return (
        <div className="recipe-details">
            <h1>{recipe.recipe_name}</h1>
            <h2 className="centered-heading">Ingredients</h2>
            <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">{ingredient}</li> // Changed to <li> for semantic HTML
                ))}
            </ul>
            <h3 className="centered-heading">Steps To Prepare</h3>
            <div className="instructions">
                {cleanInstructions(recipe.instructions)}
            </div>
            <h4>Calories: &nbsp;&nbsp;{recipe.calories}</h4> {/* Display calorie information */}
        </div>
    );
}

export default RecipeDetails;
