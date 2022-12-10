package am.itspace.sweetbakerystoreweb.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CategoryController {
    @GetMapping(value = "/category/the-rolling-pin")
    public String productRollingPin() {
        return "web/category/the-rolling-pin/index";
    }
}
