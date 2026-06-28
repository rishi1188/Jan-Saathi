const express = require("express");
const router = express.Router();
const { schemes, categories, searchSchemes, getSchemeById } = require("../data/schemes");

// GET /api/schemes — list all or search
router.get("/", (req, res) => {
  const { q, category } = req.query;
  const results = searchSchemes(q || "", { category });
  res.json({ schemes: results, total: results.length, categories });
});

// GET /api/schemes/categories
router.get("/categories", (req, res) => {
  res.json({ categories });
});

// GET /api/schemes/:id
router.get("/:id", (req, res) => {
  const scheme = getSchemeById(req.params.id);
  if (!scheme) return res.status(404).json({ error: "Scheme not found" });
  res.json({ scheme });
});

// POST /api/schemes/eligibility — check eligibility based on user profile
router.post("/eligibility", (req, res) => {
  const { occupation, residence, income, age, gender, category, hasBankAccount, hasLPG, hasPuccaHouse } = req.body;

  const matches = [];

  schemes.forEach((scheme) => {
    const e = scheme.eligibility;
    let score = 0;

    if (occupation && e.occupation && e.occupation.includes(occupation)) score += 3;
    if (residence && e.residence && e.residence === residence) score += 2;
    if (gender && e.gender && e.gender === gender) score += 2;
    if (category && e.category && e.category.includes(category)) score += 3;
    if (age && e.age) {
      if (e.age.min && age >= e.age.min) score += 1;
      if (e.age.max && age <= e.age.max) score += 1;
    }
    if (income === "below_poverty_line" && e.incomeGroup === "below_poverty_line") score += 3;
    if (hasBankAccount === false && scheme.id === "jan-dhan") score += 5;
    if (hasLPG === false && scheme.id === "pm-ujjwala" && gender === "female") score += 5;
    if (hasPuccaHouse === false && residence === "rural") score += 2;

    // Generic high-value schemes everyone should know about
    if (["jan-dhan", "e-shram", "ayushman-bharat"].includes(scheme.id)) score += 1;

    if (score > 0) matches.push({ ...scheme, relevanceScore: score });
  });

  matches.sort((a, b) => b.relevanceScore - a.relevanceScore);

  res.json({ schemes: matches.slice(0, 5), total: matches.length });
});

module.exports = router;
