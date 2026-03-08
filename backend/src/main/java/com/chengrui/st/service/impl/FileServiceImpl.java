package com.chengrui.st.service.impl;

import com.chengrui.st.entity.StoredFile;
import com.chengrui.st.mapper.StoredFileMapper;
import com.chengrui.st.service.FileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Resource;
import java.io.IOException;

@Service
public class FileServiceImpl implements FileService {

    @Resource
    private StoredFileMapper storedFileMapper;

    @Override
    public StoredFile uploadFile(MultipartFile multipartFile, String fileName) throws IOException {
        StoredFile storedFile = new StoredFile();
        storedFile.setFileName(fileName);
        storedFile.setContentType(multipartFile.getContentType());
        storedFile.setFileData(multipartFile.getBytes());
        if (storedFileMapper.insert(storedFile) == 1) {
            return storedFile;
        }
        return null;
    }

    @Override
    public StoredFile getFileById(Long id) {
        return storedFileMapper.selectByPrimaryKey(id);
    }

    @Override
    public StoredFile getFileByName(String fileName) {
        return storedFileMapper.selectByFileName(fileName);
    }
}
