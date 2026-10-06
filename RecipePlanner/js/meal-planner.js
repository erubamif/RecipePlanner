import {
  getMealPlan,
  removeFromMealPlan,
  clearMealPlan,
} from "./storage.js";
import { setupNavigation } from "./navigation.js";

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  displayMealPlan();
});

function displayMealPlan() {
  const mealPlanContainer = document.querySelector("#meal-plan");

  if (!mealPlanContainer) {
    return;
  }

  const mealPlan = getMealPlan();

  mealPlanContainer.innerHTML = Object.keys(mealPlan)
    .map((day) => createDaySection(day, mealPlan[day]))
    .join("");

  setupRemoveButtons();
  setupClearButton();
}

function createDaySection(day, meals) {
  return `
    <section class="meal-plan-day">

      <div class="meal-plan-day-header">
        <h2>${day}</h2>
        <span>${meals.length} recipe${meals.length !== 1 ? "s" : ""}</span>
      </div>

      ${
        meals.length === 0
          ? `
            <p class="empty-message">
              No recipes planned for ${day}.
            </p>
          `
          : `
            <div class="meal-plan-recipes">
              ${meals.map((meal) => createMealCard(day, meal)).join("")}
            </div>
          `
      }

    </section>
  `;
}

function createMealCard(day, meal) {
  return `
    <article class="meal-plan-card">

      <img
        src="${meal.strMealThumb}"
        alt="${meal.strMeal}"
        loading="lazy"
      >

      <div class="meal-plan-card-content">

        <h3>${meal.strMeal}</h3>

        <p>
          ${meal.strCategory || "Recipe"}
          ${meal.strArea ? `• ${meal.strArea}` : ""}
        </p>

        <div class="recipe-card-actions">

          <a
            href="recipe-details.html?id=${meal.idMeal}"
            class="primary-button"
          >
            View Recipe
          </a>

          <button
            type="button"
            class="secondary-button remove-meal-button"
            data-day="${day}"
            data-id="${meal.idMeal}"
          >
            Remove
          </button>

        </div>

      </div>

    </article>
  `;
}

function setupRemoveButtons() {
  const buttons = document.querySelectorAll(".remove-meal-button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const day = button.dataset.day;
      const mealId = button.dataset.id;

      removeFromMealPlan(day, mealId);

      displayMealPlan();
    });
  });
}

function setupClearButton() {
  const clearButton = document.querySelector("#clear-meal-plan");

  if (!clearButton) {
    return;
  }

  clearButton.addEventListener("click", () => {
    const confirmed = confirm(
      "Are you sure you want to clear your entire meal plan?"
    );

    if (!confirmed) {
      return;
    }

    clearMealPlan();
    displayMealPlan();
  });
}