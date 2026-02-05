-- ========== ORDERS TABLE ==========
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT,
  customer_phone TEXT,
  bouquet_id UUID REFERENCES bouquets(id) ON DELETE SET NULL,
  size_id UUID REFERENCES sizes(id) ON DELETE SET NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sold', 'not_completed')),
  not_completed_reason TEXT,
  notes TEXT,
  whatsapp_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== ORDER_FLOWERS TABLE ==========
CREATE TABLE IF NOT EXISTS order_flowers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  flower_id UUID NOT NULL REFERENCES flowers(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== ORDER_COLORS TABLE ==========
CREATE TABLE IF NOT EXISTS order_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  color_id UUID NOT NULL REFERENCES colors(id) ON DELETE CASCADE,
  price_addition DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== ORDER_COMPLEMENTS TABLE ==========
CREATE TABLE IF NOT EXISTS order_complements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  complement_id UUID NOT NULL REFERENCES complements(id) ON DELETE CASCADE,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== CUSTOMIZATION_CATEGORIES TABLE ==========
CREATE TABLE IF NOT EXISTS customization_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  behavior_type TEXT DEFAULT 'multiple' CHECK (behavior_type IN ('single', 'multiple', 'quantity')),
  allows_price_addition BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== CUSTOMIZATION_OPTIONS TABLE ==========
CREATE TABLE IF NOT EXISTS customization_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES customization_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  image_url TEXT,
  hex_code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== ADD IMAGE_URL TO FLOWERS ==========
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ========== INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_flowers_order ON order_flowers(order_id);
CREATE INDEX IF NOT EXISTS idx_order_colors_order ON order_colors(order_id);
CREATE INDEX IF NOT EXISTS idx_order_complements_order ON order_complements(order_id);
CREATE INDEX IF NOT EXISTS idx_customization_categories_active ON customization_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_customization_options_category ON customization_options(category_id);

-- ========== INSERT DEFAULT CATEGORIES ==========
INSERT INTO customization_categories (name, description, behavior_type, allows_price_addition, is_active, display_order) VALUES
  ('Flores', 'Tipos de flores disponiveis', 'quantity', FALSE, TRUE, 1),
  ('Cores', 'Paleta de cores para o buque', 'multiple', TRUE, TRUE, 2),
  ('Tamanhos', 'Tamanhos disponiveis', 'single', TRUE, TRUE, 3),
  ('Complementos', 'Itens adicionais', 'multiple', TRUE, TRUE, 4)
ON CONFLICT (name) DO NOTHING;
