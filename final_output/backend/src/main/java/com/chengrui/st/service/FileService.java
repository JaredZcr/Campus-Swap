package com.chengrui.st.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {

    
    boolean uploadFile(MultipartFile multipartFile, String fileName) throws IOException;
}
