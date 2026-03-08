package com.chengrui.st.controller;

import com.chengrui.st.entity.Message;
import com.chengrui.st.enums.ErrorMsg;
import com.chengrui.st.service.MessageService;
import com.chengrui.st.vo.R;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

@CrossOrigin
@RestController
@RequestMapping("/message")
public class MessageController {

    @Resource
    private MessageService messageService;

    @PostMapping("/send")
    public R sendMessage(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId,
            @RequestBody Message message
    ) {
        if (message == null || message.getIdleId() == null || message.getContent() == null || message.getContent().trim().isEmpty()) {
            return R.fail(ErrorMsg.PARAM_ERROR);
        }

        message.setUserId(Long.valueOf(shUserId));
        message.setCreateTime(new Date());
        message.setContent(message.getContent().trim());

        if (messageService.addMessage(message)) {
            return R.success(message);
        }
        return new R<>(0, "Message send failed", null);
    }

    @GetMapping("/info")
    public R getMessage(@RequestParam Long id) {
        return R.success(messageService.getMessage(id));
    }

    @GetMapping("/idle")
    public R getAllIdleMessage(@RequestParam Long idleId) {
        return R.success(messageService.getAllIdleMessage(idleId));
    }

    @GetMapping("/my")
    public R getAllMyMessage(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId
    ) {
        return R.success(messageService.getAllMyMessage(Long.valueOf(shUserId)));
    }

    @GetMapping("/delete")
    public R deleteMessage(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again") String shUserId,
            @RequestParam Long id
    ) {
        Message message = messageService.getMessage(id);
        Long userId = Long.valueOf(shUserId);
        if (message == null || (!userId.equals(message.getUserId()) && !userId.equals(message.getToUser()))) {
            return R.fail(ErrorMsg.SYSTEM_ERROR);
        }
        if (messageService.deleteMessage(id)) {
            return R.success();
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }
}
