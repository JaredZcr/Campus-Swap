package com.chengrui.st.controller;

import com.chengrui.st.entity.Order;
import com.chengrui.st.entity.OrderAddress;
import com.chengrui.st.enums.ErrorMsg;
import com.chengrui.st.service.OrderAddressService;
import com.chengrui.st.service.OrderService;
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

    @Resource
    private OrderService orderService;

    @PostMapping("/add")
    public R addOrderAddress(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again") String shUserId,
            @RequestBody OrderAddress orderAddress
    ) {
        if (orderAddress == null || orderAddress.getOrderId() == null) {
            return R.fail(ErrorMsg.PARAM_ERROR);
        }
        if (!canModifyOrderAddress(Long.valueOf(shUserId), orderAddress.getOrderId())) {
            return R.fail(ErrorMsg.SYSTEM_ERROR);
        }
        if (orderAddressService.addOrderAddress(orderAddress)) {
            return R.success(orderAddress);
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

    @PostMapping("/update")
    public R updateOrderAddress(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again") String shUserId,
            @RequestBody OrderAddress orderAddress
    ) {
        if (orderAddress == null || orderAddress.getOrderId() == null) {
            return R.fail(ErrorMsg.PARAM_ERROR);
        }
        OrderAddress current = orderAddressService.getOrderAddress(orderAddress.getOrderId());
        Long orderId = current != null ? current.getOrderId() : orderAddress.getOrderId();
        if (orderId == null || !canModifyOrderAddress(Long.valueOf(shUserId), orderId)) {
            return R.fail(ErrorMsg.SYSTEM_ERROR);
        }
        if (orderAddressService.updateOrderAddress(orderAddress)) {
            return R.success(orderAddress);
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

    @GetMapping("/info")
    public R getOrderAddress(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again") String shUserId,
            @RequestParam Long orderId
    ) {
        if (!canAccessOrder(Long.valueOf(shUserId), orderId)) {
            return R.fail(ErrorMsg.SYSTEM_ERROR);
        }
        return R.success(orderAddressService.getOrderAddress(orderId));
    }

    private boolean canAccessOrder(Long userId, Long orderId) {
        Order order = orderService.getOrder(orderId);
        return order != null && order.getIdleItem() != null
                && (userId.equals(order.getUserId()) || userId.equals(order.getIdleItem().getUserId()));
    }

    private boolean canModifyOrderAddress(Long userId, Long orderId) {
        Order order = orderService.getOrder(orderId);
        return order != null && userId.equals(order.getUserId());
    }
}
