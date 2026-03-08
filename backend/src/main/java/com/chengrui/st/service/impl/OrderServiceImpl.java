package com.chengrui.st.service.impl;

import com.chengrui.st.entity.IdleItem;
import com.chengrui.st.entity.Order;
import com.chengrui.st.entity.User;
import com.chengrui.st.mapper.IdleItemMapper;
import com.chengrui.st.mapper.OrderMapper;
import com.chengrui.st.mapper.UserMapper;
import com.chengrui.st.service.OrderService;
import com.chengrui.st.utils.OrderTask;
import com.chengrui.st.utils.OrderTaskHandler;
import com.chengrui.st.vo.PageVo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;

@Service
public class OrderServiceImpl implements OrderService {

    @Resource
    private OrderMapper orderMapper;

    @Resource
    private IdleItemMapper idleItemMapper;

    @Resource
    private UserMapper userMapper;

    private static final HashMap<Integer, ReentrantLock> lockMap = new HashMap<>();

    static {
        for (int i = 0; i < 100; i++) {
            lockMap.put(i, new ReentrantLock(true));
        }
    }

    public boolean addOrder(Order order) {
        if (order == null || order.getIdleId() == null || order.getUserId() == null) {
            return false;
        }
        IdleItem idleItemModel = idleItemMapper.selectByPrimaryKey(order.getIdleId());
        if (idleItemModel == null || idleItemModel.getIdleStatus() != 1) {
            return false;
        }
        if (order.getUserId().equals(idleItemModel.getUserId())) {
            return false;
        }
        order.setOrderPrice(idleItemModel.getIdlePrice());
        if (order.getPaymentWay() == null || order.getPaymentWay().isBlank()) {
            order.setPaymentWay("Online");
        }

        IdleItem idleItem = new IdleItem();
        idleItem.setId(order.getIdleId());
        idleItem.setUserId(idleItemModel.getUserId());
        idleItem.setIdleStatus((byte) 2);

        int key = (int) (order.getIdleId() % 100);
        ReentrantLock lock = lockMap.get(key);
        boolean flag;
        try {
            lock.lock();
            flag = addOrderHelp(idleItem, order);
        } finally {
            lock.unlock();
        }
        return flag;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean addOrderHelp(IdleItem idleItem, Order order) {
        IdleItem idleItemModel = idleItemMapper.selectByPrimaryKey(order.getIdleId());
        if (idleItemModel == null || idleItemModel.getIdleStatus() != 1) {
            return false;
        }
        if (idleItemMapper.updateByPrimaryKeySelective(idleItem) == 1) {
            if (orderMapper.insert(order) == 1) {
                Order cancelTaskOrder = new Order();
                cancelTaskOrder.setId(order.getId());
                cancelTaskOrder.setOrderStatus((byte) 4);
                OrderTaskHandler.addOrder(new OrderTask(cancelTaskOrder, 30 * 60));
                return true;
            }
            throw new RuntimeException("Failed to create order");
        }
        return false;
    }

    public Order getOrder(Long id) {
        Order order = orderMapper.selectByPrimaryKey(id);
        if (order == null) {
            return null;
        }
        IdleItem idleItem = idleItemMapper.selectByPrimaryKey(order.getIdleId());
        if (idleItem != null) {
            idleItem.setUser(userMapper.selectByPrimaryKey(idleItem.getUserId()));
        }
        order.setIdleItem(idleItem);
        order.setUser(userMapper.selectByPrimaryKey(order.getUserId()));
        return order;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean updateOrder(Order order) {
        if (order == null || order.getId() == null) {
            return false;
        }
        Order current = orderMapper.selectByPrimaryKey(order.getId());
        if (current == null) {
            return false;
        }

        order.setOrderNumber(null);
        order.setUserId(null);
        order.setIdleId(null);
        order.setCreateTime(null);
        order.setOrderPrice(null);
        order.setIsDeleted(null);

        if (order.getPaymentStatus() != null) {
            if (order.getPaymentStatus() != 1 || current.getPaymentStatus() == 1) {
                return false;
            }
            if (current.getOrderStatus() == 4 || current.getOrderStatus() == 3) {
                return false;
            }
            if (current.getOrderStatus() == 0) {
                order.setOrderStatus((byte) 1);
            }
        }

        if (order.getOrderStatus() != null) {
            byte newStatus = order.getOrderStatus();
            if (newStatus == 2) {
                if (current.getPaymentStatus() != 1 || (current.getOrderStatus() != 0 && current.getOrderStatus() != 1)) {
                    return false;
                }
            } else if (newStatus == 3) {
                if (current.getPaymentStatus() != 1 || current.getOrderStatus() != 2) {
                    return false;
                }
            } else if (newStatus == 4) {
                if ((current.getOrderStatus() != 0 && current.getOrderStatus() != 1) || current.getPaymentStatus() == 1) {
                    return false;
                }
                IdleItem idleItemModel = idleItemMapper.selectByPrimaryKey(current.getIdleId());
                if (idleItemModel != null && idleItemModel.getIdleStatus() == 2) {
                    IdleItem idleItem = new IdleItem();
                    idleItem.setId(current.getIdleId());
                    idleItem.setUserId(idleItemModel.getUserId());
                    idleItem.setIdleStatus((byte) 1);
                    if (orderMapper.updateByPrimaryKeySelective(order) == 1) {
                        if (idleItemMapper.updateByPrimaryKeySelective(idleItem) == 1) {
                            return true;
                        }
                        throw new RuntimeException("Failed to restore item status");
                    }
                    return false;
                }
            } else if (newStatus != 1 && newStatus != 0) {
                return false;
            }
        }
        return orderMapper.updateByPrimaryKeySelective(order) == 1;
    }

    public List<Order> getMyOrder(Long userId) {
        List<Order> list = orderMapper.getMyOrder(userId);
        bindIdleItems(list);
        return list;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public List<Order> getMySoldIdle(Long userId) {
        List<IdleItem> list = idleItemMapper.getAllIdleItem(userId);
        if (list == null || list.isEmpty()) {
            return new ArrayList<>();
        }
        List<Long> idleIdList = new ArrayList<>();
        for (IdleItem i : list) {
            idleIdList.add(i.getId());
        }
        List<Order> orderList = orderMapper.findOrderByIdleIdList(idleIdList);
        bindIdleItems(orderList);
        return orderList;
    }

    public PageVo<Order> getAllOrder(int page, int nums) {
        List<Order> list = orderMapper.getAllOrder((page - 1) * nums, nums);
        bindIdleItems(list);
        int count = orderMapper.countAllOrder();
        return new PageVo<>(list, count);
    }

    public boolean deleteOrder(long id) {
        return orderMapper.deleteByPrimaryKey(id) == 1;
    }

    private void bindIdleItems(List<Order> list) {
        if (list == null || list.isEmpty()) {
            return;
        }
        List<Long> idleIdList = new ArrayList<>();
        List<Long> orderUserIds = new ArrayList<>();
        for (Order i : list) {
            idleIdList.add(i.getIdleId());
            if (i.getUserId() != null) {
                orderUserIds.add(i.getUserId());
            }
        }
        List<IdleItem> idleItemList = idleItemMapper.findIdleByList(idleIdList);
        Map<Long, IdleItem> idleMap = new HashMap<>();
        List<Long> itemOwnerIds = new ArrayList<>();
        for (IdleItem idle : idleItemList) {
            idleMap.put(idle.getId(), idle);
            if (idle.getUserId() != null) {
                itemOwnerIds.add(idle.getUserId());
            }
        }

        List<Long> userIds = new ArrayList<>();
        userIds.addAll(orderUserIds);
        userIds.addAll(itemOwnerIds);
        Map<Long, User> userMap = new HashMap<>();
        if (!userIds.isEmpty()) {
            List<User> users = userMapper.findUserByList(userIds);
            for (User user : users) {
                userMap.put(user.getId(), user);
            }
        }

        for (Order i : list) {
            i.setUser(userMap.get(i.getUserId()));
            IdleItem idle = idleMap.get(i.getIdleId());
            if (idle != null) {
                idle.setUser(userMap.get(idle.getUserId()));
            }
            i.setIdleItem(idle);
        }
    }
}
