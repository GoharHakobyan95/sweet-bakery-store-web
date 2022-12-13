package am.itspace.sweetbakerystoreweb.controller.admin;

import am.itspace.sweetbakerystorecommon.entity.Role;
import am.itspace.sweetbakerystorecommon.entity.User;
import am.itspace.sweetbakerystorecommon.service.*;
import am.itspace.sweetbakerystorecommon.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
@Slf4j
public class UserAdminController {

    private final UserService userService;
    private final OrderService orderService;
    private final ProductService productService;
    private final CategoryService categoryService;
    private final FavoriteProductService favoriteProductService;

    @GetMapping(value = "/users")
    public String usersPage(ModelMap modelMap,
                            @RequestParam("page") Optional<Integer> page,
                            @RequestParam("size") Optional<Integer> size,
                            @AuthenticationPrincipal CurrentUser currentUser) {
        int currentPage = page.orElse(1);
        int pageSize = size.orElse(5);
        Page<User> paginated = userService.findPaginated(PageRequest.of(currentPage - 1, pageSize));
        modelMap.addAttribute("users", paginated);
        int totalPages = paginated.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            modelMap.addAttribute("pageNumbers", pageNumbers);
        }
        log.info("Controller admin/users called by {}", currentUser.getUser().getEmail());
        List<Role> roles = Arrays.asList(Role.values());
        modelMap.addAttribute("roles", roles);
        return "admin/users";
    }

    @GetMapping(value = "/users/getImage", produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody byte[] getImage(@RequestParam("fileName") String fileName) throws IOException {
        return userService.getUserImage(fileName);

    }

    @GetMapping(value = "/users/delete/{id}")
    public String delete(@PathVariable("id") int id,
                         ModelMap modelMap,
                         @AuthenticationPrincipal CurrentUser currentUser) {
        try {
            userService.deleteById(id);
        } catch (Exception e) {
            modelMap.addAttribute("deleteErrorMessage",
                    "You can not delete this object because there is some relationships with it.");
            return "admin/users";
        }
        log.info("Controller admin/users/delete called by {}", currentUser.getUser().getEmail());
        return "redirect:/admin/users";
    }

    @PostMapping(value = "/users/change-role")
    public String userChangeRole(@RequestParam("userId") int userId,
                                 @RequestParam("role") Role role,
                                 @AuthenticationPrincipal CurrentUser currentUser) {
        userService.findByIdAndRole(userId, role);
        log.info("Controller admin/users/change-role called by {}", currentUser.getUser().getEmail());
        return "redirect:/admin/users";
    }

    @GetMapping(value = "/dashboard")
    public String countOfEntities(Model model) {
        //show statistics on admin dashboard
        model.addAttribute("usersCount", userService.getCountOfUsers());
        model.addAttribute("ordersCount", orderService.getCountOfOrders());
        model.addAttribute("categoriesCount", categoryService.getCountOfCategories());
        model.addAttribute("productsCount", productService.getCountOfProducts());
        model.addAttribute("favoriteProductsCount", favoriteProductService.getCountOfFavoriteProducts());
        model.addAttribute("productsSale", productService.getAmount());
        return "/admin/statistics";

    }

}
