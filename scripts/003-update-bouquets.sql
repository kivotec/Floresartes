-- ========== UPDATE BOUQUETS TABLE WITH NEW IMAGES ==========

-- Clear existing bouquets
DELETE FROM bouquets;

-- Insert new bouquets with color-based categories and images
INSERT INTO bouquets (name, description, price, image_url, category, is_active, is_featured, display_order) VALUES
  -- Azul (Blue Category)
  ('Buquê Azul e Branco', 'Irises azuis elegantes com rosas brancas e baby''s breath delicado. Perfeito para ocasiões sofisticadas.', 189.90, '/images/azul-branco.jpg', 'azul', true, true, 1),
  
  -- Vermelho (Red Category)
  ('Buquê Vermelho e Girassol', 'Rosas vermelhas com vibrantes girassóis amarelos. Combina romance com alegria em uma composição única.', 169.90, '/images/vermelho-girassol.jpg', 'vermelho', true, true, 2),
  ('Kit Flor com Chocolate', 'Rosas vermelhas com presentes especiais: Kinder Bueno, Ferrero Rocher e um carinho com pelúcia.', 189.90, '/images/kit-flor-chocolate.jpg', 'vermelho', true, false, 3),
  ('Kit Flor com Chocolate Deluxe', 'Rosas vermelhas combinadas com Ferrero Rocher, um coração decorativo e pelúcia fofa. Para presentear com estilo.', 199.90, '/images/kit-flor-chocolate-2.jpg', 'vermelho', true, false, 4),
  
  -- Rosa (Pink Category)
  ('Buquê Rosa e Branco', 'Rosas rose com tons brancos e baby''s breath. Elegância e delicadeza em uma composição romântica com fita magenta.', 179.90, '/images/rosa-branco.jpg', 'rosa', true, false, 5),
  ('Buquê Rosa Puro', 'Rosas em tons de rose e pink em diferentes intensidades. Simplicidade e beleza para expressar sentimentos profundos.', 159.90, '/images/rosa.jpg', 'rosa', true, false, 6),
  
  -- Colorido (Colorful Category)
  ('Buquê Colorido Vibrante', 'Mistura festiva de rosas vermelhas, girassóis, margaridas brancas e flores em tons quentes. Ideal para celebrações.', 179.90, '/images/colorido.jpg', 'colorido', true, true, 7),
  ('Buquê Colorido Premium', 'Composição luxuosa com rosas vermelhas, girassóis amarelos, daisies brancas e flores em tons pastel.', 189.90, '/images/colorido-2.jpg', 'colorido', true, false, 8),
  ('Buquê Colorido Tropical', 'Explosão de cores com rosas pink, flores magenta, girassóis, daisies e flores em tons vibrantes de amarelo e roxo.', 199.90, '/images/colorido-4.jpg', 'colorido', true, false, 9),
  ('Buquê Colorido Festivo', 'Celebre com cores! Rosas pink, flores vermelhas, girassóis, daisies brancas e flores em tons roxo com papel amarelo vibrante.', 189.90, '/images/colorido-3.jpg', 'colorido', true, false, 10);

-- ========== REORDER INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_bouquets_category ON bouquets(category);
