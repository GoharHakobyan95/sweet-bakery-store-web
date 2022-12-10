package am.itspace.sweetbakerystoreweb.controller.admin;

import am.itspace.sweetbakerystorecommon.entity.Review;
import am.itspace.sweetbakerystorecommon.service.ReviewService;
import am.itspace.sweetbakerystoreweb.security.CurrentUser;
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
@RequiredArgsConstructor
@RequestMapping("/admin")
@Slf4j
public class ReviewAdminController {

    private final ReviewService reviewService;

    @GetMapping(value = "/reviews")
    public String reviewPage(ModelMap modelMap,
                             @RequestParam("page") Optional<Integer> page,
                             @RequestParam("size") Optional<Integer> size,
                             @AuthenticationPrincipal CurrentUser currentUser) {
        int currentPage = page.orElse(1);
        int pageSize = size.orElse(5);
        Page<Review> paginated = reviewService.findPaginated(PageRequest.of(currentPage - 1, pageSize));

        modelMap.addAttribute("reviews", paginated);
        int totalPages = paginated.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            modelMap.addAttribute("pageNumbers", pageNumbers);
        }
        log.info("Controller admin/reviews called by {}", currentUser.getUser().getEmail());
        return "admin/reviews";
    }

}
