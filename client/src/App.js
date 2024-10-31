import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'; // Added useNavigate import
import './styles.css';
import RecipeForm from './RecipeForm';
import RecipeDetails from './RecipeDetails';
import HeroSection from './HeroSection'; // Import the HeroSection component
import Chatbot from './Chatbot';

function App() {
  const [recipeData, setRecipeData] = useState(null); // State to hold recipe data
  
  return (
    <Router>
      <div className="App">
        <Chatbot/>
        <Header />
        <HeroSection />
        <Routes>
          <Route 
            path="/" 
            element={<RecipeFormSection setRecipeData={setRecipeData} />} 
          />
          <Route 
            path="/recipe" 
            element={<RecipeDetails recipeData={recipeData} />} 
          />
        </Routes>
        <FeaturesSection />
        <HowItWorks />
        <Contact />
      </div>
    </Router>
  );
}

const Header = () => (
  <header>
    <nav>
      <div className="logo">MealMingle</div>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#contact">Contact Us</a></li>
      </ul>
      <button className="get-started">Get Started</button>
    </nav>
  </header>
);

const RecipeFormSection = ({ setRecipeData }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleRecipeGeneration = async (ingredients) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ingredients })
      });

      if (response.ok) {
        const recipeDetails = await response.json();
        setRecipeData(recipeDetails); // Store recipe data
        navigate('/recipe'); // Navigate to recipe details page
      } else {
        console.error('Failed to fetch recipe.');
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
    }
  };

  return (
    <section className="recipe-form-section">
      <div className="form-container">
        <RecipeForm onGenerate={handleRecipeGeneration} />
      </div>
    </section>
  );
};

const FeaturesSection = () => (
  <section className="features" id="features">
    <h2>Features</h2>
    <div className="features-list">
      <div className="feature">
        <h3>Easy Ingredient Input</h3>
        <p>Quickly enter the ingredients you have at hand to get started.</p>
      </div>
      <div className="feature">
        <h3>Personalized Recipe Suggestions</h3>
        <p>Receive tailored recipes based on your available ingredients.</p>
      </div>
      <div className="feature">
        <h3>Nutritional Information</h3>
        <p>View nutritional details for each recipe to help you make healthy choices.</p>
      </div>
      <div className="feature">
        <h3>User-Friendly Interface</h3>
        <p>Enjoy a seamless and intuitive experience while exploring recipes.</p>
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="how-it-works" id="how-it-works">
    <h2>How MealMingle Works</h2>
    <div className="steps">
      <div className="step">
        <h3>Step 1: Add Your Ingredients</h3>
        <p>Simply enter the ingredients you have at hand into the form below.</p>
      </div>
      <div className="step">
        <h3>Step 2: Generate Recipes</h3>
        <p>Click the "Generate Recipes" button to see delicious meal options you can make with your ingredients.</p>
      </div>
      <div className="step">
        <h3>Step 3: Cook and Enjoy</h3>
        <p>Follow the recipe instructions and enjoy a delicious, home-cooked meal!</p>
      </div>
    </div>
  </section>
);

const Contact=()=>(
  <section className="contact" id="contact">
    <h2>Contact Us</h2>
    <p>If you have any questions, feedback,or need assistance,feel free to reach out!</p>
    <p>Email : prajwaljm123@gmail.com / mamathadeeksha123@gmail.com</p>
    <p>8088036094 / 9845568752</p>
    <p>Follow Os on Social Media for the latest updates</p>
  </section>
);
export default App;
