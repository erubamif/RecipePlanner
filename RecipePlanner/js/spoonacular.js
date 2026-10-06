const SPOONACULAR_BASE_URL =
  "https://api.spoonacular.com/recipes";

/**
 * Search Spoonacular recipes.
 * This function will be connected to a secure backend later.
 *
 * @param {string} query - Recipe search term.
 * @returns {Promise<Array>} Recipe results.
 */
export async function searchSpoonacularRecipes(query) {
  const url =
    `${SPOONACULAR_BASE_URL}/complexSearch` +
    `?query=${encodeURIComponent(query)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to retrieve Spoonacular recipes.");
  }

  const data = await response.json();

  return data.results || [];
}