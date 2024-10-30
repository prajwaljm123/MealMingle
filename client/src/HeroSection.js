import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGenerateRecipes = () => {
    navigate('/'); // Navigate to RecipeForm page or section
  };

  const handleLearnMore = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Discover Recipes with MealMingle</h1>
        <p>Input your available ingredients and let us suggest the perfect meal for you!</p>
        <div className="cta-buttons">
          <button className="cta" onClick={handleGenerateRecipes}>Generate Recipes</button>
          <button className="cta" onClick={handleLearnMore}>Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
