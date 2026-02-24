package com.chengrui.st.service.impl;

import com.chengrui.st.entity.Admin;
import com.chengrui.st.mapper.AdminMapper;
import com.chengrui.st.service.AdminService;
import com.chengrui.st.vo.PageVo;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Resource
    private AdminMapper adminMapper;

    public Admin login(String accountNumber, String adminPassword) {
        return adminMapper.login(accountNumber, adminPassword);
    }

    public PageVo<Admin> getAdminList(int page, int nums) {
        List<Admin> list = adminMapper.getList((page - 1) * nums, nums);
        int count = adminMapper.getCount();
        return new PageVo<>(list, count);
    }

    public boolean addAdmin(Admin admin) {
        return adminMapper.insert(admin) == 1;
    }
}
