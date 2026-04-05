-- ============================================
-- Modak Order Manager — UPDATE SCRIPT
-- ============================================
-- Run this script in Supabase SQL Editor to support the new Dynamic Slots feature
-- ============================================

-- 1. Create slots table
CREATE TABLE IF NOT EXISTS slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users
);

-- 2. Update orders table to support multiple slots and optional login
-- Ensure no views or functions depend on delivery_date before running this.
ALTER TABLE orders DROP COLUMN IF EXISTS delivery_date;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_slots TEXT[] NOT NULL DEFAULT '{}';

-- Allow unauthenticated inserts (for public form)
ALTER TABLE orders ALTER COLUMN created_by DROP NOT NULL;

-- 3. RLS for slots
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;

-- Public can read active slots
CREATE POLICY "Public read slots" 
  ON slots FOR SELECT 
  USING (true);

-- Admins and Accountants can manage slots
CREATE POLICY "Admins/Accountants manage slots" 
  ON slots FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'accountant')
    )
  );

-- 4. Update orders RLS to allow public to insert without being authenticated
-- We will replace the existing INSERT policy for Accountant with an ANY INSERT policy:
-- The public order form will not have auth.uid(), so auth.uid() is NULL.
DROP POLICY IF EXISTS "Accountant can insert own orders" ON orders;

CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (
    -- Authenticated users save with their uid, OR public saves with NULL created_by
    (auth.uid() IS NULL AND created_by IS NULL)
    OR
    (auth.uid() = created_by)
  );

-- Make sure realtime works for slots too
ALTER PUBLICATION supabase_realtime ADD TABLE slots;
