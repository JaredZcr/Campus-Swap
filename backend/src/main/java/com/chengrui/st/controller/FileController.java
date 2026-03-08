package com.chengrui.st.controller;

import com.chengrui.st.entity.StoredFile;
import com.chengrui.st.enums.ErrorMsg;
import com.chengrui.st.service.FileService;
import com.chengrui.st.utils.IdFactoryUtil;
import com.chengrui.st.vo.R;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;

@CrossOrigin
@RestController
public class FileController {

    @Value("${app.upload-dir:uploads}")
    private String userFilePath;

    @Value("${baseUrl}")
    private String baseUrl;

    @Resource
    private FileService fileService;

    @PostMapping("/file")
    public R uploadFile(@RequestParam("file") MultipartFile multipartFile) {
        String originalName = multipartFile.getOriginalFilename();
        if (originalName == null || originalName.trim().isEmpty()) {
            originalName = ".bin";
        }
        String uuid = "file" + IdFactoryUtil.getFileId();
        String fileName = uuid + originalName;
        try {
            StoredFile storedFile = fileService.uploadFile(multipartFile, fileName);
            if (storedFile != null && storedFile.getId() != null) {
                return R.success(baseUrl + "/image/" + storedFile.getId());
            }
        } catch (IOException e) {
            return R.fail(ErrorMsg.SYSTEM_ERROR);
        }
        return R.fail(ErrorMsg.FILE_UPLOAD_ERROR);
    }

    @GetMapping("/image/{id}")
    public void getImageById(
            @PathVariable("id") Long id,
            HttpServletResponse response
    ) throws IOException {
        StoredFile storedFile = fileService.getFileById(id);
        if (storedFile == null || storedFile.getFileData() == null) {
            response.setStatus(404);
            return;
        }
        writeImageResponse(response, storedFile.getContentType(), storedFile.getFileData());
    }

    @GetMapping("/image")
    public void getImage(
            @RequestParam("imageName") String imageName,
            HttpServletResponse response
    ) throws IOException {
        StoredFile storedFile = fileService.getFileByName(imageName);
        if (storedFile != null && storedFile.getFileData() != null) {
            writeImageResponse(response, storedFile.getContentType(), storedFile.getFileData());
            return;
        }

        File fileDir = new File(userFilePath);
        if (!fileDir.isAbsolute()) {
            fileDir = new File(System.getProperty("user.dir"), userFilePath);
        }
        File image = new File(fileDir.getAbsolutePath() + "/" + imageName);
        if (!image.exists() || !image.isFile()) {
            response.setStatus(404);
            return;
        }

        response.setContentType(Files.probeContentType(image.toPath()));
        setNoCache(response);
        try (FileInputStream fileInputStream = new FileInputStream(image);
             OutputStream outputStream = response.getOutputStream()) {
            byte[] buffer = new byte[8192];
            int read;
            while ((read = fileInputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, read);
            }
            outputStream.flush();
        }
    }

    private void writeImageResponse(HttpServletResponse response, String contentType, byte[] data) throws IOException {
        response.setContentType((contentType == null || contentType.isBlank()) ? "application/octet-stream" : contentType);
        setNoCache(response);
        try (OutputStream outputStream = response.getOutputStream()) {
            outputStream.write(data);
            outputStream.flush();
        }
    }

    private void setNoCache(HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);
    }
}
