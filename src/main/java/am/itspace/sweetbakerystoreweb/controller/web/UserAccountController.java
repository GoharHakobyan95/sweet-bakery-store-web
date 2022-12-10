package am.itspace.sweetbakerystoreweb.controller.web;

import am.itspace.sweetbakerystorecommon.entity.Address;
import am.itspace.sweetbakerystorecommon.entity.User;
import am.itspace.sweetbakerystorecommon.service.AddressService;
import am.itspace.sweetbakerystorecommon.service.CityService;
import am.itspace.sweetbakerystorecommon.service.UserService;
import am.itspace.sweetbakerystoreweb.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.validation.Valid;
import java.io.IOException;
import java.security.Principal;
import java.util.Optional;


@Controller
@RequestMapping("/user")
@RequiredArgsConstructor
@Slf4j
public class UserAccountController {

    private final BCryptPasswordEncoder passwordEncoder;
    private final UserService userService;
    private final AddressService addressService;
    private final CityService cityService;


    @GetMapping(value = "/my-account")
    public String userAccount() {
        return "web/user-account/index";
    }

    @GetMapping(value = "/my-account-edit")
    public String userEditAccountPage(@AuthenticationPrincipal CurrentUser currentUser,
                                      ModelMap modelMap) {
        String email = currentUser.getUsername();
        User user = userService.getByEmail(email);
        log.info("Endpoint user/my-account-edit called by {}", currentUser.getUser().getEmail());
        modelMap.addAttribute("user", user);
        modelMap.addAttribute("addresses", addressService.findAll());
        return "web/user-account/edit-account";
    }

    @PostMapping(value = "/my-account-edit")
    public String userEditAccount(@Valid @ModelAttribute User user, BindingResult result,
                                  @AuthenticationPrincipal CurrentUser currentUser,
                                  @RequestParam("userImage") MultipartFile file,
                                  ModelMap modelMap) throws IOException {
        if (!file.isEmpty() && file.getSize() > 0) {
            if (file.getContentType() != null && !file.getContentType().contains("image")) {
                modelMap.addAttribute("errorMessageFile", "Please choose only image");
            }
        }
        Optional<User> userById = userService.findById(currentUser.getUser().getId());
        if (userById.isPresent()) {
            user.setId(userById.get().getId());
            user.setProfilePic(userById.get().getProfilePic());
        }
        if (result.hasErrors()) {
            modelMap.addAttribute("addresses", addressService.findAll());
            return "web/user-account/edit-account";
        }
        log.info("Endpoint user/my-account-edit called by {}", currentUser.getUser().getEmail());
        userService.updateUser(user, file);
        return "redirect:/user/my-account";
    }

    @PostMapping("/changePassword")
    public String changePassword(@RequestParam("oldPassword") String oldPassword,
                                 @RequestParam("newPassword") String newPassword,
                                 Principal principal, ModelMap modelMap) {
        String userName = principal.getName();
        User currentUser = this.userService.getByEmail(userName);
        if (this.passwordEncoder.matches(oldPassword, currentUser.getPassword())) {
            //change user's  password
            currentUser.setPassword(this.passwordEncoder.encode(newPassword));
            this.userService.save(currentUser);
            modelMap.addAttribute("message", "Your password is successfully changed");
        } else {
            modelMap.addAttribute("message", "Please enter correct old password");
        }
        log.info("{} changed his password.", principal.getName());
        return "redirect:/user/my-account";
    }

    @GetMapping(value = "/my-orders")
    public String userOrdersPage() {
        return "web/user-account/my-orders";
    }


    @GetMapping(value = "/edit-address")
    public String userAddressPage(@RequestParam("id") int id,
                                  @AuthenticationPrincipal CurrentUser currentUser,
                                  ModelMap modelMap) {
        Optional<Address> addressById = addressService.findById(id);
        if (addressById.isEmpty()) {
            return "redirect:/user/my-account";
        }
        log.info("Endpoint user/edit-address called by {}", currentUser.getUser().getEmail());
        modelMap.addAttribute("address", addressById.get());
        modelMap.addAttribute("cities", cityService.findAll());
        return "web/user-account/edit-address";
    }


    @PostMapping(value = "/edit-address")
    public String userEditAddress(@ModelAttribute Address address,
                                  @AuthenticationPrincipal CurrentUser currentUser) {
        addressService.saveAddress(address);
        log.info("{} updated address.", currentUser.getUser().getEmail());
        return "redirect:/user/my-account";
    }


    @GetMapping(value = "/getImage", produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody byte[] getImage(@RequestParam("fileName") String fileName) throws IOException {
        return userService.getUserImage(fileName);
    }

}
