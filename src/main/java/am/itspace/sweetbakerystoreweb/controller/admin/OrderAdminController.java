package am.itspace.sweetbakerystoreweb.controller.admin;

import am.itspace.sweetbakerystorecommon.entity.Order;
import am.itspace.sweetbakerystorecommon.service.OrderService;
import am.itspace.sweetbakerystoreweb.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
@Slf4j
public class OrderAdminController {

    private final OrderService orderService;

    @GetMapping(value = "/orders")
    public String orderPage(ModelMap modelMap,
                            @AuthenticationPrincipal CurrentUser currentUser,
                            @RequestParam("page") Optional<Integer> page,
                            @RequestParam("size") Optional<Integer> size) {
        int currentPage = page.orElse(1);
        int pageSize = size.orElse(5);
        Page<Order> paginated = orderService.findPaginated(PageRequest.of(currentPage - 1, pageSize));

        modelMap.addAttribute("orders", paginated);
        int totalPages = paginated.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            modelMap.addAttribute("pageNumbers", pageNumbers);
        }
        log.info("Controller admin/orders called by {}", currentUser.getUser().getEmail());
        return "admin/orders";
    }

    @GetMapping(value = "/orders/getImage", produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody byte[] getImage(@RequestParam("fileName") String fileName) throws IOException {
        return orderService.getProductImage(fileName);

    }

    @GetMapping(value = "/order-details")
    public String orderDetailsPage() {
        return "admin/order-details";
    }
}
