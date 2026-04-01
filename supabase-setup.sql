-- ============================================
-- Modak Order Manager — Supabase Setup Script
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste & Run)
-- ============================================

-- 1. Create profiles table (links auth users to roles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('accountant', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create custom enum types
DO $$ BEGIN
  CREATE TYPE box_size_enum AS ENUM ('classic', 'delight', 'celebration');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('paid', 'unpaid');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status_enum AS ENUM ('pending', 'packed', 'delivered');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  box_size box_size_enum NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  delivery_date DATE NOT NULL,
  flavour_notes TEXT,
  payment_status payment_status_enum NOT NULL DEFAULT 'unpaid',
  order_status order_status_enum NOT NULL DEFAULT 'pending',
  created_by UUID REFERENCES auth.users NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 7. RLS Policies for orders

-- INSERT: Accountant can only insert their own orders
CREATE POLICY "Accountant can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- SELECT: Accountant sees own orders, Admin sees all
CREATE POLICY "Users can view orders based on role"
  ON orders FOR SELECT
  USING (
    auth.uid() = created_by
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- UPDATE: Admin only
CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- DELETE: Admin only
CREATE POLICY "Admin can delete orders"
  ON orders FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 8. Enable Realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- ============================================
-- MANUAL STEPS AFTER RUNNING THIS SCRIPT:
-- ============================================
-- 1. Go to Authentication → Settings → Email Auth
--    → Disable "Confirm email" toggle
--
-- 2. Go to Authentication → Users → Add User
--    → Create: accountant@yourdomain.com (set password)
--    → Create: admin@yourdomain.com (set password)
--
-- 3. After creating users, run these INSERT statements
--    (replace the UUIDs with the actual user IDs from the Auth tab):
--
--    INSERT INTO profiles (id, role) VALUES
--      ('ACCOUNTANT_USER_UUID_HERE', 'accountant'),
--      ('ADMIN_USER_UUID_HERE', 'admin');
-- ============================================
