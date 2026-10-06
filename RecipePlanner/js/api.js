const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

/**
 * Search for meals by name.
 * @param {string} query - The meal name or search term.
 * @returns {Promise<Array>} Array of meals.
 */
export async function searchMeals(query) {
  const url = `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to retrieve recipes.");
  }

  const data = await response.json();

  return data.meals || [];
}

/**
 * Get the details of one meal.
 * @param {string} mealId - The meal ID.
 * @returns {Promise<Object|null>} Meal details.
 */
export async function getMealById(mealId) {
  const url = `${BASE_URL}/lookup.php?i=${encodeURIComponent(mealId)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to retrieve the recipe.");
  }

  const data = await response.json();

  return data.meals ? data.meals[0] : null;
}

/**
 * Get all available recipe categories.
 * @returns {Promise<Array>} Recipe categories.
 */
export async function getCategories() {
  const url = `${BASE_URL}/list.php?c=list`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to retrieve recipe categories.");
  }

  const data = await response.json();

  return data.meals || [];
}

/**
 * Get recipes from a specific category.
 * @param {string} category - Recipe category.
 * @returns {Promise<Array>} Recipes in the category.
 */
export async function getMealsByCategory(category) {
  const url =
    `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to retrieve recipes for this category.");
  }

  const data = await response.json();

  return data.meals || [];
}