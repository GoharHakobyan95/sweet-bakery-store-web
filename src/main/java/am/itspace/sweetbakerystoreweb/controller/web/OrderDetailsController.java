package am.itspace.sweetbakerystoreweb.controller.web;

import am.itspace.sweetbakerystorecommon.entity.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequiredArgsConstructor
@RequestMapping("/user")
public class OrderDetailsController {

    @GetMapping(value = "/order-details")
    public String orderForm(ModelMap map) {
        map.addAttribute("order", new Order());
        return "web/order-details/index";
    }

    @GetMapping(value = "/order/buy-now")
    public String createOrder() {
        return "web/checkout/index";
    }

}
