package com.chengrui.st.config;

import com.chengrui.st.service.OrderService;
import com.chengrui.st.utils.OrderTaskHandler;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class OrderTaskInitializer implements ApplicationRunner {

    private final OrderService orderService;

    public OrderTaskInitializer(OrderService orderService) {
        this.orderService = orderService;
    }

    @Override
    public void run(ApplicationArguments args) {
        OrderTaskHandler.init(orderService);
    }
}
