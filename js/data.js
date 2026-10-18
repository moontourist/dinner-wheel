// Dinner Wheel data
// ---------------------------------------------------------------------------
// INGREDIENTS: everything the app knows about. `have: true` means it starts
// checked in your pantry. Edit freely; the Pantry tab saves your changes in
// the browser, and "Reset pantry" brings these defaults back.
//
// RECIPES: fixed recipes. `req` = must have, `opt` = nice to have.
// `occasional: true` hides a recipe unless "Include occasional" is on.
//
// FORMATS: the templates the "New ideas" generator mixes ingredients into.
// ---------------------------------------------------------------------------

const ALL_FORMATS = ['bowl', 'stirfry', 'tacos', 'sheetpan', 'pasta', 'friedrice', 'soup', 'scramble', 'flatbread'];

export const CATEGORIES = ['Protein', 'Carbs', 'Produce & Beans', 'Sauces & Flavor', 'Dairy', 'Snacks & Drinks', 'Other'];

export const INGREDIENTS = [
  // Protein
  { id: 'chicken-breast', name: 'Chicken breast', short: 'Chicken', cat: 'Protein', role: 'protein', have: true, formats: ALL_FORMATS,
    prep: 'Use batch-cooked chicken, or season and bake breasts at 425°F for 20 to 25 min (165°F inside). Slice or dice.' },
  { id: 'ground-turkey', name: 'Ground turkey', short: 'Turkey', cat: 'Protein', role: 'protein', have: true,
    formats: ['bowl', 'tacos', 'pasta', 'scramble', 'stirfry', 'friedrice', 'soup', 'flatbread'],
    prep: 'Brown the turkey, breaking it up, until cooked through (165°F). Season it well; turkey needs it.' },
  { id: 'ground-beef', name: 'Ground beef', short: 'Beef', cat: 'Protein', role: 'protein', have: true,
    formats: ['bowl', 'tacos', 'pasta', 'scramble', 'stirfry', 'flatbread'],
    prep: 'Brown the beef, breaking it up, until no pink remains (160°F). Drain the fat.' },
  { id: 'steak-bites', name: 'Steak bites', short: 'Steak Bite', cat: 'Protein', role: 'protein', have: true,
    formats: ['bowl', 'stirfry', 'tacos', 'friedrice', 'sheetpan', 'scramble'],
    prep: 'Pat the steak bites dry and sear in a very hot pan 2 to 3 min, turning, until browned.' },
  { id: 'ny-strip', name: 'NY strip steak', short: 'Steak', cat: 'Protein', role: 'protein', have: true,
    formats: ['bowl', 'tacos', 'sheetpan', 'stirfry'],
    prep: 'Salt the steak ahead if you can. Sear 3 to 4 min per side for medium, rest 5 min, then slice thin.' },
  { id: 'chicken-sausage', name: 'Chicken sausage', short: 'Chicken Sausage', cat: 'Protein', role: 'protein', have: true,
    formats: ['sheetpan', 'pasta', 'scramble', 'friedrice', 'soup', 'bowl', 'flatbread'],
    prep: 'Slice the sausage into coins and brown 4 to 5 min.' },
  { id: 'chicken-sausage-meatballs', name: 'Chicken sausage meatballs', short: 'Meatball', cat: 'Protein', role: 'protein', have: true,
    formats: ['pasta', 'soup', 'bowl', 'sheetpan', 'flatbread'],
    prep: 'Brown the meatballs in a pan, or bake at 400°F for 12 to 15 min until hot through.' },
  { id: 'eggs', name: 'Eggs', short: 'Egg', cat: 'Protein', role: 'protein', have: true, formats: ['friedrice', 'scramble'],
    prep: 'Scramble 2 to 3 eggs softly and set aside.' },
  { id: 'bacon', name: 'Bacon', short: 'Bacon', cat: 'Protein', role: 'protein', have: true, treat: true, formats: ['scramble', 'pasta', 'bowl'],
    prep: 'Cook 2 slices until crisp and crumble. Treat it as flavor, not the main protein.' },
  { id: 'spam', name: 'Spam', short: 'Spam', cat: 'Protein', role: 'protein', have: true, treat: true, formats: ['friedrice', 'bowl', 'scramble'],
    prep: 'Dice about a quarter of the can and crisp it in a dry pan.' },
  { id: 'chorizo', name: 'Chorizo', short: 'Chorizo', cat: 'Protein', role: 'protein', have: true, treat: true, formats: ['tacos', 'scramble', 'bowl'],
    prep: 'Brown a small amount of chorizo. A little goes a long way.' },

  // Carbs
  { id: 'rice', name: 'Rice', short: 'Rice', cat: 'Carbs', role: 'carb', have: true, how: 'Cook the rice, or reheat batch-cooked rice.' },
  { id: 'pasta', name: 'Pasta', short: 'Pasta', cat: 'Carbs', role: 'carb', have: true, how: 'Boil the pasta. Aim for about 1 cup cooked per person.' },
  { id: 'tortillas', name: 'Tortillas', short: 'Tortilla', cat: 'Carbs', role: 'carb', have: true, how: 'Warm the tortillas in a dry pan.' },
  { id: 'sweet-potato', name: 'Sweet potato', short: 'Sweet Potato', cat: 'Carbs', role: 'carb', have: true,
    how: 'Cube the sweet potato and roast at 425°F for 25 min, or microwave it whole for 5 to 7 min.' },
  { id: 'naan', name: 'Naan bread', short: 'Naan', cat: 'Carbs', role: 'carb', have: true, how: 'Warm the naan.' },
  { id: 'sourdough', name: 'Sourdough', short: 'Sourdough', cat: 'Carbs', role: 'carb', have: true, how: 'Toast a slice of sourdough.' },
  { id: 'bread', name: 'Bread', short: 'Toast', cat: 'Carbs', role: 'carb', have: true, how: 'Toast a slice of bread.' },
  { id: 'potatoes', name: 'Potatoes', short: 'Potato', cat: 'Carbs', role: 'carb', have: false, how: 'Cube the potatoes and roast at 425°F for 30 min.' },
  { id: 'fries', name: 'Fries', short: 'Fries', cat: 'Carbs', role: 'carb', have: true, treat: true },
  { id: 'mac-and-cheese', name: "Mac and cheese (Annie's)", short: 'Mac', cat: 'Carbs', role: 'carb', have: true, treat: true },

  // Produce & Beans
  { id: 'broccoli', name: 'Broccoli', cat: 'Produce & Beans', role: 'veg', have: true },
  { id: 'bell-peppers', name: 'Bell peppers', cat: 'Produce & Beans', role: 'veg', have: true },
  { id: 'carrots', name: 'Carrots', cat: 'Produce & Beans', role: 'veg', have: true },
  { id: 'onion', name: 'Onion', cat: 'Produce & Beans', role: 'veg', have: true },
  { id: 'corn', name: 'Corn', cat: 'Produce & Beans', role: 'veg', have: true },
  { id: 'black-beans', name: 'Black beans', cat: 'Produce & Beans', role: 'veg', have: true },
  { id: 'refried-beans', name: 'Refried beans', cat: 'Produce & Beans', role: 'veg', have: true },
  { id: 'garlic', name: 'Garlic', cat: 'Produce & Beans', role: 'aromatic', have: true },
  { id: 'baby-carrots', name: 'Baby carrots', cat: 'Produce & Beans', role: 'snack', have: true },

  // Sauces & Flavor
  { id: 'cholula', name: 'Cholula', cat: 'Sauces & Flavor', role: 'sauce', have: true, adj: 'Spicy' },
  { id: 'soy-sauce', name: 'Soy sauce', cat: 'Sauces & Flavor', role: 'sauce', have: true, adj: 'Soy-Garlic' },
  { id: 'teriyaki', name: 'Teriyaki sauce', cat: 'Sauces & Flavor', role: 'sauce', have: true, adj: 'Teriyaki' },
  { id: 'chicken-bouillon', name: 'Chicken bouillon', cat: 'Sauces & Flavor', role: 'sauce', have: true, adj: 'Brothy' },
  { id: 'hummus', name: 'Hummus', cat: 'Sauces & Flavor', role: 'sauce', have: true, adj: 'Hummus' },
  { id: 'salsa', name: 'Salsa', cat: 'Sauces & Flavor', role: 'sauce', have: false, adj: 'Salsa' },
  { id: 'tomato-sauce', name: 'Tomato / pasta sauce', cat: 'Sauces & Flavor', role: 'sauce', have: false, adj: 'Red Sauce' },
  { id: 'curry-roux', name: 'Curry roux blocks', cat: 'Sauces & Flavor', role: 'sauce', have: false, adj: 'Curry' },

  // Dairy
  { id: 'cheddar', name: 'Cheddar', cat: 'Dairy', role: 'cheese', have: true, adj: 'Cheddar' },
  { id: 'parmesan', name: 'Parmesan', cat: 'Dairy', role: 'cheese', have: true, adj: 'Garlic Parmesan' },

  // Snacks & Drinks
  { id: 'popcorn', name: 'Popcorn', cat: 'Snacks & Drinks', role: 'snack', have: true },
  { id: 'sparkling-water', name: 'Sparkling water', cat: 'Snacks & Drinks', role: 'drink', have: true },
  { id: 'coke-zero', name: 'Coke Zero', cat: 'Snacks & Drinks', role: 'drink', have: true },
  { id: 'dried-mango', name: 'Dried mango', cat: 'Snacks & Drinks', role: 'snack', have: true, treat: true },

  // Other
  { id: 'chicken-noodle-soup', name: 'Chicken noodle soup (canned)', cat: 'Other', role: 'other', have: true },
];

