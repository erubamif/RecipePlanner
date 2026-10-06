import {
  addFavorite,
  removeFavorite,
  isFavorite,
  addToMealPlan,
} from "./storage.js";

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

function setupFavoriteButton(meal) {
  const favoriteButton = document.querySelector("#favorite-button");

  if (!favoriteButton) {
    return;
  }

  function updateButton() {
    if (isFavorite(meal.idMeal)) {
      favoriteButton.textContent = "♥ Remove from Favorites";
      favoriteButton.setAttribute("aria-pressed", "true");
    } else {
      favoriteButton.textContent = "♡ Add to Favorites";
      favoriteButton.setAttribute("aria-pressed", "false");
    }
  }
    setupMealPlanButton(meal);

  updateButton();

  favoriteButton.addEventListener("click", () => {
    if (isFavorite(meal.idMeal)) {
      removeFavorite(meal.idMeal);
    } else {
      addFavorite(meal);
    }

    updateButton();
  });
}

function setupMealPlanButton(meal) {
  const mealPlanButton = document.querySelector("#meal-plan-button");

  if (!mealPlanButton) {
    return;
  }

  mealPlanButton.addEventListener("click", () => {
    const day = prompt(
      "Which day would you like to add this recipe to?\n\n" +
      "Enter: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday"
    );

    if (!day) {
      return;
    }

    const formattedDay =
      day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    if (!validDays.includes(formattedDay)) {
      alert("Please enter a valid day of the week.");
      return;
    }

    addToMealPlan(formattedDay, meal);

    alert(`${meal.strMeal} was added to your ${formattedDay} meal plan.`);
  });
}