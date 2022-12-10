package am.itspace.sweetbakerystoreweb.controller.web;

import am.itspace.sweetbakerystorecommon.entity.Product;
import am.itspace.sweetbakerystorecommon.entity.Review;
import am.itspace.sweetbakerystorecommon.service.ProductService;
import am.itspace.sweetbakerystorecommon.service.ReviewService;
import am.itspace.sweetbakerystoreweb.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;


@Controller
@RequestMapping("/products")
@RequiredArgsConstructor
@Slf4j
public class ShopController {
    private final ProductService productService;
    private final ReviewService reviewService;


    @GetMapping(value = "/shop")
    public String shop(ModelMap modelMap,
                       @PageableDefault(size = 9) Pageable pageable
                       ) {
        Page<Product> paginated = productService.findPaginated(pageable);
        modelMap.addAttribute("products", paginated);
        int totalPages = paginated.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            modelMap.addAttribute("pageNumbers", pageNumbers);
        }
        return "web/shop/index";
    }

    @GetMapping(value = "/getImage", produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody byte[] getImage(@RequestParam("fileName") String fileName) throws IOException {
        return productService.getProductImage(fileName);
    }

    @GetMapping(value = "/product/single-page/{id}")
    public String productSinglePage(@PathVariable("id") int id, ModelMap modelMap) {
        Optional<Product> byId = productService.findById(id);
        if (byId.isEmpty()) {
            return "redirect:/shop";
        }
        modelMap.addAttribute("product", byId.get());
        modelMap.addAttribute("productList",productService.getProductList());
        return "web/product-category/single-page/index";
    }


    @GetMapping(value = "/add/favorite-product")
    public String addFavProduct() {
        return "web/shop/index";
    }

    @PostMapping(value = "/add/favorite-product")
    @ResponseBody
    public void addFavProduct(@AuthenticationPrincipal CurrentUser currentUser,
                              @RequestParam int productId) {
        Optional<Product> productById = productService.findById(productId);
        productById.ifPresent(product -> product.setId(productId));
        productService.addFavoriteProduct(currentUser.getUser(), productById.get().getId());
    }


    @PostMapping(value = "/add-review")
    public String addReview(@ModelAttribute Review review,
                            @AuthenticationPrincipal CurrentUser currentUser) {
        reviewService.save(review, currentUser.getUser());
        log.info("Controller products/add-review called by {}", currentUser.getUser().getEmail());
        return "redirect:/shop";
    }


}
