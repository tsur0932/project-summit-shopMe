package com.miniproject.cartservice.model;


import jakarta.persistence.*;


@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long cartItemId;


    @Column(name = "product_id", nullable = false)
    private long productId;


    @Column(nullable = false)
    private Integer quantity;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;


    private String productName;
    private Float productPrice;


    public CartItem() {}


    public CartItem(long productId, String productName, Float productPrice, Integer quantity) {
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.quantity = quantity;
    }


    public long getCartItemId() {
        return cartItemId;
    }


    public void setCartItemId(long cartItemId) {
        this.cartItemId = cartItemId;
    }


    public long getProductId() {
        return productId;
    }


    public void setProductId(long productId) {
        this.productId = productId;
    }


    public Integer getQuantity() {
        return quantity;
    }


    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }


    public Cart getCart() {
        return cart;
    }


    public void setCart(Cart cart) {
        this.cart = cart;
    }


    public String getProductName() {
        return productName;
    }


    public void setProductName(String productName) {
        this.productName = productName;
    }


    public Float getProductPrice() {
        return productPrice;
    }


    public void setProductPrice(Float productPrice) {
        this.productPrice = productPrice;
    }
}




