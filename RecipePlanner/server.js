const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
console.log("API key loaded:", !!process.env.API_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/recipes", async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({
        message: "Please provide a recipe search term."
      });
    }

    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&query=${encodeURIComponent(query)}&number=10&addRecipeInformation=true`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Recipe API error:", error);

    res.status(500).json({
      message: "Unable to retrieve recipes."
    });
  }
});

app.get("/api/random-meal", async (req, res) => {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Unable to retrieve a random meal."
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Random meal API error:", error);

    res.status(500).json({
      message: "Unable to retrieve random meal."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});