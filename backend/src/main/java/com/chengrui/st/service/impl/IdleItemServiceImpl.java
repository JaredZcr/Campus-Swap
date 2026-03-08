package com.chengrui.st.service.impl;

import com.chengrui.st.entity.IdleItem;
import com.chengrui.st.entity.User;
import com.chengrui.st.mapper.IdleItemMapper;
import com.chengrui.st.mapper.UserMapper;
import com.chengrui.st.service.IdleItemService;
import com.chengrui.st.vo.PageVo;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class IdleItemServiceImpl implements IdleItemService {

    @Resource
    private IdleItemMapper idleItemMapper;

    @Resource
    private UserMapper userMapper;

    public boolean addIdleItem(IdleItem idleItem) {
        return idleItemMapper.insert(idleItem) == 1;
    }

    public IdleItem getIdleItem(Long id) {
        IdleItem idleItem = idleItemMapper.selectByPrimaryKey(id);
        if (idleItem != null) {
            idleItem.setUser(userMapper.selectByPrimaryKey(idleItem.getUserId()));
        }
        return idleItem;
    }

    public List<IdleItem> getAllIdelItem(Long userId) {
        return idleItemMapper.getAllIdleItem(userId);
    }

    public PageVo<IdleItem> findIdleItem(String findValue, int page, int nums) {
        List<IdleItem> list = idleItemMapper.findIdleItem(findValue, (page - 1) * nums, nums);
        bindUsers(list);
        int count = idleItemMapper.countIdleItem(findValue);
        return new PageVo<>(list, count);
    }

    public PageVo<IdleItem> findIdleItemByLable(int idleLabel, String findValue, int page, int nums) {
        List<IdleItem> list = idleItemMapper.findIdleItemByLable(idleLabel, findValue, (page - 1) * nums, nums);
        bindUsers(list);
        int count = idleItemMapper.countIdleItemByLable(idleLabel, findValue);
        return new PageVo<>(list, count);
    }

    public boolean updateIdleItem(IdleItem idleItem) {
        if (idleItem.getId() == null) {
            return false;
        }
        IdleItem current = idleItemMapper.selectByPrimaryKey(idleItem.getId());
        if (current == null) {
            return false;
        }
        if (idleItem.getUserId() != null && !idleItem.getUserId().equals(current.getUserId())) {
            return false;
        }
        return idleItemMapper.updateByPrimaryKeySelective(idleItem) == 1;
    }

    public PageVo<IdleItem> adminGetIdleList(int status, int page, int nums) {
        List<IdleItem> list = idleItemMapper.getIdleItemByStatus(status, (page - 1) * nums, nums);
        bindUsers(list);
        int count = idleItemMapper.countIdleItemByStatus(status);
        return new PageVo<>(list, count);
    }

    private void bindUsers(List<IdleItem> list) {
        if (list == null || list.isEmpty()) {
            return;
        }
        List<Long> idList = new ArrayList<>();
        for (IdleItem i : list) {
            idList.add(i.getUserId());
        }
        List<User> userList = userMapper.findUserByList(idList);
        Map<Long, User> map = new HashMap<>();
        for (User user : userList) {
            map.put(user.getId(), user);
        }
        for (IdleItem i : list) {
            i.setUser(map.get(i.getUserId()));
        }
    }
}
