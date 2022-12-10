package am.itspace.sweetbakerystoreweb.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BlogController {
    @GetMapping(value = "/blog")
    public String blog() {
        return "web/blog/index";
    }
}
