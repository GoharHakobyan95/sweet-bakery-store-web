package am.itspace.sweetbakerystoreweb.controller.admin;
import am.itspace.sweetbakerystorecommon.entity.Product;
import am.itspace.sweetbakerystorecommon.service.CategoryService;
import am.itspace.sweetbakerystorecommon.service.ProductService;
import am.itspace.sweetbakerystoreweb.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.repository.query.Param;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
@Slf4j
public class ProductAdminController {

    private final ProductService productService;
    private final CategoryService categoryService;

    @GetMapping(value = "/products")
    public String productPage(ModelMap modelMap,
                              @AuthenticationPrincipal CurrentUser currentUser,
                              @RequestParam("page") Optional<Integer> page,
                              @RequestParam("size") Optional<Integer> size) {
        int currentPage = page.orElse(1);
        int pageSize = size.orElse(5);
        Page<Product> paginated = productService.findPaginated(PageRequest.of(currentPage - 1, pageSize));
        modelMap.addAttribute("products", paginated);
        int totalPages = paginated.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            modelMap.addAttribute("pageNumbers", pageNumbers);
        }
        log.info("Controller admin/products called by {}", currentUser.getUser().getEmail());
        return "admin/products";
    }

    @GetMapping(value = "/products/delete/{id}")
    public String delete(@PathVariable("id") int id,
                         ModelMap modelMap,
                         @AuthenticationPrincipal CurrentUser currentUser) {
        try {
            productService.deleteById(id);
        } catch (Exception e) {
            modelMap.addAttribute("deleteErrorMessage", "You can not delete this object because there is some relationships with it.");
            return "admin/products";
        }
        log.info("Controller admin/products/delete called by {}", currentUser.getUser().getEmail());
        return "redirect:/admin/products";
    }

    @GetMapping(value = "/products-add")
    public String addProductPage(ModelMap modelMap,
                                 @AuthenticationPrincipal CurrentUser currentUser) {
        modelMap.addAttribute("categories", categoryService.findAll());
        modelMap.addAttribute("product", new Product());
        log.info("Controller admin/products-add called by {}", currentUser.getUser().getEmail());
        return "admin/products-add";
    }

    @PostMapping(value = "/products-add")
    public String addProduct(@Valid @ModelAttribute Product product, BindingResult result,
                             @RequestParam("productImage") MultipartFile file,
                             @AuthenticationPrincipal CurrentUser currentUser,
                             ModelMap modelMap) throws IOException {
        if (!file.isEmpty() && file.getSize() > 0) {
            if (file.getContentType() != null && !file.getContentType().contains("image")) {
                modelMap.addAttribute("errorMessageFile", "Please choose only image");
                return "admin/products-add";
            }
        }
        if (result.hasErrors()) {
            return "admin/products-add";
        }
        productService.save(product, file, currentUser.getUser());
        log.info("Controller admin/products-add added by {}", currentUser.getUser().getEmail());
        return "redirect:/admin/products";
    }

    @GetMapping(value = "/products/getImage", produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody byte[] getImage(@RequestParam("fileName") String fileName) throws IOException {
        return productService.getProductImage(fileName);
    }

    @GetMapping(value = "/products-edit")
    public String editProductPage(@RequestParam("id") int id,
                                  ModelMap modelMap,
                                  @AuthenticationPrincipal CurrentUser currentUser) {
        Optional<Product> productOptional = productService.findById(id);
        if (productOptional.isEmpty()) {
            modelMap.addAttribute("categories", categoryService.findAll());
            return "redirect:/admin/products";
        }
        log.info("Controller admin/products-edit called by {}", currentUser.getUser().getEmail());
        modelMap.addAttribute("product", productOptional.get());
        modelMap.addAttribute("categories", categoryService.findAll());
        return "admin/products-edit";
    }

    @PostMapping(value = "/products-edit")
    public String editProduct(@Valid @ModelAttribute Product product, BindingResult result,
                              @RequestParam("productImage") MultipartFile file,
                              @AuthenticationPrincipal CurrentUser currentUser,
                              ModelMap modelMap) throws Exception {
        if (!file.isEmpty() && file.getSize() > 0) {
            if (file.getContentType() != null && !file.getContentType().contains("image")) {
                modelMap.addAttribute("errorMessageFile", "Please choose only image");
            }
        }
        if (result.hasErrors()) {
            modelMap.addAttribute("categories", categoryService.findAll());
            return "admin/products-edit";
        }
        log.info("Controller admin/products-edit update by {}", currentUser.getUser().getEmail());
        productService.save(product, file, currentUser.getUser());
        return "redirect:/admin/products";
    }

    @GetMapping("/search")
    public String search(@Param("products") String productList,
                         ModelMap modelMap) {
        List<Product> listProducts = productService.getAllProducts(productList);
        modelMap.addAttribute("products", listProducts);
        return ("/admin/products");

    }
}

