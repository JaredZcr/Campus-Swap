package com.chengrui.st.service;

import com.chengrui.st.entity.StoredFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {

    StoredFile uploadFile(MultipartFile multipartFile, String fileName) throws IOException;

    StoredFile getFileById(Long id);

    StoredFile getFileByName(String fileName);
}
