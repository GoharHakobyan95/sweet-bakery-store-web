package am.itspace.sweetbakerystoreweb.controller.admin;


import am.itspace.sweetbakerystorecommon.entity.Category;
import am.itspace.sweetbakerystorecommon.service.CategoryService;
import am.itspace.sweetbakerystorecommon.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
@Slf4j
public class CategoryAdminController {

    private final CategoryService categoryService;

    @GetMapping(value = "/categories")
    public String categoryPage(ModelMap modelMap,
                               @RequestParam("page") Optional<Integer> page,
                               @RequestParam("size") Optional<Integer> size,
                               @AuthenticationPrincipal CurrentUser currentUser) {
        int currentPage = page.orElse(1);
        int pageSize = size.orElse(5);
        Page<Category> paginated = categoryService.findPaginated(PageRequest.of(currentPage - 1, pageSize));
        modelMap.addAttribute("categories", paginated);
        int totalPages = paginated.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            modelMap.addAttribute("pageNumbers", pageNumbers);
        }
        log.info("Controller /admin/categories called by {}", currentUser.getUser().getEmail());
        return "admin/categories";
    }

    @GetMapping(value = "/categories-add")
    public String addCategoryPage(@AuthenticationPrincipal CurrentUser currentUser, ModelMap modelMap) {
        modelMap.addAttribute("category", new Category());
        log.info("Controller admin/categories-add called by {}", currentUser.getUser().getEmail());
        return "admin/categories-add";
    }

    @PostMapping(value = "/categories-add")
    public String addCategory(@Valid @ModelAttribute Category category, BindingResult result,
                              @AuthenticationPrincipal CurrentUser currentUser,
                              ModelMap modelMap) throws Exception {
        Optional<Category> byName = categoryService.findByName(category.getName());
        if (byName.isPresent()) {
            modelMap.addAttribute("errorMessageCategoryName", "Category with this name has already exists.");
            return "admin/categories-add";
        }
        if (result.hasErrors()) {
            return "admin/categories-add";
        }
        log.info("Controller admin/categories-add added by {}", currentUser.getUser().getEmail());
        categoryService.save(category, currentUser.getUser());
        return "redirect:/admin/categories";

    }

    @GetMapping(value = "/categories-edit")
    public String editCategoryPage(@RequestParam("id") int id,
                                   ModelMap modelMap,
                                   @AuthenticationPrincipal CurrentUser currentUser) {
        Optional<Category> categoryOptional = categoryService.findByIdForEdit(id);
        if (categoryOptional.isEmpty()) {
            return "redirect:/admin/categories";
        }
        log.info("Controller admin/categories-edit called by {}", currentUser.getUser().getEmail());
        modelMap.addAttribute("category", categoryOptional.get());
        return "admin/categories-edit";
    }

    @PostMapping(value = "/categories-edit")
    public String editCategory(@ModelAttribute Category category,
                               @AuthenticationPrincipal CurrentUser currentUser) throws Exception {
        log.info("Controller admin/categories-edit updated by {}", currentUser.getUser().getEmail());
        categoryService.save(category, currentUser.getUser());
        return "redirect:/admin/categories";
    }

    @GetMapping(value = "/categories/delete/{id}")
    public String delete(@PathVariable("id") int id,
                         ModelMap modelMap,
                         @AuthenticationPrincipal CurrentUser currentUser) {
        try {
            categoryService.deleteById(id);
        } catch (Exception e) {
            modelMap.addAttribute("deleteErrorMessage", "You can not delete this object because there is some relationships with it.");
            return "admin/categories";
        }
        log.info("Controller admin/categories/delete deleted by {}", currentUser.getUser().getEmail());
        return "redirect:/admin/categories";
    }
}
