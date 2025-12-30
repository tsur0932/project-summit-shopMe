package com.miniproject.cartservice.model;


import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "carts")
public class Cart {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long cartId;


    @Column(name = "user_id", nullable = false)
    private String userId;


    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();


    public Cart() {}


    public Cart(String userId, long cartId, List<CartItem> items) {
        this.userId = userId;
        this.cartId = cartId;
        this.items = items;
    }


    public Cart(String userId) {
        this.userId = userId;
    }


    public long getCartId() {
        return cartId;
    }


    public void setCartId(long cartId) {
        this.cartId = cartId;
    }


    public String getUserId() {
        return userId;
    }


    public void setUserId(String userId) {
        this.userId = userId;
    }


    public List<CartItem> getItems() {
        return items;
    }


    public void setItems(List<CartItem> items) {
        this.items = items;
    }


    public void addItem(CartItem item) {
        items.add(item);
        item.setCart(this);
    }


    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCart(null);
    }
}




