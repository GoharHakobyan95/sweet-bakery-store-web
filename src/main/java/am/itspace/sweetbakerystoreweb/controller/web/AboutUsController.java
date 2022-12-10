package am.itspace.sweetbakerystoreweb.controller.web;


import am.itspace.sweetbakerystorecommon.entity.User;
import am.itspace.sweetbakerystorecommon.service.AboutUsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RequiredArgsConstructor
@Controller
@Slf4j
public class AboutUsController {
    private final AboutUsService aboutUsService;

    @GetMapping(value = "/about-us")
    public String aboutUs() {
        return "web/about-us/index";
    }

    @GetMapping(value = "/contact-us")
    public String contactUs() {
        return "web/about-us/index";
    }

    @PostMapping(value = "/contact-us")
    public String submitContact(@ModelAttribute User user,
                                @RequestParam String message) {
        aboutUsService.sendMail(user, message);
        log.info("Controller /contact-us called by {}", user.getEmail());
        return "web/about-us/contact";
    }
}
