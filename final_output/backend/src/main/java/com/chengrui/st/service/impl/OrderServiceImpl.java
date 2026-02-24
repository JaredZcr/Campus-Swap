package com.chengrui.st.service.impl;

import com.chengrui.st.entity.IdleItem;
import com.chengrui.st.entity.Order;
import com.chengrui.st.mapper.IdleItemMapper;
import com.chengrui.st.mapper.OrderMapper;
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

    private static HashMap<Integer, ReentrantLock> lockMap = new HashMap<>();

    static {
        for (int i = 0; i < 100; i++) {
            lockMap.put(i, new ReentrantLock(true));
        }
    }

    public boolean addOrder(Order order) {
        IdleItem idleItemModel = idleItemMapper.selectByPrimaryKey(order.getIdleId());
        if (idleItemModel.getIdleStatus() != 1) {
            return false;
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
        if (idleItemModel.getIdleStatus() != 1) {
            return false;
        }
        if (idleItemMapper.updateByPrimaryKeySelective(idleItem) == 1) {
            if (orderMapper.insert(order) == 1) {
                order.setOrderStatus((byte) 4);
                
                OrderTaskHandler.addOrder(new OrderTask(order, 30 * 60));
                return true;
            } else {
                new RuntimeException();
            }
        }
        return false;
    }

    public Order getOrder(Long id) {
        Order order = orderMapper.selectByPrimaryKey(id);
        order.setIdleItem(idleItemMapper.selectByPrimaryKey(order.getIdleId()));
        return order;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean updateOrder(Order order) {
        
        order.setOrderNumber(null);
        order.setUserId(null);
        order.setIdleId(null);
        order.setCreateTime(null);
        if (order.getOrderStatus() == 4) {
            
            Order o = orderMapper.selectByPrimaryKey(order.getId());
            if (o.getOrderStatus() != 0) {
                return false;
            }
            IdleItem idleItemModel = idleItemMapper.selectByPrimaryKey(o.getIdleId());
            if (idleItemModel.getIdleStatus() == 2) {
                IdleItem idleItem = new IdleItem();
                idleItem.setId(o.getIdleId());
                idleItem.setUserId(idleItemModel.getUserId());
                idleItem.setIdleStatus((byte) 1);
                if (orderMapper.updateByPrimaryKeySelective(order) == 1) {
                    if (idleItemMapper.updateByPrimaryKeySelective(idleItem) == 1) {
                        return true;
                    } else {
                        new RuntimeException();
                    }
                }
                return false;
            } else {
                if (orderMapper.updateByPrimaryKeySelective(order) == 1) {
                    return true;
                } else {
                    new RuntimeException();
                }
            }
        }
        return orderMapper.updateByPrimaryKeySelective(order) == 1;
    }

    public List<Order> getMyOrder(Long userId) {
        List<Order> list = orderMapper.getMyOrder(userId);
        if (list.size() > 0) {
            List<Long> idleIdList = new ArrayList<>();
            for (Order i : list) {
                idleIdList.add(i.getIdleId());
            }
            List<IdleItem> idleItemList = idleItemMapper.findIdleByList(idleIdList);
            Map<Long, IdleItem> map = new HashMap<>();
            for (IdleItem idle : idleItemList) {
                map.put(idle.getId(), idle);
            }
            for (Order i : list) {
                i.setIdleItem(map.get(i.getIdleId()));
            }
        }
        return list;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public List<Order> getMySoldIdle(Long userId) {
        List<IdleItem> list = idleItemMapper.getAllIdleItem(userId);
        List<Order> orderList = null;
        if (list.size() > 0) {
            List<Long> idleIdList = new ArrayList<>();
            for (IdleItem i : list) {
                idleIdList.add(i.getId());
            }
            orderList = orderMapper.findOrderByIdleIdList(idleIdList);
            Map<Long, IdleItem> map = new HashMap<>();
            for (IdleItem idle : list) {
                map.put(idle.getId(), idle);
            }
            for (Order o : orderList) {
                o.setIdleItem(map.get(o.getIdleId()));
            }
        }
        return orderList;
    }

    public PageVo<Order> getAllOrder(int page, int nums) {
        List<Order> list = orderMapper.getAllOrder((page - 1) * nums, nums);
        if (list.size() > 0) {
            List<Long> idleIdList = new ArrayList<>();
            for (Order i : list) {
                idleIdList.add(i.getIdleId());
            }
            List<IdleItem> idleItemList = idleItemMapper.findIdleByList(idleIdList);
            Map<Long, IdleItem> map = new HashMap<>();
            for (IdleItem idle : idleItemList) {
                map.put(idle.getId(), idle);
            }
            for (Order i : list) {
                i.setIdleItem(map.get(i.getIdleId()));
            }
        }
        int count = orderMapper.countAllOrder();
        return new PageVo<>(list, count);
    }

    public boolean deleteOrder(long id) {
        return orderMapper.deleteByPrimaryKey(id) == 1;
    }
}
