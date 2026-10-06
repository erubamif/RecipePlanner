const FAVORITES_KEY = "recipePlannerFavorites";

/**
 * Get all saved favorite recipes.
 * @returns {Array} Saved favorite recipes.
 */
export function getFavorites() {
  const favorites = localStorage.getItem(FAVORITES_KEY);

  return favorites ? JSON.parse(favorites) : [];
}

/**
 * Save a recipe to favorites.
 * @param {Object} recipe - Recipe to save.
 */
export function addFavorite(recipe) {
  const favorites = getFavorites();

  const alreadyExists = favorites.some(
    (favorite) => favorite.idMeal === recipe.idMeal
  );

  if (!alreadyExists) {
    favorites.push(recipe);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

/**
 * Remove a recipe from favorites.
 * @param {string} mealId - ID of the recipe to remove.
 */
export function removeFavorite(mealId) {
  const favorites = getFavorites();

  const updatedFavorites = favorites.filter(
    (favorite) => favorite.idMeal !== mealId
  );

  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(updatedFavorites)
  );
}

/**
 * Check whether a recipe is already a favorite.
 * @param {string} mealId - Recipe ID.
 * @returns {boolean} True if the recipe is saved.
 */
export function isFavorite(mealId) {
  const favorites = getFavorites();

  return favorites.some(
    (favorite) => favorite.idMeal === mealId
  );
}

const MEAL_PLAN_KEY = "recipePlannerMealPlan";

/**
 * Get the saved meal plan.
 * @returns {Object} Saved meal plan.
 */
export function getMealPlan() {
  const mealPlan = localStorage.getItem(MEAL_PLAN_KEY);

  return mealPlan
    ? JSON.parse(mealPlan)
    : {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      };
}

/**
 * Add a recipe to a specific day.
 * @param {string} day - Day of the week.
 * @param {Object} recipe - Recipe to add.
 */
export function addToMealPlan(day, recipe) {
  const mealPlan = getMealPlan();

  if (!mealPlan[day]) {
    mealPlan[day] = [];
  }

  const alreadyExists = mealPlan[day].some(
    (meal) => meal.idMeal === recipe.idMeal
  );

  if (!alreadyExists) {
    mealPlan[day].push(recipe);

    localStorage.setItem(
      MEAL_PLAN_KEY,
      JSON.stringify(mealPlan)
    );
  }
}

/**
 * Remove a recipe from a specific day.
 * @param {string} day - Day of the week.
 * @param {string} mealId - Recipe ID.
 */
export function removeFromMealPlan(day, mealId) {
  const mealPlan = getMealPlan();

  if (!mealPlan[day]) {
    return;
  }

  mealPlan[day] = mealPlan[day].filter(
    (meal) => meal.idMeal !== mealId
  );

  localStorage.setItem(
    MEAL_PLAN_KEY,
    JSON.stringify(mealPlan)
  );
}

/**
 * Clear the entire meal plan.
 */
export function clearMealPlan() {
  localStorage.removeItem(MEAL_PLAN_KEY);
}