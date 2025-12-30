package com.miniproject.cartservice.service;


import com.miniproject.cartservice.model.Cart;
import com.miniproject.cartservice.model.CartItem;
import com.miniproject.cartservice.model.ProductResponse;
import com.miniproject.cartservice.repository.CartItemRepository;
import com.miniproject.cartservice.repository.CartRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;


import java.util.Optional;


@Service
public class CartService {


    @Autowired
    private CartRepository cartRepository;


    @Autowired
    private CartItemRepository cartItemRepository;


    @Autowired
    private RestTemplate restTemplate;


    @Value("${product-service.base-url}")
    private String productServiceUrl;




    public Cart createCart(String userId){
        Optional<Cart> existingCart = cartRepository.findByUserId(userId);
        if(existingCart.isPresent()){
            return existingCart.get();
        }
        Cart cart = new Cart(userId);
        return cartRepository.save(cart);
    }


    public Optional<Cart> getCartById (Long cartId){
        return cartRepository.findById(cartId);
    }


    public Optional<Cart> getCartByUserId (String userId){
        return cartRepository.findByUserId(userId);
    }




    @Transactional
    public Cart addItemToCart(Long cartId, Long productId, Integer quantity){
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found"));
        try{
            String url = productServiceUrl + "/api/products/" + productId;
            ResponseEntity<ProductResponse> response = restTemplate.getForEntity(url, ProductResponse.class);
            ProductResponse product = response.getBody();


            if (product == null) {
                throw new RuntimeException("Product not found");
            }


            Optional<CartItem> existingItem = cartItemRepository.findByCart_CartIdAndProductId(cartId, productId);


            if (existingItem.isPresent()) {
                CartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + quantity);
                cartItemRepository.save(item);
            } else {
                CartItem newItem = new CartItem(productId, product.getName(), product.getPrice(), quantity);
                cart.addItem(newItem);
            }


            return cartRepository.save(cart);
        }catch(HttpClientErrorException.NotFound ex){
            throw new RuntimeException("Product not found", ex);
        }catch (Exception ex) {
            throw new RuntimeException("Error communicating with Product Service", ex);
        }
    }


    @Transactional
    public Cart removeItemFromCart(Long cartId, Long itemId) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found"));


        CartItem item = cartItemRepository.findById(itemId).orElseThrow(() -> new RuntimeException("Cart item not found"));


        if (item.getCart().getCartId() != cartId) {
            throw new RuntimeException("Item does not belong to this cart");
        }


        cart.removeItem(item);
        cartItemRepository.delete(item);


        return cartRepository.save(cart);
    }


    @Transactional
    public void clearCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));


        cart.getItems().clear();
        cartRepository.save(cart);
    }


}