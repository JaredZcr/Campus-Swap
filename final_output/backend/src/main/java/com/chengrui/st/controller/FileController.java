package com.chengrui.st.controller;

import com.chengrui.st.enums.ErrorMsg;
import com.chengrui.st.service.FileService;
import com.chengrui.st.utils.IdFactoryUtil;
import com.chengrui.st.vo.R;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

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
        String uuid = "file" + IdFactoryUtil.getFileId();
        String fileName = uuid + multipartFile.getOriginalFilename();
        try {
            if (fileService.uploadFile(multipartFile, fileName)) {
                return R.success(baseUrl + "/image?imageName=" + fileName);
            }
        } catch (IOException e) {
            return R.fail(ErrorMsg.SYSTEM_ERROR);
        }
        return R.fail(ErrorMsg.FILE_UPLOAD_ERROR);
    }

    @GetMapping("/image")
    public void getImage(
            @RequestParam("imageName") String imageName,
            HttpServletResponse response
    ) throws IOException {
        File fileDir = new File(userFilePath);
        File image = new File(fileDir.getAbsolutePath() + "/" + imageName);
        if (!image.exists() || !image.isFile()) {
            response.setStatus(404);
            return;
        }

        // Basic content-type detection so the browser can render the image.
        String lower = imageName.toLowerCase();
        if (lower.endsWith(".png")) {
            response.setContentType("image/png");
        } else if (lower.endsWith(".gif")) {
            response.setContentType("image/gif");
        } else if (lower.endsWith(".webp")) {
            response.setContentType("image/webp");
        } else {
            response.setContentType("image/jpeg");
        }
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);

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

}
