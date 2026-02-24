package com.chengrui.st.utils;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.chengrui.st.entity.Order;

import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

public class OrderTask implements Delayed {
    @JsonFormat(locale = "zh", timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    private long time;

    private Order order;

    public OrderTask(){

    }

    public OrderTask(Order order, long time) {
        this.order = order;
        this.time = System.currentTimeMillis()+1000*time;
    }

    @Override
    public long getDelay(TimeUnit unit) {
        return time - System.currentTimeMillis();
    }

    @Override
    public int compareTo(Delayed o) {
        OrderTask Order = (OrderTask) o;
        long diff = this.time - Order.time;
        if (diff <= 0) {
            return -1;
        } else {
            return 1;
        }
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public Order getOrderModel() {
        return order;
    }

    public void setOrderModel(Order order) {
        this.order = order;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("{");
        sb.append("\"time\":")
                .append(time);
        sb.append(",\"orderModel\":")
                .append(order);
        sb.append('}');
        return sb.toString();
    }
}
