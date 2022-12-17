package am.itspace.sweetbakerystoreweb.controller.web;

import am.itspace.sweetbakerystorecommon.dto.basketDto.BasketDto;
import am.itspace.sweetbakerystorecommon.dto.basketDto.BasketProductDto;
import am.itspace.sweetbakerystorecommon.dto.basketDto.BasketRequest;
import am.itspace.sweetbakerystorecommon.entity.Product;
import am.itspace.sweetbakerystorecommon.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class BasketController {

    private final ProductService productService;

    @Resource(name = "basketDto")
    private BasketDto basketDto;

    @GetMapping(value = "/basket")
    public String basket() {
        return "web/basket/index";
    }

    @GetMapping(value = "/cart")
    public String cart() {
        return "web/cart/index";
    }

    @ResponseBody
    @PostMapping(value = "/add/basket")
    public ResponseEntity<List<BasketProductDto>> addBasket(@RequestBody BasketRequest basketRequest) {
        Product product = productService.findById(basketRequest.getProduct_id()).get();
        List<BasketProductDto> basketProductDtos = basketDto.getBasketProductDtos();
        boolean isNotExist = true;
        for (BasketProductDto basketProductDto : basketProductDtos) {
            if (basketProductDto.getProduct().getId() == basketRequest.getProduct_id()) {
                basketProductDto.setQuantity(basketProductDto.getQuantity() + 1);
                isNotExist = false;
                basketDto.calculateTotal();
                break;
            }
        }
        if (basketDto != null && isNotExist) {
            BasketProductDto basketProductDto = new BasketProductDto(product, basketRequest.getQuantity());
            basketDto.setSingleProduct(basketProductDto);
            basketDto.calculateTotal();
        }
        return ResponseEntity.ok(basketDto.getBasketProductDtos());
    }

    @ResponseBody
    @PostMapping(value = "/remove/basket")
    public ResponseEntity<List<BasketProductDto>> removeBasket(@RequestBody BasketRequest basketRequest) {
        productService.findById(basketRequest.getProduct_id()).ifPresent((p) -> {
            if (basketDto != null) {
                basketDto.removeSingleProduct(p.getId());
                basketDto.calculateTotal();
            }
        });
        return ResponseEntity.ok(basketDto.getBasketProductDtos());
    }
}