export const RECIPES = [
  {
    id: 'turkey-taco-bowls', name: 'Turkey Taco Bowls', short: 'Turkey Taco Bowls', main: 'ground-turkey', minutes: 20, batch: true,
    req: ['ground-turkey', 'rice', 'black-beans', 'corn'], opt: ['bell-peppers', 'onion', 'cholula', 'cheddar'],
    steps: [
      'Brown the turkey with diced onion and peppers. Season with chili powder, cumin, and salt (or a taco packet).',
      'Warm the black beans and corn together.',
      'Build bowls: a fist of rice, beans and corn, then a big scoop of turkey.',
      'Top with Cholula and a small pinch of cheddar.',
    ],
    tip: 'Makes 3 to 4 servings. The turkey keeps 3 to 4 days in the fridge.',
  },
  {
    id: 'teriyaki-chicken-stirfry', name: 'Teriyaki Chicken Stir-Fry', short: 'Teriyaki Stir-Fry', main: 'chicken-breast', minutes: 20,
    req: ['chicken-breast', 'broccoli', 'rice', 'teriyaki'], opt: ['carrots', 'bell-peppers', 'onion', 'garlic'],
    steps: [
      'Slice the chicken, or use batch-cooked chicken.',
      'Stir-fry the broccoli, carrots, peppers, and onion in a little oil over high heat for 4 to 5 min. Add garlic for the last 30 sec.',
      'Add the chicken and teriyaki and toss for 1 to 2 min.',
      'Serve over a fist of rice.',
    ],
    tip: 'Go heavy on the veg. It is the cheapest way to make the plate bigger.',
  },
  {
    id: 'chicken-fajitas', name: 'Chicken Fajitas', short: 'Chicken Fajitas', main: 'chicken-breast', minutes: 20,
    req: ['chicken-breast', 'bell-peppers', 'onion', 'tortillas'], opt: ['cholula', 'cheddar'],
    steps: [
      'Slice the peppers and onion into strips. Cook over high heat 6 to 8 min until charred at the edges.',
      'Add sliced chicken and season with chili powder, cumin, and salt.',
      'Warm the tortillas and fill them.',
      'Finish with Cholula.',
    ],
    tip: '2 to 3 tortillas, loaded with filling, is a full meal.',
  },
  {
    id: 'garlic-parm-meatball-pasta', name: 'Garlic Parmesan Meatball Pasta', short: 'Meatball Pasta', main: 'chicken-sausage-meatballs', minutes: 25,
    req: ['chicken-sausage-meatballs', 'pasta', 'broccoli', 'garlic', 'parmesan'], opt: ['chicken-bouillon'],
    steps: [
      'Boil the pasta. Add the broccoli to the pot for the last 3 min.',
      'Brown the meatballs in a pan.',
      'Cook minced garlic in a little oil for 1 min. Add half a cup of pasta water and a little bouillon.',
      'Toss in the pasta, broccoli, and meatballs. Finish with parmesan.',
    ],
    tip: 'More broccoli, less pasta. About 1 cup of cooked pasta per person.',
  },
  {
    id: 'egg-fried-rice', name: 'Egg Fried Rice', short: 'Egg Fried Rice', main: 'eggs', minutes: 15,
    req: ['rice', 'eggs', 'soy-sauce'], opt: ['carrots', 'corn', 'onion', 'chicken-breast'],
    steps: [
      'Day-old rice works best. Scramble 2 to 3 eggs and set aside.',
      'Stir-fry diced carrots, onion, and corn for 3 to 4 min.',
      'Add the rice, press it flat, and let it crisp for 2 min.',
      'Toss in the eggs, diced chicken, and soy sauce.',
    ],
    tip: 'Add batch-cooked chicken to turn this into a full-protein dinner.',
  },
  {
    id: 'steak-night', name: 'Steak, Sweet Potato & Broccoli', short: 'Steak Night', main: 'ny-strip', minutes: 40,
    req: ['ny-strip', 'sweet-potato', 'broccoli'], opt: ['garlic'],
    steps: [
      'Salt the steak, ideally the day before.',
      'Roast sweet potato wedges and broccoli at 425°F for about 25 min.',
      'Reverse sear: oven at 250°F until 120°F inside, then a very hot pan 1 min per side for medium.',
      'Rest 5 min, slice, and plate.',
    ],
    tip: 'Save half the steak for a steak bowl tomorrow.',
  },
  {
    id: 'loaded-chicken-soup', name: 'Loaded Chicken Noodle Soup', short: 'Loaded Soup', main: 'chicken-breast', minutes: 15,
    req: ['chicken-noodle-soup', 'chicken-breast', 'carrots'], opt: ['onion', 'sourdough'],
    steps: [
      'Sauté diced carrots (and onion) in a pot for 5 min.',
      'Add the soup and diced batch-cooked chicken.',
      'Simmer 10 min.',
      'Serve with one slice of toasted sourdough.',
    ],
    tip: 'Great low-effort night. The extra chicken makes canned soup an actual meal.',
  },
  {
    id: 'chicken-curry', name: 'Chicken Curry', short: 'Chicken Curry', main: 'chicken-breast', minutes: 35,
    req: ['chicken-breast', 'curry-roux', 'carrots', 'onion', 'rice'], opt: ['sweet-potato'],
    steps: [
      'Sauté the onion until soft.',
      'Add carrots, sweet potato cubes, and the water the box calls for. Simmer 15 min until tender.',
      'Turn off the heat, stir in the roux (a bit less than the box says), then simmer 5 min until thick.',
      'Add the chicken and serve over a fist of rice.',
    ],
    tip: 'A lighter katsu curry: baked chicken instead of fried, extra veg in the sauce.',
  },
  {
    id: 'steak-bite-bowls', name: 'Garlic Steak Bite Bowls', short: 'Steak Bite Bowls', main: 'steak-bites', minutes: 20,
    req: ['steak-bites', 'rice', 'broccoli', 'soy-sauce'], opt: ['garlic', 'teriyaki'],
    steps: [
      'Steam or roast the broccoli.',
      'Sear the steak bites in a very hot pan for 2 to 3 min.',
      'Add garlic and a splash of soy sauce for the last 30 sec.',
      'Serve over rice with the broccoli.',
    ],
    tip: 'High heat and a dry pan are the whole trick for good browning.',
  },
  {
    id: 'beef-bean-burritos', name: 'Beef & Bean Burritos', short: 'Beef Burritos', main: 'ground-beef', minutes: 25, batch: true,
    req: ['ground-beef', 'tortillas', 'refried-beans', 'onion'], opt: ['bell-peppers', 'cholula', 'cheddar', 'rice'],
    steps: [
      'Brown the beef with diced onion and drain the fat.',
      'Warm the refried beans.',
      'Fill each tortilla with beans, beef, peppers, and a little cheddar. Roll it up.',
      'Toast seam-side down in a pan until golden.',
    ],
    tip: 'Make a batch, wrap the extras in foil, and freeze them for busy nights.',
  },
  {
    id: 'sausage-sheet-pan', name: 'Chicken Sausage Sheet Pan', short: 'Sausage Sheet Pan', main: 'chicken-sausage', minutes: 35,
    req: ['chicken-sausage', 'sweet-potato', 'bell-peppers', 'broccoli'], opt: ['onion', 'cholula'],
    steps: [
      'Heat the oven to 425°F. Cube the sweet potato, toss with oil and salt, and roast 10 min for a head start.',
      'Add sliced sausage, peppers, onion, and broccoli to the pan.',
      'Roast 15 to 20 min more.',
      'One pan, done. Cholula on top if you want heat.',
    ],
    tip: 'Minimal dishes, which makes it an easy weeknight default.',
  },
  {
    id: 'breakfast-burritos', name: 'Breakfast-for-Dinner Burritos', short: 'Breakfast Burritos', main: 'eggs', minutes: 15,
    req: ['eggs', 'chicken-sausage', 'bell-peppers', 'tortillas'], opt: ['onion', 'cheddar', 'cholula'],
    steps: [
      'Brown sliced chicken sausage with diced peppers and onion.',
      'Add 3 beaten eggs and scramble softly.',
      'Fill warm tortillas, add a little cheddar.',
      'Cholula on top.',
    ],
    tip: 'Eggs plus sausage is a lot of protein for 15 minutes.',
  },
  {
    id: 'turkey-stuffed-peppers', name: 'Turkey Stuffed Peppers', short: 'Stuffed Peppers', main: 'ground-turkey', minutes: 40, batch: true,
    req: ['ground-turkey', 'bell-peppers', 'rice', 'black-beans'], opt: ['corn', 'onion', 'cheddar', 'cholula'],
    steps: [
      'Halve the peppers and scoop out the seeds.',
      'Mix cooked turkey, rice, black beans, and corn.',
      'Fill the peppers and top with a little cheddar.',
      'Bake covered at 375°F for 25 min, then uncovered for 5.',
    ],
    tip: 'Reheats well. Make 6 halves and you have 3 dinners.',
  },
  {
    id: 'hummus-chicken-naan', name: 'Hummus Chicken Naan Pizza', short: 'Naan Pizza', main: 'chicken-breast', minutes: 15,
    req: ['naan', 'hummus', 'chicken-breast', 'bell-peppers'], opt: ['onion', 'cheddar'],
    steps: [
      'Spread hummus on the naan.',
      'Top with sliced chicken, thin peppers and onion, and a little cheddar.',
      'Bake at 425°F for 8 to 10 min.',
      'Baby carrots on the side.',
    ],
    tip: 'Pizza night without the pizza.',
  },
  {
    id: 'turkey-meat-sauce', name: 'Turkey Meat Sauce Pasta', short: 'Turkey Pasta', main: 'ground-turkey', minutes: 25,
    req: ['ground-turkey', 'pasta', 'tomato-sauce', 'garlic'], opt: ['onion', 'parmesan', 'broccoli'],
    steps: [
      'Brown the turkey with onion and garlic.',
      'Add the tomato sauce and simmer 10 min.',
      'Boil the pasta; add broccoli for the last 3 min.',
      'Spoon lots of sauce over a modest pile of pasta. Parmesan on top.',
    ],
    tip: 'The sauce doubles easily. Freeze half.',
  },
  {
    id: 'teriyaki-meatball-bowls', name: 'Teriyaki Meatball Bowls', short: 'Meatball Bowls', main: 'chicken-sausage-meatballs', minutes: 20,
    req: ['chicken-sausage-meatballs', 'rice', 'teriyaki', 'broccoli'], opt: ['carrots'],
    steps: [
      'Bake the meatballs at 400°F for 12 to 15 min.',
      'Steam the broccoli and carrots.',
      'Toss the meatballs in teriyaki.',
      'Serve over a fist of rice with the veg.',
    ],
    tip: 'Fast, filling, and mostly hands-off.',
  },
  {
    id: 'beef-tacos', name: 'Taco Night', short: 'Taco Night', main: 'ground-beef', minutes: 20,
    req: ['ground-beef', 'tortillas', 'onion'], opt: ['bell-peppers', 'corn', 'cholula', 'cheddar'],
    steps: [
      'Brown the beef with onion, drain, and season with chili powder, cumin, and salt.',
      'Sauté peppers and corn on the side.',
      'Fill warm tortillas.',
      'Cholula and a little cheddar on top.',
    ],
    tip: 'Pile on the peppers and corn to stretch the beef further.',
  },
  {
    id: 'grown-up-mac', name: 'Grown-Up Mac & Cheese', short: 'Grown-Up Mac', main: 'chicken-breast', minutes: 15, occasional: true,
    req: ['mac-and-cheese', 'chicken-breast', 'broccoli'], opt: [],
    steps: [
      'Make half the box.',
      'Stir in diced batch-cooked chicken.',
      'Fold in a big pile of steamed broccoli.',
    ],
    tip: 'Same comfort food, roughly double the protein.',
  },
  {
    id: 'spam-egg-bowl', name: 'Spam & Egg Rice Bowl', short: 'Spam Bowl', main: 'spam', minutes: 15, occasional: true,
    req: ['spam', 'rice', 'eggs', 'teriyaki'], opt: ['corn', 'carrots'],
    steps: [
      'Slice the spam thin and crisp it in a dry pan. Glaze with teriyaki.',
      'Fry an egg or two.',
      'Serve over rice with corn and carrots.',
    ],
    tip: 'An occasional one. Salty, so drink extra water.',
  },
  {
    id: 'chorizo-hash', name: 'Chorizo Sweet Potato Hash', short: 'Chorizo Hash', main: 'chorizo', minutes: 25, occasional: true,
    req: ['chorizo', 'sweet-potato', 'eggs', 'onion'], opt: ['bell-peppers', 'cholula'],
    steps: [
      'Cube the sweet potato and microwave 4 min to soften.',
      'Brown a small amount of chorizo with onion and peppers.',
      'Add the sweet potato and crisp it in the chorizo oil.',
      'Top with fried eggs.',
    ],
    tip: 'Use a little chorizo for flavor and let the eggs carry the protein.',
  },
];

