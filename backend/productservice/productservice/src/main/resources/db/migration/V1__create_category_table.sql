CREATE TABLE IF NOT EXISTS categories
(
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO categories(name) VALUES
    ( 'Vegetables'),
    ('Fruits')
;