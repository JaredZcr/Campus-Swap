package com.chengrui.st.service;

import com.chengrui.st.entity.Admin;
import com.chengrui.st.vo.PageVo;

public interface AdminService {

    
    Admin login(String accountNumber, String adminPassword);

    
    PageVo<Admin> getAdminList(int page, int nums);

    
    boolean addAdmin(Admin admin);

}
