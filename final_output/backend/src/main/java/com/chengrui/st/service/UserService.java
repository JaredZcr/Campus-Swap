package com.chengrui.st.service;

import com.chengrui.st.entity.User;
import com.chengrui.st.vo.PageVo;

public interface UserService {

    
    User getUser(Long id);

    
    User userLogin(String accountNumber, String userPassword);

    
    boolean userSignIn(User user);

    
    boolean updateUserInfo(User user);

    
    boolean updatePassword(String newPassword, String oldPassword, Long id);

    PageVo<User> getUserByStatus(int status, int page, int nums);
}
