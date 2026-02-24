package com.chengrui.st.controller;

import com.chengrui.st.entity.OrderAddress;
import com.chengrui.st.enums.ErrorMsg;
import com.chengrui.st.service.OrderAddressService;
import com.chengrui.st.vo.R;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.constraints.NotNull;

@CrossOrigin
@RestController
@RequestMapping("/order-address")
public class OrderAddressController {

    @Resource
    private OrderAddressService orderAddressService;

    @PostMapping("/add")
    public R addOrderAddress(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @RequestBody OrderAddress orderAddress
    ) {
        return R.success(orderAddressService.addOrderAddress(orderAddress));
    }

    @PostMapping("/update")
    public R updateOrderAddress(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @RequestBody OrderAddress orderAddress
    ) {
        if (orderAddressService.updateOrderAddress(orderAddress)) {
            return R.success(orderAddress);
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

    @GetMapping("/info")
    public R getOrderAddress(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @RequestParam Long orderId
    ) {
        return R.success(orderAddressService.getOrderAddress(orderId));
    }
}
