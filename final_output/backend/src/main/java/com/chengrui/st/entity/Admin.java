package com.chengrui.st.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class Admin implements Serializable {

    private static final long serialVersionUID = 1L;

    
    private Long id;

    
    private String accountNumber;

    
    private String adminPassword;

    
    private String adminName;

}
