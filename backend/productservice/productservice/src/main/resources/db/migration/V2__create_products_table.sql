CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price FLOAT NOT NULL ,
    description VARCHAR (200),
    producer_info VARCHAR(100),
    stock_count INT NOT NULL,
    status VARCHAR NOT NULL,
    category_id INT NOT NULL,
    approved VARCHAR,

    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

INSERT INTO products ( name,  price, description, producer_info, stock_count, status, category_id, approved) VALUES
    ('Apple', 15.00, 'Australian apples', 'Imported', 10, 'APPROVED', 2, true),
    ('Guava', 80.99, 'Organic guava', 'Imported', 25, 'PENDING', 2, false),
    ('Curry Leaves', 39.95, 'Organic', 'Imported', 100, 'APPROVED', 1, true),
    ('Beans', 19.99, 'Organic', 'Imported', 50, 'REJECTED', 1, false);