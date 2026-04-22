insert into public.promotions (code, label, type, value, minimum_spend, active, expires_at)
values
  ('HADI10', '10% off for first-time customers', 'percent', 10, 80, true, now() + interval '180 days'),
  ('SAVE25', 'Flat 25 off premium baskets', 'fixed', 25, 180, true, now() + interval '180 days')
on conflict (code) do nothing;

insert into public.products (name, price, image_url, category, stock, rating, description, badge, sku)
values
  (
    'Orbit Speaker Prime',
    149,
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    'Electronics',
    18,
    4.8,
    'Premium audio device for the seeded Supabase catalog.',
    'Best Seller',
    'HADI-9001'
  ),
  (
    'Luma Lamp Studio',
    119,
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'Home Living',
    22,
    4.7,
    'Bright modern lamp for interior-focused collections.',
    'Editor Pick',
    'HADI-9002'
  )
on conflict (sku) do nothing;
