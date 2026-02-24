package com.chengrui.st.entity;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class IdleItem implements Serializable {

    private static final long serialVersionUID = 1L;

    
    private Long id;

    
    private String idleName;

    
    private String idleDetails;

    
    private String pictureList;

    
    private BigDecimal idlePrice;

    
    private String idlePlace;

    
    private Integer idleLabel;

    
    private Date releaseTime;

    
    private Byte idleStatus;

    
    private Long userId;

    private User user;
}
