package com.chengrui.st.service;

import com.chengrui.st.entity.IdleItem;
import com.chengrui.st.vo.PageVo;

import java.util.List;

public interface IdleItemService {

    
    boolean addIdleItem(IdleItem idleItem);

    
    IdleItem getIdleItem(Long id);

    
    List<IdleItem> getAllIdelItem(Long userId);

    
    PageVo<IdleItem> findIdleItem(String findValue, int page, int nums);

    
    PageVo<IdleItem> findIdleItemByLable(int idleLabel, int page, int nums);

    
    boolean updateIdleItem(IdleItem idleItem);

    PageVo<IdleItem> adminGetIdleList(int status, int page, int nums);
}
