package am.itspace.sweetbakerystoreweb.controller.admin;

import am.itspace.sweetbakerystorecommon.entity.FavoriteProduct;
import am.itspace.sweetbakerystorecommon.service.FavoriteProductService;
import am.itspace.sweetbakerystorecommon.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
@RequestMapping("/user")
@RequiredArgsConstructor
@Slf4j
public class FavoriteProductController {
    private final FavoriteProductService favoriteProductService;

    @GetMapping(value = "/favorite-products")
    public String favoriteProductPage(@AuthenticationPrincipal CurrentUser currentUser, ModelMap modelMap,
                                      @RequestParam("page") Optional<Integer> page,
                                      @RequestParam("size") Optional<Integer> size) {
        int currentPage = page.orElse(1);
        int pageSize = size.orElse(5);
        Page<FavoriteProduct> paginated = favoriteProductService.findPaginated(PageRequest.of(currentPage - 1, pageSize));
        List<FavoriteProduct> favProducts = favoriteProductService.getByUser(currentUser.getUser());
        modelMap.addAttribute(favProducts);
        modelMap.addAttribute("favProducts", paginated);
        int totalPages = paginated.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            modelMap.addAttribute("pageNumbers", pageNumbers);
        }
        log.info("Controller user/favorite-products called by {}", currentUser.getUser().getEmail());
        return "web/wishlist/index";
    }
}
