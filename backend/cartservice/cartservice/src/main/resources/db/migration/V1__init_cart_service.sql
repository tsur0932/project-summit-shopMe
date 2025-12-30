-- carts table
CREATE TABLE IF NOT EXISTS carts (
                                     cart_id BIGSERIAL PRIMARY KEY,
                                     user_id VARCHAR(100) NOT NULL UNIQUE
    );

-- cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
                                          cart_item_id BIGSERIAL PRIMARY KEY,
                                          cart_id BIGINT NOT NULL,
                                          product_id BIGINT NOT NULL,
                                          product_name VARCHAR(200),
    product_price FLOAT,
    quantity INT NOT NULL,
    CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id)
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
