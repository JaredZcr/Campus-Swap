package com.chengrui.st.utils;

import com.chengrui.st.service.OrderService;

import java.util.concurrent.DelayQueue;

public class OrderTaskHandler {

    public static OrderService orderService=null;

    private static DelayQueue<OrderTask> delayQueue = new DelayQueue<>();

    public static void run(){
        new Thread(() -> {
            while (true) {
                if(orderService!=null&&delayQueue.size() >0){
                    OrderTask orderTask = delayQueue.poll();
                    if (orderTask != null) {
                        if(orderService.updateOrder(orderTask.getOrderModel())){
                            System.out.println("Successfully cancel the order："+orderTask.getOrderModel());
                        }else {
                            System.out.println("Cancel Task："+orderTask.getOrderModel());
                        }

                    }
                }
            }
        }).start();

    }

    public static void addOrder(OrderTask o){
        System.out.println("Add task ："+o);
        delayQueue.put(o);
    }
}
