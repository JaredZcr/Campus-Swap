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
        message.setUserId(Long.valueOf(shUserId));
        message.setCreateTime(new Date());
        if (messageService.addMessage(message)) {
            return R.success(message);
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
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
            @NotNull(message = "Login anomaly. Please log in again")
            @RequestParam Long id
    ) {
        if (messageService.deleteMessage(id)) {
            return R.success();
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }
}
