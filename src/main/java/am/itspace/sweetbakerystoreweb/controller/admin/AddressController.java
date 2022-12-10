package am.itspace.sweetbakerystoreweb.controller.admin;

import am.itspace.sweetbakerystorecommon.entity.Address;
import am.itspace.sweetbakerystorecommon.service.AddressService;
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


@RequiredArgsConstructor
@RequestMapping("/admin")
@Slf4j
@Controller
public class AddressController {

    private final AddressService addressService;

    @GetMapping(value = "/addresses")
    public String addressPage(ModelMap modelMap,
                              @RequestParam("page") Optional<Integer> page,
                              @RequestParam("size") Optional<Integer> size,
                              @AuthenticationPrincipal CurrentUser currentUser) {
        int currentPage = page.orElse(1);
        int pageSize = size.orElse(5);
        Page<Address> paginated = addressService.findPaginated(PageRequest.of(currentPage - 1, pageSize));

        modelMap.addAttribute("addresses", paginated);
        int totalPages = paginated.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            modelMap.addAttribute("pageNumbers", pageNumbers);
        }
        log.info("Controller admin/cities-add called by {}", currentUser.getUser().getEmail());
        return "admin/addresses";
    }
}
