package com.chengrui.st.controller;

import com.chengrui.st.entity.IdleItem;
import com.chengrui.st.enums.ErrorMsg;
import com.chengrui.st.service.IdleItemService;
import com.chengrui.st.vo.R;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

@CrossOrigin
@RestController
@RequestMapping("idle")
public class IdleItemController {

    @Resource
    private IdleItemService idleItemService;

    @PostMapping("add")
    public R addIdleItem(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId,
            @RequestBody IdleItem idleItem
    ) {
        idleItem.setUserId(Long.valueOf(shUserId));
        idleItem.setIdleStatus((byte) 1);
        idleItem.setReleaseTime(new Date());
        if (idleItemService.addIdleItem(idleItem)) {
            return R.success(idleItem);
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

    @GetMapping("info")
    public R getIdleItem(@RequestParam Long id) {
        return R.success(idleItemService.getIdleItem(id));
    }

    @GetMapping("all")
    public R getAllIdleItem(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId
    ) {
        return R.success(idleItemService.getAllIdelItem(Long.valueOf(shUserId)));
    }

    @GetMapping("find")
    public R findIdleItem(
            @RequestParam(value = "findValue", required = false) String findValue,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "nums", required = false) Integer nums
    ) {
        if (null == findValue) {
            findValue = "";
        }
        int p = 1;
        int n = 8;
        if (null != page) {
            p = page > 0 ? page : 1;
        }
        if (null != nums) {
            n = nums > 0 ? nums : 8;
        }
        return R.success(idleItemService.findIdleItem(findValue, p, n));
    }

    @GetMapping("lable")
    public R findIdleItemByLable(
            @RequestParam(value = "idleLabel") Integer idleLabel,
            @RequestParam(value = "findValue", required = false) String findValue,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "nums", required = false) Integer nums
    ) {
        if (findValue == null) {
            findValue = "";
        }
        int p = 1;
        int n = 8;
        if (null != page) {
            p = page > 0 ? page : 1;
        }
        if (null != nums) {
            n = nums > 0 ? nums : 8;
        }
        return R.success(idleItemService.findIdleItemByLable(idleLabel, findValue, p, n));
    }

    @PostMapping("update")
    public R updateIdleItem(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId,
            @RequestBody IdleItem idleItem
    ) {
        idleItem.setUserId(Long.valueOf(shUserId));
        if (idleItemService.updateIdleItem(idleItem)) {
            return R.success();
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

}
