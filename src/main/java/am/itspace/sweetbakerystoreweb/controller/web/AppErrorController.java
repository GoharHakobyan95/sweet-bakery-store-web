package am.itspace.sweetbakerystoreweb.controller.web;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AppErrorController implements ErrorController {

    @GetMapping(value = "/error")
    public String contactStyle() {
        return "404";
    }
}

