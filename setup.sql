
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    cuisine VARCHAR(255),
    title VARCHAR(500),
    rating FLOAT,
    prep_time INTEGER,
    cook_time INTEGER,
    total_time INTEGER,
    description TEXT,
    nutrients JSONB,
    serves VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_recipes_rating ON recipes(rating DESC);
CREATE INDEX idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX idx_recipes_total_time ON recipes(total_time);
CREATE INDEX idx_recipes_title ON recipes USING gin(to_tsvector('english', title));
CREATE INDEX idx_recipes_nutrients ON recipes USING gin(nutrients);

INSERT INTO recipes (cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves) VALUES
('Italian', 'Sample Pizza', 4.5, 20, 15, 35, 'Delicious homemade pizza', '{"calories": 280, "carbohydrateContent": 35, "proteinContent": 12, "fatContent": 10}', '4 servings'),
('Mexican', 'Sample Burrito', 4.2, 15, 10, 25, 'Quick and tasty burrito', '{"calories": 350, "carbohydrateContent": 40, "proteinContent": 18, "fatContent": 12}', '2 servings');

SELECT COUNT(*) as total_recipes FROM recipes;
SELECT * FROM recipes LIMIT 3;