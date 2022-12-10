package am.itspace.sweetbakerystoreweb.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WishListController {
    @GetMapping(value = "/favorite-products")
    public String wishlist() {
        return "web/wishlist/index";
    }

    @GetMapping(value = "/review")
    public String review() {
        return "web/wishlist/index-1";
    }


}
