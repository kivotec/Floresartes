-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== USERS TABLE ==========
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'user')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== FLOWERS TABLE ==========
CREATE TABLE IF NOT EXISTS flowers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== COLORS TABLE ==========
CREATE TABLE IF NOT EXISTS colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  hex_code TEXT NOT NULL,
  price_addition DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== SIZES TABLE ==========
CREATE TABLE IF NOT EXISTS sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  price_modifier DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== COMPLEMENTS TABLE ==========
CREATE TABLE IF NOT EXISTS complements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('ribbon', 'wrapping', 'card', 'other')),
  price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== BOUQUETS TABLE ==========
CREATE TABLE IF NOT EXISTS bouquets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'presentes',
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== CUSTOMIZATIONS TABLE ==========
CREATE TABLE IF NOT EXISTS customizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'confirmed', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== CUSTOMIZATION_FLOWERS TABLE (Many-to-Many) ==========
CREATE TABLE IF NOT EXISTS customization_flowers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customization_id UUID NOT NULL REFERENCES customizations(id) ON DELETE CASCADE,
  flower_id UUID NOT NULL REFERENCES flowers(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customization_id, flower_id)
);

-- ========== CUSTOMIZATION_COLORS TABLE (Many-to-Many) ==========
CREATE TABLE IF NOT EXISTS customization_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customization_id UUID NOT NULL REFERENCES customizations(id) ON DELETE CASCADE,
  color_id UUID NOT NULL REFERENCES colors(id) ON DELETE CASCADE,
  price_addition DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customization_id, color_id)
);

-- ========== CUSTOMIZATION_COMPLEMENTS TABLE (Many-to-Many) ==========
CREATE TABLE IF NOT EXISTS customization_complements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customization_id UUID NOT NULL REFERENCES customizations(id) ON DELETE CASCADE,
  complement_id UUID NOT NULL REFERENCES complements(id) ON DELETE CASCADE,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customization_id, complement_id)
);

-- ========== CUSTOMIZATION_SIZE TABLE (One-to-One) ==========
CREATE TABLE IF NOT EXISTS customization_size (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customization_id UUID NOT NULL UNIQUE REFERENCES customizations(id) ON DELETE CASCADE,
  size_id UUID NOT NULL REFERENCES sizes(id) ON DELETE RESTRICT,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== SETTINGS TABLE ==========
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  whatsapp_number TEXT NOT NULL,
  whatsapp_message_template TEXT,
  site_title TEXT DEFAULT 'Flor & Arte',
  site_description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========== INDEXES ==========
CREATE INDEX idx_bouquets_active ON bouquets(is_active);
CREATE INDEX idx_bouquets_featured ON bouquets(is_featured);
CREATE INDEX idx_flowers_active ON flowers(is_active);
CREATE INDEX idx_colors_active ON colors(is_active);
CREATE INDEX idx_sizes_active ON sizes(is_active);
CREATE INDEX idx_complements_active ON complements(is_active);
CREATE INDEX idx_customizations_user ON customizations(user_id);
CREATE INDEX idx_customizations_status ON customizations(status);
CREATE INDEX idx_customization_flowers ON customization_flowers(customization_id);
CREATE INDEX idx_customization_colors ON customization_colors(customization_id);
CREATE INDEX idx_customization_complements ON customization_complements(customization_id);

-- ========== INITIAL DATA ==========
-- Flowers
INSERT INTO flowers (name, price, is_active, display_order) VALUES
  ('Rosa', 12.90, true, 1),
  ('Lírio', 15.90, true, 2),
  ('Girassol', 9.90, true, 3),
  ('Orquídea', 24.90, true, 4),
  ('Tulipa', 18.90, true, 5),
  ('Margarida', 6.90, true, 6),
  ('Gérbera', 8.90, true, 7)
ON CONFLICT (name) DO NOTHING;

-- Colors
INSERT INTO colors (name, hex_code, price_addition, is_active, display_order) VALUES
  ('Rosa', '#F4C2C2', 0, true, 1),
  ('Vermelho', '#DC143C', 0, true, 2),
  ('Branco', '#FFFFFF', 0, true, 3),
  ('Amarelo', '#FFD700', 0, true, 4),
  ('Laranja', '#FF8C00', 0, true, 5),
  ('Lilás', '#C8A2C8', 5, true, 6)
ON CONFLICT (name) DO NOTHING;

-- Sizes
INSERT INTO sizes (name, price, price_modifier, is_active, display_order) VALUES
  ('Pequeno', 99.90, 0, true, 1),
  ('Médio', 149.90, 50, true, 2),
  ('Grande', 199.90, 100, true, 3),
  ('Luxo', 299.90, 200, true, 4)
ON CONFLICT (name) DO NOTHING;

-- Complements
INSERT INTO complements (name, type, price, is_active, display_order) VALUES
  ('Laço de Cetim', 'ribbon', 8.90, true, 1),
  ('Laço de Organza', 'ribbon', 12.90, true, 2),
  ('Papel Kraft', 'wrapping', 5.90, true, 3),
  ('Celofane Transparente', 'wrapping', 4.90, true, 4),
  ('Cartão Personalizado', 'card', 9.90, true, 5),
  ('Cartão com Mensagem', 'card', 6.90, true, 6),
  ('Chocolate Belga', 'other', 29.90, true, 7)
ON CONFLICT (name) DO NOTHING;

-- Bouquets
INSERT INTO bouquets (name, description, price, category, is_active, is_featured, display_order) VALUES
  ('Buquê Romântico', 'Rosas vermelhas clássicas perfeitas para declarações de amor', 149.90, 'presentes', true, true, 1),
  ('Buquê Primavera', 'Flores coloridas que trazem alegria e leveza', 129.90, 'presentes', true, true, 2),
  ('Buquê Tropical', 'Lírios e flores exóticas para momentos especiais', 189.90, 'presentes', true, false, 3),
  ('Buquê Girassol', 'Girassóis vibrantes para iluminar o dia', 99.90, 'presentes', true, false, 4),
  ('Buquê Elegância', 'Orquídeas e rosas em composição sofisticada', 249.90, 'presentes', true, true, 5),
  ('Buquê Alegria', 'Flores mistas em tons quentes', 119.90, 'presentes', true, false, 6)
ON CONFLICT (name) DO NOTHING;

-- Settings
INSERT INTO settings (whatsapp_number, site_title, site_description) VALUES
  ('5511957812861', 'Flor & Arte - Buquês Exclusivos', 'Buquês de flores exclusivos feitos com carinho. Presenteie quem você ama com arranjos únicos e personalizados.')
ON CONFLICT DO NOTHING;
