package com.chengrui.st.controller;

import com.chengrui.st.entity.Order;
import com.chengrui.st.enums.ErrorMsg;
import com.chengrui.st.service.OrderService;
import com.chengrui.st.utils.IdFactoryUtil;
import com.chengrui.st.utils.OrderTaskHandler;
import com.chengrui.st.vo.R;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

@CrossOrigin
@RestController
@RequestMapping("/order")
public class OrderController {

    @Resource
    private OrderService orderService;

    @PostMapping("/add")
    public R addOrder(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId,
            @RequestBody Order order
    ) {
        if (OrderTaskHandler.orderService == null) {
            OrderTaskHandler.orderService = orderService;
        }
        order.setOrderNumber(IdFactoryUtil.getOrderId());
        order.setCreateTime(new Date());
        order.setUserId(Long.valueOf(shUserId));
        order.setOrderStatus((byte) 0);
        order.setPaymentStatus((byte) 0);
        if (orderService.addOrder(order)) {
            return R.success(order);
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

    @GetMapping("/info")
    public R getOrderInfo(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId,
            @RequestParam Long id
    ) {
        Order order = orderService.getOrder(id);
        if (order.getUserId().equals(Long.valueOf(shUserId)) ||
                order.getIdleItem().getUserId().equals(Long.valueOf(shUserId))) {
            return R.success(order);
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

    @PostMapping("/update")
    public R updateOrder(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId,
            @RequestBody Order order
    ) {
        if (order.getPaymentStatus() != null && order.getPaymentStatus().equals((byte) 1)) {
            order.setPaymentTime(new Date());
        }
        if (orderService.updateOrder(order)) {
            return R.success(order);
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

    @GetMapping("/my")
    public R getMyOrder(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId
    ) {
        return R.success(orderService.getMyOrder(Long.valueOf(shUserId)));
    }

    @GetMapping("/my-sold")
    public R getMySoldIdle(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId
    ) {
        return R.success(orderService.getMySoldIdle(Long.valueOf(shUserId)));
    }
}
