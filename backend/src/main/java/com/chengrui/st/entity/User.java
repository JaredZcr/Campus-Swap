package com.chengrui.st.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    
    private Long id;

    
    private String accountNumber;

    
    private String userPassword;

    
    private String nickname;

    
    private String avatar;

    
    private Date signInTime;

    private Byte userStatus;

}
