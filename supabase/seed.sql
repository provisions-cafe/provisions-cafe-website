-- ===========================================================================
-- seed.sql  —  initial content, extracted from the current hardcoded site.
-- Run AFTER the schema (all.sql or the individual files). Idempotent-guarded:
-- the menu seed only runs when menu_categories is empty, so re-running won't
-- duplicate rows or clobber later admin edits.
--
--   Menu           <- app/menu/page.tsx (9 categories across 3 column groups)
--   Home highlights<- app/page.tsx  (is_highlight + highlight_group)
--   site_settings  <- components/site-data.ts (+ per-day hours upgrade)
--
-- specials and image_overrides are intentionally left empty (see their .sql).
-- ===========================================================================

-- --------------------------------------------------------------------------
-- Menu categories + items
-- --------------------------------------------------------------------------
do $$
declare
  c_breakfast          uuid;
  c_wraps              uuid;
  c_small_plates       uuid;
  c_sandwiches         uuid;
  c_mains              uuid;
  c_salads             uuid;
  c_sides              uuid;
  c_dessert            uuid;
  c_kids               uuid;
begin
  if exists (select 1 from public.menu_categories) then
    raise notice 'menu_categories already populated — skipping menu seed';
    return;
  end if;

  -- Categories. column_group (1-3) reproduces the public page's 3 columns.
  insert into public.menu_categories (name, slug, column_group, display_order) values
    ('Breakfast',            'breakfast',          1, 0),
    ('Wraps & Focaccia',     'wraps-focaccia',     2, 0),
    ('Small Plates',         'small-plates',       2, 1),
    ('Sandwiches & Burgers', 'sandwiches-burgers', 2, 2),
    ('Mains',                'mains',              3, 0),
    ('Salads',               'salads',            3, 1),
    ('Sides',                'sides',             3, 2),
    ('Dessert',              'dessert',           3, 3),
    ('Kids Meal',            'kids-meal',         3, 4);

  select id into c_breakfast    from public.menu_categories where slug = 'breakfast';
  select id into c_wraps        from public.menu_categories where slug = 'wraps-focaccia';
  select id into c_small_plates from public.menu_categories where slug = 'small-plates';
  select id into c_sandwiches   from public.menu_categories where slug = 'sandwiches-burgers';
  select id into c_mains        from public.menu_categories where slug = 'mains';
  select id into c_salads       from public.menu_categories where slug = 'salads';
  select id into c_sides        from public.menu_categories where slug = 'sides';
  select id into c_dessert      from public.menu_categories where slug = 'dessert';
  select id into c_kids         from public.menu_categories where slug = 'kids-meal';

  -- Breakfast
  insert into public.menu_items
    (category_id, name, price, description, tags, display_order, is_highlight, highlight_group, highlight_order) values
    (c_breakfast, 'Toast', '$11.50', 'Butter, Vegemite or jam on your choice of sourdough, multigrain, wholemeal or white (GF optional)', '{}', 0, false, null, 0),
    (c_breakfast, 'Eggs on Toast', '$14.50', 'Two eggs cooked your way on white sourdough or multigrain toast — add bacon +$3', '{}', 1, false, null, 0),
    (c_breakfast, 'Avocado Smash', '$22.50', 'Smashed avocado, garlic sautéed mushroom & spinach, feta, medley tomatoes, poached eggs, dukkha, balsamic glaze on bread', '{V,GFA}', 2, false, null, 0),
    (c_breakfast, 'Bruschetta', '$22.50', 'Bocconcini, tomato, shallots, basil, garlic and herb toast', '{V,GFA}', 3, false, null, 0),
    (c_breakfast, 'Provisions Big Breakfast', '$27.50', 'Bacon, spinach & mushroom, grilled tomato, hashbrown, sausage, avocado and eggs your way, on choice of bread', '{}', 4, true, 'Breakfast', 0),
    (c_breakfast, 'Beef Ragu Shakshuka', '$24.50', 'Chef''s special oven-baked beefy shakshuka, bell pepper, two eggs in sauce, served with garlic pitta bread', '{}', 5, true, 'Breakfast', 1),
    (c_breakfast, 'Smoked Salmon', '$25.90', 'Seared asparagus with smoked salmon gribiche on sourdough, poached eggs, hollandaise', '{}', 6, false, null, 0),
    (c_breakfast, 'Provisions Breaksuka Burger', '$24.50', 'Homemade hashbrown, bacon, fried egg, caramelised onion, cheese, tomato relish, lettuce, in a brioche bun and fries', '{}', 7, false, null, 0),
    (c_breakfast, 'Zucchini & Corn Fritters', '$23.50', 'Rocket, parmesan & pear salad, avocado, tomato salsa, poached egg, lemon wedge & romesco', '{V}', 8, false, null, 0),
    (c_breakfast, 'Chilli Scrambled Eggs', '$22.90', 'Bacon, spring onions, fresh chilli, fried shallots, parmesan, on white toast', '{}', 9, false, null, 0),
    (c_breakfast, 'Hash Stack', '$23.50', 'Two homemade potato rosti, crispy bacon, poached eggs, hollandaise and alfalfa sprouts — add salmon +$4', '{}', 10, false, null, 0),
    (c_breakfast, 'Caesar Salad', '$22.50', 'Cos lettuce, crispy bacon, garlic croutons, poached egg, parmesan and Caesar dressing', '{}', 11, false, null, 0),
    (c_breakfast, 'Pancakes', '$22.50', 'Two pancakes with fresh fruit & berries, maple syrup, vanilla ice cream and lemon balm', '{}', 12, false, null, 0);

  -- Wraps & Focaccia
  insert into public.menu_items
    (category_id, name, price, description, tags, display_order) values
    (c_wraps, 'Chicken Wrap', '$17.50', 'Grilled chicken with lettuce, onion, tomato, tasty cheese and mayo', '{}', 0),
    (c_wraps, 'Lamb Wrap', '$18.50', 'Pulled lamb with lettuce, onion, tomato and tzatziki', '{}', 1),
    (c_wraps, 'Grilled Vegetable Focaccia', '$17.50', 'Eggplant, capsicum, zucchini, caramelised onion, cheese and tomato relish', '{V}', 2);

  -- Small Plates
  insert into public.menu_items
    (category_id, name, price, description, tags, display_order) values
    (c_small_plates, 'Beef Arancini', '$16.50', 'Slow-cooked beef ragu, mozzarella, with tomato sugo', '{}', 0),
    (c_small_plates, 'Calamari Fritti', '$18.50', 'Served with rocket salad, lemon wedge and mayo', '{}', 1),
    (c_small_plates, 'Crispy Fried Chicken Ribs', '$21.50', 'Crispy fried chicken with coleslaw, sesame seed and hot sauce', '{}', 2);

  -- Sandwiches & Burgers
  insert into public.menu_items
    (category_id, name, price, description, tags, display_order, is_highlight, highlight_group, highlight_order) values
    (c_sandwiches, 'Provisions Chicken Sandwich', '$22.50', 'Chicken, cheese, avocado, celery, spring onions and mayo', '{}', 0, false, null, 0),
    (c_sandwiches, 'Provisions Steak Sandwich', '$25.50', 'Beef strip loin, caramelised onion, red pepper, cheese, tomato relish, mustard mayo, lettuce, in a Turkish roll with chips', '{}', 1, true, 'Burgers & sandwiches', 1),
    (c_sandwiches, 'Halloumi Burger', '$24.50', 'Grilled halloumi, avocado, tomato, lettuce, caramelised onion, sweet chilli mayo, served with fries', '{V}', 2, false, null, 0),
    (c_sandwiches, 'Chicken Burger', '$24.50', 'Crispy fried chicken, coleslaw, cheddar, sriracha mayo and fries — swap to grilled chicken on request', '{}', 3, false, null, 0),
    (c_sandwiches, 'Wagyu Cheeseburger', '$24.50', 'Beef patty, lettuce, tomato, pickled cucumber, caramelised onion, American cheese, burger sauce, chips', '{}', 4, true, 'Burgers & sandwiches', 0);

  -- Mains
  insert into public.menu_items
    (category_id, name, price, description, tags, display_order, is_highlight, highlight_group, highlight_order) values
    (c_mains, 'Grilled Pork Sausage', '$22.50', 'Served with homemade potato rosti, shallots and red wine jus', '{}', 0, false, null, 0),
    (c_mains, 'Chicken Parma', '$22.50', 'Homemade Napoli sauce, mozzarella, ham, side chips and garden salad', '{}', 1, false, null, 0),
    (c_mains, 'Market Fish', '$25.90', 'Fresh market fish with chips and garden salad', '{GF}', 2, true, 'Lunch', 2),
    (c_mains, 'Butter Chicken', '$25.50', 'Butter-enriched tomato-creamy sauce with onion, almond and cashew nuts, served with rice and pita bread', '{}', 3, true, 'Lunch', 0),
    (c_mains, 'Vegetarian Lasagne', '$21.50', 'Pumpkin, zucchini, mushroom, spinach, onion, herbed béchamel and side salad', '{V}', 4, false, null, 0),
    (c_mains, 'Beef Lasagne', '$25.50', 'Beef bolognese ragu with creamy béchamel and shaved parmesan on top', '{}', 5, true, 'Lunch', 1);

  -- Salads
  insert into public.menu_items
    (category_id, name, price, description, tags, display_order) values
    (c_salads, 'Pulled Lamb Salad', '$23.50', 'Rocket, spinach, lentils, cherry tomatoes, onion, feta, with lemon mustard dressing', '{}', 0),
    (c_salads, 'Grilled Chicken Salad', '$23.50', 'Mixed leaf salad, tomato, onion, radish, croutons with lemon dressing', '{}', 1),
    (c_salads, 'Calamari Salad', '$23.50', 'Mixed leaf, cherry tomatoes, cucumber, lemon wedge, with house-made dressing', '{}', 2);

  -- Sides
  insert into public.menu_items
    (category_id, name, price, description, tags, display_order) values
    (c_sides, 'Beer Battered Potato Wedges', '$12.50', 'Served with sour cream and sweet chilli sauce', '{}', 0),
    (c_sides, 'Chips', '$10.50', 'With tomato ketchup', '{}', 1);

  -- Dessert
  insert into public.menu_items
    (category_id, name, price, description, tags, display_order, is_highlight, highlight_group, highlight_order) values
    (c_dessert, 'Crème Brûlée', '$16.50', null, '{}', 0, true, 'Sweet', 0),
    (c_dessert, 'Apple & Rhubarb Crumble', '$16.50', 'Served with vanilla ice cream', '{}', 1, false, null, 0);

  -- Kids Meal
  insert into public.menu_items
    (category_id, name, price, description, tags, display_order, is_highlight, highlight_group, highlight_order) values
    (c_kids, 'Cheese Toast', '$9.50', null, '{}', 0, false, null, 0),
    (c_kids, 'Chicken Popcorn & Chips', '$12.50', null, '{}', 1, false, null, 0),
    (c_kids, 'Pancake', '$12.50', 'Fresh seasonal fruits and berries, vanilla ice cream and maple syrup', '{}', 2, false, null, 0),
    (c_kids, 'Kids Burger', '$14.50', 'Beef patty with chips and tomato sauce', '{}', 3, true, 'Little ones', 0),
    (c_kids, 'Fish & Chips', '$14.50', 'Beer battered fish with chips and tomato sauce', '{}', 4, false, null, 0),
    (c_kids, 'Kids Pasta', '$14.50', 'Spaghetti with beef bolognese and parmesan', '{}', 5, false, null, 0);

  raise notice 'menu seed complete';
