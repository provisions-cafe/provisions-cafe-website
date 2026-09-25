// Client-safe menu types + code defaults. The menu is a Collection (full CRUD in
// the admin), but we still keep the whole menu here as a fallback so the public
// /menu page renders even if Supabase is empty/unreachable. getMenu() (server)
// returns published DB rows, or these defaults on any failure.
// Mirrors app/menu/page.tsx + supabase/seed.sql — KEEP IN SYNC.

export type MenuItem = {
  name: string;
  price: string;
  desc?: string; // DB column is `description`; mapped to `desc` for <MenuItem/>
  sub?: string;
  tags: string[];
  isHighlight: boolean;
  highlightGroup?: string;
  highlightOrder: number;
};

export type MenuCategory = {
  name: string;
  slug: string;
  columnGroup: number; // 1-3, preserves the public page's 3-column layout
  displayOrder: number;
  items: MenuItem[];
};

/** Convenience for items with no tags / not a highlight. */
function item(
  name: string,
  price: string,
  desc?: string,
  extra?: Partial<MenuItem>,
): MenuItem {
  return {
    name,
    price,
    desc,
    tags: [],
    isHighlight: false,
    highlightOrder: 0,
    ...extra,
  };
}

export const MENU_DEFAULTS: MenuCategory[] = [
  {
    name: "Breakfast",
    slug: "breakfast",
    columnGroup: 1,
    displayOrder: 0,
    items: [
      item("Toast", "$11.50", "Butter, Vegemite or jam on your choice of sourdough, multigrain, wholemeal or white (GF optional)"),
      item("Eggs on Toast", "$14.50", "Two eggs cooked your way on white sourdough or multigrain toast — add bacon +$3"),
      item("Avocado Smash", "$22.50", "Smashed avocado, garlic sautéed mushroom & spinach, feta, medley tomatoes, poached eggs, dukkha, balsamic glaze on bread", { tags: ["V", "GFA"] }),
      item("Bruschetta", "$22.50", "Bocconcini, tomato, shallots, basil, garlic and herb toast", { tags: ["V", "GFA"] }),
      item("Provisions Big Breakfast", "$27.50", "Bacon, spinach & mushroom, grilled tomato, hashbrown, sausage, avocado and eggs your way, on choice of bread", { isHighlight: true, highlightGroup: "Breakfast", highlightOrder: 0 }),
      item("Beef Ragu Shakshuka", "$24.50", "Chef's special oven-baked beefy shakshuka, bell pepper, two eggs in sauce, served with garlic pitta bread", { isHighlight: true, highlightGroup: "Breakfast", highlightOrder: 1 }),
      item("Smoked Salmon", "$25.90", "Seared asparagus with smoked salmon gribiche on sourdough, poached eggs, hollandaise"),
      item("Provisions Breaksuka Burger", "$24.50", "Homemade hashbrown, bacon, fried egg, caramelised onion, cheese, tomato relish, lettuce, in a brioche bun and fries"),
      item("Zucchini & Corn Fritters", "$23.50", "Rocket, parmesan & pear salad, avocado, tomato salsa, poached egg, lemon wedge & romesco", { tags: ["V"] }),
      item("Chilli Scrambled Eggs", "$22.90", "Bacon, spring onions, fresh chilli, fried shallots, parmesan, on white toast"),
      item("Hash Stack", "$23.50", "Two homemade potato rosti, crispy bacon, poached eggs, hollandaise and alfalfa sprouts — add salmon +$4"),
      item("Caesar Salad", "$22.50", "Cos lettuce, crispy bacon, garlic croutons, poached egg, parmesan and Caesar dressing"),
      item("Pancakes", "$22.50", "Two pancakes with fresh fruit & berries, maple syrup, vanilla ice cream and lemon balm"),
    ],
  },
  {
    name: "Wraps & Focaccia",
    slug: "wraps-focaccia",
    columnGroup: 2,
    displayOrder: 0,
    items: [
      item("Chicken Wrap", "$17.50", "Grilled chicken with lettuce, onion, tomato, tasty cheese and mayo"),
      item("Lamb Wrap", "$18.50", "Pulled lamb with lettuce, onion, tomato and tzatziki"),
      item("Grilled Vegetable Focaccia", "$17.50", "Eggplant, capsicum, zucchini, caramelised onion, cheese and tomato relish", { tags: ["V"] }),
    ],
  },
  {
    name: "Small Plates",
    slug: "small-plates",
    columnGroup: 2,
    displayOrder: 1,
    items: [
      item("Beef Arancini", "$16.50", "Slow-cooked beef ragu, mozzarella, with tomato sugo"),
      item("Calamari Fritti", "$18.50", "Served with rocket salad, lemon wedge and mayo"),
      item("Crispy Fried Chicken Ribs", "$21.50", "Crispy fried chicken with coleslaw, sesame seed and hot sauce"),
    ],
  },
  {
    name: "Sandwiches & Burgers",
    slug: "sandwiches-burgers",
    columnGroup: 2,
    displayOrder: 2,
    items: [
      item("Provisions Chicken Sandwich", "$22.50", "Chicken, cheese, avocado, celery, spring onions and mayo"),
      item("Provisions Steak Sandwich", "$25.50", "Beef strip loin, caramelised onion, red pepper, cheese, tomato relish, mustard mayo, lettuce, in a Turkish roll with chips", { isHighlight: true, highlightGroup: "Burgers & sandwiches", highlightOrder: 1 }),
      item("Halloumi Burger", "$24.50", "Grilled halloumi, avocado, tomato, lettuce, caramelised onion, sweet chilli mayo, served with fries", { tags: ["V"] }),
      item("Chicken Burger", "$24.50", "Crispy fried chicken, coleslaw, cheddar, sriracha mayo and fries — swap to grilled chicken on request"),
      item("Wagyu Cheeseburger", "$24.50", "Beef patty, lettuce, tomato, pickled cucumber, caramelised onion, American cheese, burger sauce, chips", { isHighlight: true, highlightGroup: "Burgers & sandwiches", highlightOrder: 0 }),
    ],
  },
  {
    name: "Mains",
    slug: "mains",
    columnGroup: 3,
    displayOrder: 0,
    items: [
      item("Grilled Pork Sausage", "$22.50", "Served with homemade potato rosti, shallots and red wine jus"),
      item("Chicken Parma", "$22.50", "Homemade Napoli sauce, mozzarella, ham, side chips and garden salad"),
      item("Market Fish", "$25.90", "Fresh market fish with chips and garden salad", { tags: ["GF"], isHighlight: true, highlightGroup: "Lunch", highlightOrder: 2 }),
      item("Butter Chicken", "$25.50", "Butter-enriched tomato-creamy sauce with onion, almond and cashew nuts, served with rice and pita bread", { isHighlight: true, highlightGroup: "Lunch", highlightOrder: 0 }),
      item("Vegetarian Lasagne", "$21.50", "Pumpkin, zucchini, mushroom, spinach, onion, herbed béchamel and side salad", { tags: ["V"] }),
      item("Beef Lasagne", "$25.50", "Beef bolognese ragu with creamy béchamel and shaved parmesan on top", { isHighlight: true, highlightGroup: "Lunch", highlightOrder: 1 }),
    ],
  },
  {
    name: "Salads",
    slug: "salads",
    columnGroup: 3,
    displayOrder: 1,
    items: [
      item("Pulled Lamb Salad", "$23.50", "Rocket, spinach, lentils, cherry tomatoes, onion, feta, with lemon mustard dressing"),
      item("Grilled Chicken Salad", "$23.50", "Mixed leaf salad, tomato, onion, radish, croutons with lemon dressing"),
      item("Calamari Salad", "$23.50", "Mixed leaf, cherry tomatoes, cucumber, lemon wedge, with house-made dressing"),
    ],
  },
  {
    name: "Sides",
    slug: "sides",
    columnGroup: 3,
    displayOrder: 2,
    items: [
      item("Beer Battered Potato Wedges", "$12.50", "Served with sour cream and sweet chilli sauce"),
      item("Chips", "$10.50", "With tomato ketchup"),
    ],
  },
  {
    name: "Dessert",
    slug: "dessert",
    columnGroup: 3,
    displayOrder: 3,
    items: [
      item("Crème Brûlée", "$16.50", undefined, { isHighlight: true, highlightGroup: "Sweet", highlightOrder: 0 }),
      item("Apple & Rhubarb Crumble", "$16.50", "Served with vanilla ice cream"),
    ],
  },
  {
    name: "Kids Meal",
    slug: "kids-meal",
    columnGroup: 3,
    displayOrder: 4,
    items: [
      item("Cheese Toast", "$9.50"),
      item("Chicken Popcorn & Chips", "$12.50"),
      item("Pancake", "$12.50", "Fresh seasonal fruits and berries, vanilla ice cream and maple syrup"),
      item("Kids Burger", "$14.50", "Beef patty with chips and tomato sauce", { isHighlight: true, highlightGroup: "Little ones", highlightOrder: 0 }),
      item("Fish & Chips", "$14.50", "Beer battered fish with chips and tomato sauce"),
      item("Kids Pasta", "$14.50", "Spaghetti with beef bolognese and parmesan"),
    ],
  },
];

/** Order home-page highlight groups appear in (not stored in the DB). */
export const HIGHLIGHT_GROUP_ORDER = [
  "Breakfast",
  "Lunch",
  "Burgers & sandwiches",
  "Sweet",
  "Little ones",
];
