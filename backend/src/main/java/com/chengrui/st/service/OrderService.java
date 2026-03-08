package com.chengrui.st.service;

import com.chengrui.st.entity.Order;
import com.chengrui.st.vo.PageVo;

import java.util.List;

public interface OrderService {

    
    boolean addOrder(Order order);

    
    Order getOrder(Long id);

    
    boolean updateOrder(Order order);

    
    List<Order> getMyOrder(Long userId);

    
    List<Order> getMySoldIdle(Long userId);

    PageVo<Order> getAllOrder(int page, int nums);

    boolean deleteOrder(long id);
}
