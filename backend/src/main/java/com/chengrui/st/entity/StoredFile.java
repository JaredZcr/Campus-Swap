package com.chengrui.st.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class StoredFile implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String fileName;

    private String contentType;

    private byte[] fileData;

    private Date createTime;
}
