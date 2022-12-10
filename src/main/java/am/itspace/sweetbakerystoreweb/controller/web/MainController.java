package am.itspace.sweetbakerystoreweb.controller.web;

import am.itspace.sweetbakerystorecommon.entity.Role;
import am.itspace.sweetbakerystorecommon.entity.User;
//import am.itspace.sweetbakerystorecommon.service.AddressService;
import am.itspace.sweetbakerystorecommon.service.CityService;
import am.itspace.sweetbakerystorecommon.service.UserService;
import am.itspace.sweetbakerystoreweb.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MainController {

    private final UserService userService;
//    private final AddressService addressService;
    private final CityService cityService;

    @GetMapping(value = "/")
    public String mainPage() {
        return "web/index";
    }

    @GetMapping("/access-denied")
    public String accessDenied() {
        return "404";
    }

    @GetMapping("/login-success")
    public String loginSuccess(@AuthenticationPrincipal CurrentUser currentUser) {
        if (currentUser != null) {
            User user = currentUser.getUser();
            log.info("User with username {} logged", currentUser.getUser().getEmail());
            if (user.getRole() == Role.ADMIN || user.getRole() == Role.PARTNER) {
                return "redirect:/admin/admin-page";
            } else if (user.getRole() == Role.USER) {
                return "redirect:/user/my-account";
            }
        }
        return "redirect:/";
    }


    @GetMapping("/register")
    public String registerPage(ModelMap map) {
        map.addAttribute("cities", cityService.findAll());
        map.addAttribute("user", new User());
        return "register";
    }

    //Registration user with address and cityId
    @PostMapping("/register")
    public String addUser(@Valid @ModelAttribute("user") User user, BindingResult result,
                          @RequestParam("userImage") MultipartFile file,
                          @RequestParam("addressName") String addressName,
                          @RequestParam("cityId") int cityId,
                          ModelMap modelMap
                          ) throws IOException {
//        Optional<User> byEmail = userService.findByEmail(user.getEmail());
        if (result.hasErrors()) {
            modelMap.addAttribute("cities", cityService.findAll());
            return "register";
//        } else if (byEmail.isPresent()) {
//            modelMap.addAttribute("errorMessage", "Email Already in use");
//            return "register";
        } else {
            if (!file.isEmpty() && file.getSize() > 0) {
                if (file.getContentType() != null && !file.getContentType().contains("image")) {
                    modelMap.addAttribute("errorMessageFile", "Please choose only image");
                    return "register";
                }
            }
//            userService.saveUser(user, cityId, addressName, file);
            log.info("User with username {} registered", user.getEmail());
            return "redirect:/login";
        }
    }

    @GetMapping(value = "/verify/user")
    public String verifyUser(@RequestParam("email") String email, @RequestParam("token") String token,
                             ModelMap modelMap) throws Exception {
        boolean verified = userService.verifyUser(email, token);
        String pageTitle = verified ? "Verification Succeeded!" : "Verification Failed";
        modelMap.addAttribute("pageTitle", pageTitle);
        return verified ? "verify-success" : "verify-fail";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login-page";
    }
}
