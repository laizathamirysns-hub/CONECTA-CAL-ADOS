-- Supabase Schema for Conecta Calçados

-- 1. Profiles (Users)
CREATE TABLE profiles (
  uid UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'manufacturer', 'admin')),
  favorites TEXT[] DEFAULT '{}',
  created_at BIGINT NOT NULL
);

-- 2. Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manufacturer_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  retail_price DECIMAL NOT NULL,
  wholesale_price DECIMAL NOT NULL,
  wholesale_min_quantity INTEGER NOT NULL,
  images TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]',
  sizes JSONB DEFAULT '[]',
  featured BOOLEAN DEFAULT false,
  created_at BIGINT NOT NULL
);

-- 3. Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  subtotal DECIMAL NOT NULL,
  shipping_cost DECIMAL NOT NULL,
  total DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  type TEXT CHECK (type IN ('retail', 'wholesale')),
  shipping_method TEXT CHECK (shipping_method IN ('delivery', 'pickup')),
  shipping_details JSONB,
  customer_info JSONB NOT NULL,
  created_at BIGINT NOT NULL
);

-- 4. Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  requirements TEXT[] DEFAULT '{}',
  contact TEXT,
  type TEXT NOT NULL,
  area TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

-- 5. Job Applications
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  candidate_phone TEXT NOT NULL,
  experience TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'rejected')),
  created_at BIGINT NOT NULL
);

-- 6. Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('order', 'job', 'promo', 'system')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at BIGINT NOT NULL
);

-- 7. User Events
CREATE TABLE user_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT,
  created_at BIGINT NOT NULL
);

-- 8. User Notes
CREATE TABLE user_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  color TEXT,
  created_at BIGINT NOT NULL
);

-- 9. User Checklists
CREATE TABLE user_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

-- 10. Checklist Items
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checklist_id UUID REFERENCES user_checklists(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

-- Policies
-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = uid);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = uid);

-- Products: Everyone can read, only manufacturers/admins can write
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Manufacturers can insert products" ON products FOR INSERT WITH CHECK (auth.uid() = manufacturer_id);
CREATE POLICY "Manufacturers can update own products" ON products FOR UPDATE USING (auth.uid() = manufacturer_id);

-- Orders: Users can view own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: Users can view and update own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- User Data (Events, Notes, Checklists): Users can manage their own data
CREATE POLICY "Users can manage own events" ON user_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notes" ON user_notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own checklists" ON user_checklists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own checklist items" ON checklist_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_checklists 
    WHERE user_checklists.id = checklist_items.checklist_id 
    AND user_checklists.user_id = auth.uid()
  )
);
