package am.itspace.sweetbakerystoreweb.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ContactController {

    @GetMapping(value = "/contact-style")
    public String contactStyle() {
        return "web/contact-style/index";
    }
}

