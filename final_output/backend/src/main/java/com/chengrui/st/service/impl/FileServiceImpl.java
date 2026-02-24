package com.chengrui.st.service.impl;

import com.chengrui.st.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class FileServiceImpl implements FileService {

    @Value("${app.upload-dir:uploads}")
    private String userFilePath;

    public boolean uploadFile(MultipartFile multipartFile, String fileName) throws IOException {
        File fileDir = new File(userFilePath);
        if (!fileDir.isAbsolute()) {
            fileDir = new File(System.getProperty("user.dir"), userFilePath);
        }
        if (!fileDir.exists()) {
            if (!fileDir.mkdirs()) {
                return false;
            }
        }
        File file = new File(fileDir, fileName);
        if (file.exists()) {
            if (!file.delete()) {
                return false;
            }
        }
        if (file.createNewFile()) {
            multipartFile.transferTo(file);
            return true;
        }
        return false;
    }
}
