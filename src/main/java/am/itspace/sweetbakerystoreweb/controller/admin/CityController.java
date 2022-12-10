package am.itspace.sweetbakerystoreweb.controller.admin;

import am.itspace.sweetbakerystorecommon.entity.City;
import am.itspace.sweetbakerystorecommon.service.CityService;
import am.itspace.sweetbakerystoreweb.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
@Slf4j
public class CityController {
    private final CityService cityService;

    @GetMapping(value = "/cities")
    public String citiesPage(ModelMap modelMap,
                             @AuthenticationPrincipal CurrentUser currentUser) {
        log.info("Controller /admin/cities called by {}", currentUser.getUser().getEmail());
        modelMap.addAttribute("cities", cityService.findAll());
        return "admin/cities";
    }

    @GetMapping(value = "/cities/delete/{id}")
    public String delete(@PathVariable("id") int id,
                         ModelMap modelMap,
                         @AuthenticationPrincipal CurrentUser currentUser) {
        try {
            cityService.deleteById(id);
        } catch (Exception e) {
            modelMap.addAttribute("deleteErrorMessage", "You can not delete this object because there is some relationships with it.");
            return "admin/cities";
        }
        log.info("Controller /admin/cities/delete called by {}", currentUser.getUser().getEmail());
        return "redirect:/admin/cities";
    }

    @GetMapping(value = "/cities-add")
    public String addAddressPage(@AuthenticationPrincipal CurrentUser currentUser) {
        log.info("Controller admin/cities-add called by {}", currentUser.getUser().getEmail());
        return "admin/cities-add";
    }

    @PostMapping(value = "/cities-add")
    public String addCity(@ModelAttribute City city, ModelMap modelMap, @AuthenticationPrincipal CurrentUser currentUser) {
        Optional<City> byName = cityService.findByName(city.getName());
        if (byName.isPresent()) {
            modelMap.addAttribute("errorMessage", "City with this name has already exists.");
            return "admin/cities-add";
        }
        log.info("Controller admin/cities-add added by {}", currentUser.getUser().getEmail());
        cityService.save(city);
        return "redirect:/admin/cities";
    }

    @GetMapping("/cities-edit")
    public String editCityPage(@RequestParam("id") int id,
                               ModelMap modelMap,
                               @AuthenticationPrincipal CurrentUser currentUser) {
        Optional<City> cityOptional = cityService.findById(id);
        if (cityOptional.isEmpty()) {
            return "redirect:/admin/cities";
        }
        log.info("Controller admin/cities-edit called by {}", currentUser.getUser().getEmail());
        modelMap.addAttribute("city", cityOptional.get());
        return "admin/cities-edit";
    }

    @PostMapping("/cities-edit")
    public String editCity(@ModelAttribute City city,
                           @AuthenticationPrincipal CurrentUser currentUser) {
        cityService.save(city);
        log.info("Controller admin/cities-edit updated by {}", currentUser.getUser().getEmail());

        return "redirect:/cities";
    }
}
