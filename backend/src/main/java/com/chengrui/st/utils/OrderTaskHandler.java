package com.chengrui.st.utils;

import com.chengrui.st.service.OrderService;

import java.util.concurrent.DelayQueue;
import java.util.concurrent.atomic.AtomicBoolean;

public class OrderTaskHandler {

    public static volatile OrderService orderService = null;

    private static final DelayQueue<OrderTask> delayQueue = new DelayQueue<>();
    private static final AtomicBoolean started = new AtomicBoolean(false);

    public static void init(OrderService service) {
        orderService = service;
        run();
    }

    public static void run() {
        if (!started.compareAndSet(false, true)) {
            return;
        }
        Thread worker = new Thread(() -> {
            while (true) {
                try {
                    OrderTask orderTask = delayQueue.take();
                    if (orderService != null) {
                        if (orderService.updateOrder(orderTask.getOrderModel())) {
                            System.out.println("Successfully cancel the order：" + orderTask.getOrderModel());
                        } else {
                            System.out.println("Cancel Task：" + orderTask.getOrderModel());
                        }
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, "order-task-handler");
        worker.setDaemon(true);
        worker.start();
    }

    public static void addOrder(OrderTask o) {
        System.out.println("Add task ：" + o);
        delayQueue.put(o);
    }
}
