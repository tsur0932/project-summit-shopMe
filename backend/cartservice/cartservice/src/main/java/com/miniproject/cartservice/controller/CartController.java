package com.miniproject.cartservice.controller;


import com.miniproject.cartservice.model.Cart;
import com.miniproject.cartservice.service.CartService;
import com.miniproject.cartservice.util.ApiException;
import com.miniproject.cartservice.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(AbstractController.API_V1)
public class CartController extends AbstractController {


    @Autowired
    private CartService cartService;


    @PostMapping("/carts")
    public ResponseEntity<ResponseObject> createCart(@RequestBody CartCreateRequest request) {
        if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "User ID is required");
        }

        Cart cart = cartService.createCart(request.getUserId());
        return sendCreatedResponse(cart);
    }


    @GetMapping("/carts/{cartId}")
    public ResponseEntity<ResponseObject> getCartById(@PathVariable Long cartId) {
        return cartService.getCartById(cartId)
                .map(this::sendSuccessResponse)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Cart not found"));
    }


    @GetMapping("/users/{userId}/cart")
    public ResponseEntity<ResponseObject> getCartByUserId(@PathVariable String userId) {
        return cartService.getCartByUserId(userId)
                .map(this::sendSuccessResponse)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Cart for user not found"));
    }


    @PostMapping("/carts/{cartId}/items")
    public ResponseEntity<ResponseObject> addItemToCart(@PathVariable Long cartId, @RequestBody CartItemRequest request) {
        if (request.getProductId() == null || request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Product ID and positive quantity are required");
        }
        Cart updatedCart = cartService.addItemToCart(cartId, request.getProductId(), request.getQuantity());
        return sendSuccessResponse(updatedCart);
    }


    @DeleteMapping("/carts/{cartId}/items/{itemId}")
    public ResponseEntity<ResponseObject> removeItemFromCart(@PathVariable Long cartId, @PathVariable Long itemId) {
        Cart updatedCart = cartService.removeItemFromCart(cartId, itemId);
        return sendSuccessResponse(updatedCart);
    }


    @DeleteMapping("/carts/{cartId}/items")
    public ResponseEntity clearCart(@PathVariable Long cartId) {
        cartService.clearCart(cartId);
        return sendNoContentResponse();
    }


    public static class CartCreateRequest {
        private String userId;
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
    }


    public static class CartItemRequest {
        private Long productId;
        private Integer quantity;
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}




