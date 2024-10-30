import React, { useEffect, useState } from 'react';

function RecipeDetails() {
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const recipeData = localStorage.getItem('recipeDetails');
        if (recipeData) {
            setRecipe(JSON.parse(recipeData));
        }
    }, []);

    if (!recipe) {
        return <div>Loading recipe...</div>;
    }

    const cleanInstructions = (instructions) => {
        return instructions
            .split('\n') // Split by new lines
            .filter(line => line.trim() !== '') // Remove empty lines
            .map((step, index) => {
                const cleanedStep = step.replace(/[*#]/g, '').trim(); // Clean unwanted symbols
                return <p key={index}>{`${index + 1}. ${cleanedStep}`}</p>;
            });
    };

    return (
        <div>
            <h1>{recipe.recipe_name}</h1>
            <h2>Ingredients</h2>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
            <h3>Steps To Prepare</h3>
            <div>{cleanInstructions(recipe.instructions)}</div>
            <h4>Calories: {recipe.calories}</h4> {/* Display calorie information */}
        </div>
    );
}

export default RecipeDetails;
