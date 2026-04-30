-- ============================================================
-- Waqar Store – Seed Data
-- Run AFTER applying migrations: supabase db seed
-- ============================================================

-- ─── Categories ─────────────────────────────────────────────
insert into categories (id, name, slug, description, image_url) values
  ('11111111-0000-0000-0000-000000000001', 'Shirts',     'shirts',     'Formal and casual shirts',  null),
  ('11111111-0000-0000-0000-000000000002', 'Trousers',   'trousers',   'Chino and dress trousers',  null),
  ('11111111-0000-0000-0000-000000000003', 'Kurta',      'kurta',      'Traditional kurta shalwar', null),
  ('11111111-0000-0000-0000-000000000004', 'Waistcoats', 'waistcoats', 'Smart waistcoats',          null),
  ('11111111-0000-0000-0000-000000000005', 'Accessories','accessories','Ties, belts, cufflinks',    null)
on conflict (id) do nothing;

-- ─── Products ────────────────────────────────────────────────
insert into products (id, name, slug, description, price, compare_at_price, category_id, is_active, is_featured) values
  (
    '22222222-0000-0000-0000-000000000001',
    'Oxford Button-Down Shirt',
    'oxford-button-down-shirt',
    'Classic Oxford weave, button-down collar. Perfect for business casual.',
    3500, 4200,
    '11111111-0000-0000-0000-000000000001',
    true, true
  ),
  (
    '22222222-0000-0000-0000-000000000002',
    'Slim Fit Chino',
    'slim-fit-chino',
    'Tailored slim-fit chino in stretch cotton. Side-adjusters at waist.',
    4800, null,
    '11111111-0000-0000-0000-000000000002',
    true, true
  ),
  (
    '22222222-0000-0000-0000-000000000003',
    'Embroidered Kurta',
    'embroidered-kurta',
    'Luxurious lawn fabric kurta with intricate embroidery at collar and cuffs.',
    5500, 6500,
    '11111111-0000-0000-0000-000000000003',
    true, true
  ),
  (
    '22222222-0000-0000-0000-000000000004',
    'Linen Casual Shirt',
    'linen-casual-shirt',
    '100% linen, relaxed fit. Ideal for warm days.',
    2800, null,
    '11111111-0000-0000-0000-000000000001',
    true, false
  ),
  (
    '22222222-0000-0000-0000-000000000005',
    'Heritage Waistcoat',
    'heritage-waistcoat',
    'Structured wool-blend waistcoat with satin back. Traditional tailoring.',
    6000, 7500,
    '11111111-0000-0000-0000-000000000004',
    true, true
  )
on conflict (id) do nothing;

-- ─── Product Variants ────────────────────────────────────────
insert into product_variants (id, product_id, sku, size, color, stock_quantity) values
  ('33333333-0001-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'OBS-S-WHT',  'S',  'White', 15),
  ('33333333-0001-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', 'OBS-M-WHT',  'M',  'White', 20),
  ('33333333-0001-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001', 'OBS-L-WHT',  'L',  'White',  8),
  ('33333333-0001-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001', 'OBS-XL-WHT', 'XL', 'White',  5),
  ('33333333-0001-0000-0000-000000000005', '22222222-0000-0000-0000-000000000001', 'OBS-S-BLU',  'S',  'Blue',  12),
  ('33333333-0001-0000-0000-000000000006', '22222222-0000-0000-0000-000000000001', 'OBS-M-BLU',  'M',  'Blue',  18),

  ('33333333-0002-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'SFC-30-KHK', '30', 'Khaki',  10),
  ('33333333-0002-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'SFC-32-KHK', '32', 'Khaki',  14),
  ('33333333-0002-0000-0000-000000000003', '22222222-0000-0000-0000-000000000002', 'SFC-34-KHK', '34', 'Khaki',   9),
  ('33333333-0002-0000-0000-000000000004', '22222222-0000-0000-0000-000000000002', 'SFC-36-NVY', '36', 'Navy',   6),

  ('33333333-0003-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003', 'EK-S-WHT',  'S',  'White', 20),
  ('33333333-0003-0000-0000-000000000002', '22222222-0000-0000-0000-000000000003', 'EK-M-WHT',  'M',  'White', 25),
  ('33333333-0003-0000-0000-000000000003', '22222222-0000-0000-0000-000000000003', 'EK-L-WHT',  'L',  'White', 15),
  ('33333333-0003-0000-0000-000000000004', '22222222-0000-0000-0000-000000000003', 'EK-XL-WHT', 'XL', 'White',  0),

  ('33333333-0004-0000-0000-000000000001', '22222222-0000-0000-0000-000000000004', 'LCS-M-WHT', 'M', 'White', 30),
  ('33333333-0004-0000-0000-000000000002', '22222222-0000-0000-0000-000000000004', 'LCS-L-WHT', 'L', 'White', 22),
  ('33333333-0004-0000-0000-000000000003', '22222222-0000-0000-0000-000000000004', 'LCS-M-BEI', 'M', 'Beige', 18),

  ('33333333-0005-0000-0000-000000000001', '22222222-0000-0000-0000-000000000005', 'HW-M-CHR', 'M', 'Charcoal',  8),
  ('33333333-0005-0000-0000-000000000002', '22222222-0000-0000-0000-000000000005', 'HW-L-CHR', 'L', 'Charcoal', 10),
  ('33333333-0005-0000-0000-000000000003', '22222222-0000-0000-0000-000000000005', 'HW-XL-CHR','XL','Charcoal',  3)
on conflict (id) do nothing;
