# Dinner Wheel

Spin a 3D lazy susan (three.js) for tonight's dinner, plan the week, and generate new recipes from what's in the pantry.

## Files

```
index.html     page layout, loads three.js from jsDelivr via an import map
styles.css     styling (light and dark mode)
js/app.js      tabs, pantry, matching, week planner, idea generator
js/wheel.js    the three.js lazy susan
js/data.js     ingredients, recipes, and idea templates  <-- edit this one
```

## Host on GitHub Pages

1. Create a repo (e.g. `dinner-wheel`) and put these files at the repo root.
2. Repo **Settings > Pages > Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder = `/ (root)`.
3. Wait a minute, then open `https://<your-username>.github.io/dinner-wheel/`.

## Run locally

ES modules don't load from `file://`, so serve the folder:

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Editing

- **Pantry:** use the Pantry tab. Changes save in your browser (localStorage), so each device keeps its own pantry.
- **Recipes:** add to `RECIPES` in `js/data.js`. `req` = must have, `opt` = nice to have, `main` = the protein (used to keep variety in the week plan). Use ingredient ids from `INGREDIENTS`.
- **New ingredient for everyone:** add it to `INGREDIENTS` with a `role` (`protein`, `carb`, `veg`, `sauce`, `cheese`, ...). Proteins need `formats` and `prep`; carbs need `how`; sauces need `adj`.
- **Occasional foods:** `treat: true` on an ingredient or `occasional: true` on a recipe hides it unless "Include occasional meals" is checked.

## How it picks

- The wheel only shows dinners you have every required ingredient for.
- "Cooked it" logs the dinner; the last 4 sit out a few spins.
- The week plan picks 6 dinners plus a leftovers night, max 2 per protein, no protein twice in a row, and lists batch-cook days and anything to buy.