// ---------------------------------------------------------------------------
// Idea templates. Each one says which carbs / veg / sauces fit it, what it
// needs no matter what, and how to write the steps.
// ---------------------------------------------------------------------------
const lower = (s) => s.toLowerCase();
export const list = (arr) => arr.length <= 1 ? (arr[0] || '') : arr.length === 2 ? `${arr[0]} and ${arr[1]}` : `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`;

export const FORMATS = {
  bowl: {
    label: 'Bowl', minutes: 25,
    carbs: ['rice', 'sweet-potato', 'potatoes'], veg: ['broccoli', 'bell-peppers', 'corn', 'carrots', 'black-beans', 'onion'], vegCount: 2,
    sauces: ['teriyaki', 'soy-sauce', 'cholula', 'hummus', 'salsa'], needs: [], extras: ['cheddar', 'garlic'],
    name: ({ p, s }) => `${s.adj} ${p.short} Bowl`,
    steps: ({ p, c, v, s }) => [
      c.how,
      p.prep,
      `Cook the ${list(v.map((x) => lower(x.name)))} in a hot pan, or roast at 425°F, until tender with some browning.`,
      `Build the bowl: a fist of ${lower(c.short)}, a big pile of veg, then the ${lower(p.short)}. Finish with ${lower(s.name)}.`,
    ],
  },
  stirfry: {
    label: 'Stir-fry', minutes: 20,
    carbs: ['rice'], veg: ['broccoli', 'bell-peppers', 'carrots', 'onion', 'corn'], vegCount: 3,
    sauces: ['teriyaki', 'soy-sauce'], needs: [], extras: ['garlic'],
    name: ({ p, s }) => `${s.adj} ${p.short} Stir-Fry`,
    steps: ({ p, c, v, s, x }) => [
      c.how,
      p.prep,
      `Stir-fry the ${list(v.map((y) => lower(y.name)))} in a little oil over high heat for 4 to 5 min until crisp-tender${x.includes('garlic') ? ', adding minced garlic for the last 30 sec' : ''}.`,
      `Add the ${lower(p.short)} and ${lower(s.name)} and toss for 1 to 2 min. Serve over a fist of rice.`,
    ],
  },
  tacos: {
    label: 'Tacos', minutes: 20,
    carbs: ['tortillas'], veg: ['bell-peppers', 'onion', 'corn', 'black-beans', 'refried-beans'], vegCount: 2,
    sauces: ['cholula', 'salsa'], needs: [], extras: ['cheddar'],
    name: ({ p, s }) => `${s.adj} ${p.short} Tacos`,
    steps: ({ p, c, v, s, x }) => [
      `${p.prep} Season with chili powder, cumin, and salt.`,
      `Warm the ${list(v.map((y) => lower(y.name)))} in a hot pan.`,
      c.how,
      `Fill the tortillas and top with ${lower(s.name)}${x.includes('cheddar') ? ' and a small pinch of cheddar' : ''}.`,
    ],
  },
  sheetpan: {
    label: 'Sheet pan', minutes: 35,
    carbs: ['sweet-potato', 'potatoes'], veg: ['broccoli', 'bell-peppers', 'onion', 'carrots'], vegCount: 2,
    sauces: ['cholula', 'soy-sauce', 'teriyaki', 'hummus'], sauceOptional: true, needs: [], extras: [],
    name: ({ p, c }) => `${p.short} & ${c.short} Sheet Pan`,
    steps: ({ p, c, v, s }) => [
      `Heat the oven to 425°F. Cube the ${lower(c.name)}, toss with oil and salt, and roast 10 min for a head start.`,
      `Add the ${list(v.map((y) => lower(y.name)))} to the pan and roast 15 to 20 min more.`,
      `Meanwhile: ${p.prep}`,
      `Pile it all on a plate${s ? ` and finish with ${lower(s.name)}` : ''}.`,
    ],
  },
  pasta: {
    label: 'Pasta', minutes: 25,
    carbs: ['pasta'], veg: ['broccoli', 'bell-peppers', 'onion', 'corn'], vegCount: 2,
    sauces: ['parmesan', 'tomato-sauce', 'chicken-bouillon'], needs: ['garlic'], extras: ['parmesan'],
    name: ({ p, s }) => `${s.adj} ${p.short} Pasta`,
    steps: ({ p, c, v, s }) => [
      `${c.how} Add the ${list(v.map((y) => lower(y.name)))} to the pot for the last 3 min.`,
      p.prep,
      `Cook minced garlic in a little oil for 1 min, then add half a cup of pasta water${s.id === 'chicken-bouillon' ? ' and a spoonful of bouillon' : ''}.`,
      s.id === 'tomato-sauce' ? 'Add the tomato sauce, simmer 5 min, then toss in the pasta, veg, and protein.'
        : s.id === 'parmesan' ? 'Toss in the pasta, veg, and protein, then a big handful of parmesan until glossy.'
        : 'Toss in the pasta, veg, and protein and let the broth reduce for a minute. Parmesan on top if you have it.',
    ],
  },
  friedrice: {
    label: 'Fried rice', minutes: 15,
    carbs: ['rice'], veg: ['carrots', 'corn', 'onion', 'bell-peppers', 'broccoli'], vegCount: 2,
    sauces: ['soy-sauce', 'teriyaki'], needs: ['eggs'], extras: ['garlic'],
    name: ({ p }) => `${p.short} Fried Rice`,
    steps: ({ p, v, s }) => [
      'Day-old rice works best. Scramble 2 to 3 eggs and set aside.',
      ...(p.id === 'eggs' ? [] : [p.prep]),
      `Stir-fry the ${list(v.map((y) => lower(y.name)))} for 3 to 4 min.`,
      `Add the rice, press it flat, and let it crisp for 2 min. Toss in everything else with ${lower(s.name)}.`,
    ],
  },
  soup: {
    label: 'Soup', minutes: 30,
    carbs: ['pasta', 'rice'], veg: ['carrots', 'onion', 'corn', 'broccoli'], vegCount: 2,
    sauces: [], sauceOptional: true, needs: ['chicken-bouillon'], extras: ['garlic'],
    name: ({ p, c }) => `${p.short} & ${c.short} Soup`,
    steps: ({ p, c, v }) => [
      `Sauté the ${list(v.map((y) => lower(y.name)))} in a pot for 5 min.`,
      'Add 4 cups of water and bouillon (follow the jar), and bring to a simmer.',
      `Add a small handful of ${lower(c.name)} per person and cook until tender.`,
      `${p.prep} Stir it into the pot.`,
    ],
  },
  scramble: {
    label: 'Scramble', minutes: 15,
    carbs: ['tortillas', 'sweet-potato', 'sourdough', 'potatoes'], veg: ['bell-peppers', 'onion', 'broccoli', 'corn', 'black-beans'], vegCount: 2,
    sauces: ['cholula', 'salsa'], sauceOptional: true, needs: ['eggs'], extras: ['cheddar'],
    name: ({ p, c }) => c.id === 'tortillas'
      ? `${p.id === 'eggs' ? 'Veggie' : p.short} Breakfast Burritos`
      : `${p.id === 'eggs' ? 'Veggie' : p.short} Scramble with ${c.short}`,
    steps: ({ p, c, v, s }) => [
      ...(p.id === 'eggs' ? [] : [p.prep]),
      `Cook the ${list(v.map((y) => lower(y.name)))} until soft.`,
      'Add 3 beaten eggs and scramble softly.',
      `${c.how} Serve together${s ? ` with ${lower(s.name)}` : ''}.`,
    ],
  },
  flatbread: {
    label: 'Flatbread', minutes: 15,
    carbs: ['naan'], veg: ['bell-peppers', 'onion', 'broccoli', 'corn'], vegCount: 2,
    sauces: ['hummus', 'tomato-sauce'], needs: [], extras: ['cheddar', 'parmesan'],
    name: ({ p, s }) => `${s.adj} ${p.short} Flatbread`,
    steps: ({ p, v, s, x }) => [
      p.prep,
      `Spread ${lower(s.name)} on the naan.`,
      `Top with the ${lower(p.short)}, thinly sliced ${list(v.map((y) => lower(y.name)))}${x.length ? ', and a little cheese' : ''}.`,
      'Bake at 425°F for 8 to 10 min.',
    ],
  },
};
