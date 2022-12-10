package am.itspace.sweetbakerystoreweb.controller.admin;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @GetMapping(value = "/admin-page")
    public String adminPage() {
        return "admin/home";
    }


}
