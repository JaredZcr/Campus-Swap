package com.chengrui.st.service;

import com.chengrui.st.entity.OrderAddress;

public interface OrderAddressService {

    
    boolean addOrderAddress(OrderAddress orderAddress);

    
    boolean updateOrderAddress(OrderAddress orderAddress);

    
    OrderAddress getOrderAddress(Long orderId);
}
