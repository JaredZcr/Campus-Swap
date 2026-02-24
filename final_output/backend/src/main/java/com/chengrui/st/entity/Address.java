package com.chengrui.st.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class Address implements Serializable {

    private static final long serialVersionUID = 1L;

    
    private Long id;

    
    private String consigneeName;

    
    private String consigneePhone;

    
    private String provinceName;

    
    private String cityName;

    
    private String regionName;

    
    private String detailAddress;

    
    private Boolean defaultFlag;

    
    private Long userId;

}