end $$;

-- --------------------------------------------------------------------------
-- site_settings singleton (mirrors components/site-data.ts; adds per-day hours)
-- Shape must match SETTINGS_DEFAULTS in lib/settings.ts (Phase 3).
-- --------------------------------------------------------------------------
insert into public.site_settings (id, data) values (
  1,
  jsonb_build_object(
    'urls', jsonb_build_object(
      'book',       'https://www.google.com/maps/reserve/v/dine/c/PiDGJ7vEPco',
      'order',      'https://www.doordash.com/store/provisions-williamstown-29945064/38552548/',
      'directions', 'https://www.google.com/maps/dir/?api=1&destination=62-64+Ferguson+St+Williamstown+VIC+3016',
      'reviews',    'https://www.google.com/maps/search/?api=1&query=Provisions+Cafe+62-64+Ferguson+St+Williamstown+VIC+3016',
      'mapEmbed',   'https://maps.google.com/maps?q=62-64%20Ferguson%20St%20Williamstown%20VIC%203016&z=16&output=embed'
    ),
    'contact', jsonb_build_object(
      'phoneDisplay', '03 9399 9955',
      'phoneHref',    'tel:+61393999955',
      'addressLine1', '62–64 Ferguson St',
      'addressLine2', 'Williamstown VIC 3016'
    ),
    'business', jsonb_build_object(
      'name',          'Provisions Cafe',
      'streetAddress', '62-64 Ferguson St',
      'locality',      'Williamstown',
      'region',        'VIC',
      'postalCode',    '3016',
      'country',       'AU',
      'latitude',      -37.8631,
      'longitude',     144.8969,
      'priceRange',    '$$',
      'ratingValue',   4.4,
      'reviewCount',   269,
      'telephoneE164', '+61393999955'
    ),
    'hours', jsonb_build_array(
      jsonb_build_object('day', 1, 'label', 'Monday',    'time', '7am – 3pm', 'closed', false),
      jsonb_build_object('day', 2, 'label', 'Tuesday',   'time', '7am – 3pm', 'closed', false),
      jsonb_build_object('day', 3, 'label', 'Wednesday', 'time', '7am – 3pm', 'closed', false),
      jsonb_build_object('day', 4, 'label', 'Thursday',  'time', '7am – 3pm', 'closed', false),
      jsonb_build_object('day', 5, 'label', 'Friday',    'time', '7am – 3pm', 'closed', false),
      jsonb_build_object('day', 6, 'label', 'Saturday',  'time', '7am – 3pm', 'closed', false),
      jsonb_build_object('day', 0, 'label', 'Sunday',    'time', '7am – 3pm', 'closed', false)
    )
  )
) on conflict (id) do nothing;
