package com.chengrui.st.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class Favorite implements Serializable {

    private static final long serialVersionUID = 1L;

    
    private Long id;

    
    private Date createTime;

    
    private Long userId;

    
    private Long idleId;

    private IdleItem idleItem;
}
