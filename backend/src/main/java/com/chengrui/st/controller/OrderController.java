package com.chengrui.st.controller;

import com.chengrui.st.entity.Order;
import com.chengrui.st.enums.ErrorMsg;
import com.chengrui.st.service.OrderService;
import com.chengrui.st.utils.IdFactoryUtil;
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
        if (order == null || order.getIdleId() == null) {
            return R.fail(ErrorMsg.PARAM_ERROR);
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
        if (order == null || order.getIdleItem() == null) {
            return R.fail(ErrorMsg.SYSTEM_ERROR);
        }
        Long userId = Long.valueOf(shUserId);
        if (order.getUserId().equals(userId) || order.getIdleItem().getUserId().equals(userId)) {
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
        if (order == null || order.getId() == null) {
            return R.fail(ErrorMsg.PARAM_ERROR);
        }
        Order current = orderService.getOrder(order.getId());
        if (current == null || current.getIdleItem() == null) {
            return R.fail(ErrorMsg.SYSTEM_ERROR);
        }
        Long userId = Long.valueOf(shUserId);
        boolean buyer = userId.equals(current.getUserId());
        boolean seller = userId.equals(current.getIdleItem().getUserId());
        if (!buyer && !seller) {
            return R.fail(ErrorMsg.SYSTEM_ERROR);
        }
        if (order.getPaymentStatus() != null) {
            if (!buyer || !order.getPaymentStatus().equals((byte) 1)) {
                return R.fail(ErrorMsg.SYSTEM_ERROR);
            }
            if (current.getPaymentStatus() != 0 || current.getOrderStatus() == 4 || current.getOrderStatus() == 3) {
                return R.fail(ErrorMsg.SYSTEM_ERROR);
            }
            order.setPaymentTime(new Date());
        }
        if (order.getOrderStatus() != null) {
            byte status = order.getOrderStatus();
            if (status == 2 && !seller) {
                return R.fail(ErrorMsg.SYSTEM_ERROR);
            }
            if (status == 3 && !buyer) {
                return R.fail(ErrorMsg.SYSTEM_ERROR);
            }
            if (status == 4 && !buyer && !seller) {
                return R.fail(ErrorMsg.SYSTEM_ERROR);
            }
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
