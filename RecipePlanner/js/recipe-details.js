import { getMealById } from "./api.js";
import { setupNavigation } from "./navigation.js";

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  loadRecipeDetails();
});

async function loadRecipeDetails() {
  const detailsContainer = document.querySelector("#recipe-details");

  const params = new URLSearchParams(window.location.search);
  const mealId = params.get("id");

  if (!mealId) {
    detailsContainer.innerHTML = `
      <p class="empty-message">
        No recipe was selected.
      </p>
    `;
    return;
  }

  try {
    const meal = await getMealById(mealId);

    if (!meal) {
      detailsContainer.innerHTML = `
        <p class="empty-message">
          Recipe not found.
        </p>
      `;
      return;
    }

    displayRecipeDetails(meal);
  } catch (error) {
    console.error("Recipe details error:", error);

    detailsContainer.innerHTML = `
      <p class="empty-message">
        Sorry, we could not load this recipe.
        Please try again later.
      </p>
    `;
  }
}

function displayRecipeDetails(meal) {
  const detailsContainer = document.querySelector("#recipe-details");

  const ingredients = getIngredients(meal);

  detailsContainer.innerHTML = `
    <article class="recipe-details">

      <div class="recipe-details-header">

        <img
          src="${meal.strMealThumb}"
          alt="${meal.strMeal}"
          class="recipe-details-image"
        >

        <div class="recipe-details-intro">

          <p class="eyebrow">RECIPE</p>

          <h1>${meal.strMeal}</h1>

          <p class="recipe-meta">
            ${meal.strCategory || "Recipe"}
            ${meal.strArea ? ` • ${meal.strArea}` : ""}
          </p>

          <div class="recipe-details-actions">
            <button
              type="button"
              class="primary-button"
              id="favorite-button"
              data-id="${meal.idMeal}"
            >
              ♡ Add to Favorites
            </button>

            <button
              type="button"
              class="secondary-button"
              id="meal-plan-button"
              data-id="${meal.idMeal}"
            >
              + Add to Meal Plan
            </button>
          </div>

        </div>

      </div>

      <div class="recipe-details-content">

        <section class="ingredients-section">
          <h2>Ingredients</h2>

          <ul class="ingredients-list">
            ${ingredients
              .map(
                (ingredient) => `
                  <li>
                    <span>${ingredient.measure}</span>
                    ${ingredient.name}
                  </li>
                `
              )
              .join("")}
          </ul>
        </section>

        <section class="instructions-section">
          <h2>Cooking Instructions</h2>

          <div class="instructions">
            ${formatInstructions(meal.strInstructions)}
          </div>
        </section>

      </div>

    </article>
  `;
}

function getIngredients(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure ? measure.trim() : "",
      });
    }
  }

  return ingredients;
}

function formatInstructions(instructions) {
  if (!instructions) {
    return "<p>No cooking instructions are available.</p>";
  }

  return instructions
    .split(/\r?\n/)
    .filter((step) => step.trim() !== "")
    .map((step) => `<p>${step.trim()}</p>`)
    .join("");
}