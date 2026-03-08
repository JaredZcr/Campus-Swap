package com.chengrui.st.controller;

import com.chengrui.st.entity.Admin;
import com.chengrui.st.entity.IdleItem;
import com.chengrui.st.entity.User;
import com.chengrui.st.enums.ErrorMsg;
import com.chengrui.st.service.AdminService;
import com.chengrui.st.service.IdleItemService;
import com.chengrui.st.service.OrderService;
import com.chengrui.st.service.UserService;
import com.chengrui.st.vo.R;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@CrossOrigin
@RestController
@RequestMapping("admin")
public class AdminController {

    @Resource
    private AdminService adminService;

    @Resource
    private IdleItemService idleItemService;

    @Resource
    private OrderService orderService;

    @Resource
    private UserService userService;

    @GetMapping("login")
    public R login(
            @RequestParam("accountNumber") @NotNull @NotEmpty String accountNumber,
            @RequestParam("adminPassword") @NotNull @NotEmpty String adminPassword,
            HttpSession session
    ) {
        Admin admin = adminService.login(accountNumber, adminPassword);
        if (null == admin) {
            return R.fail(ErrorMsg.EMAIL_LOGIN_ERROR);
        }
        session.setAttribute("admin", admin);
        return R.success(admin);
    }

    @GetMapping("loginOut")
    public R loginOut(HttpSession session) {
        session.removeAttribute("admin");
        return R.success();
    }

    @GetMapping("list")
    public R getAdminList(
            HttpSession session,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "nums", required = false) Integer nums
    ) {
        if (session.getAttribute("admin") == null) {
            return R.fail(ErrorMsg.COOKIE_ERROR);
        }
        int p = 1;
        int n = 8;
        if (null != page) {
            p = page > 0 ? page : 1;
        }
        if (null != nums) {
            n = nums > 0 ? nums : 8;
        }
        return R.success(adminService.getAdminList(p, n));
    }

    @PostMapping("add")
    public R addAdmin(
            HttpSession session,
            @RequestBody Admin admin
    ) {
        if (session.getAttribute("admin") == null) {
            return R.fail(ErrorMsg.COOKIE_ERROR);
        }
        if (adminService.addAdmin(admin)) {
            return R.success();
        }
        return R.fail(ErrorMsg.PARAM_ERROR);
    }

    @GetMapping("idleList")
    public R idleList(
            HttpSession session,
            @RequestParam("status") @NotNull Integer status,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "nums", required = false) Integer nums
    ) {
        if (session.getAttribute("admin") == null) {
            return R.fail(ErrorMsg.COOKIE_ERROR);
        }
        int p = 1;
        int n = 8;
        if (null != page) {
            p = page > 0 ? page : 1;
        }
        if (null != nums) {
            n = nums > 0 ? nums : 8;
        }
        return R.success(idleItemService.adminGetIdleList(status, p, n));
    }

    @GetMapping("updateIdleStatus")
    public R updateIdleStatus(
            HttpSession session,
            @RequestParam("id") @NotNull Long id,
            @RequestParam("status") @NotNull Integer status
    ) {
        if (session.getAttribute("admin") == null) {
            return R.fail(ErrorMsg.COOKIE_ERROR);
        }
        IdleItem idleItem = new IdleItem();
        idleItem.setId(id);
        idleItem.setIdleStatus(status.byteValue());
        if (idleItemService.updateIdleItem(idleItem)) {
            return R.success();
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

    @GetMapping("orderList")
    public R orderList(
            HttpSession session,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "nums", required = false) Integer nums
    ) {
        if (session.getAttribute("admin") == null) {
            return R.fail(ErrorMsg.COOKIE_ERROR);
        }
        int p = 1;
        int n = 8;
        if (null != page) {
            p = page > 0 ? page : 1;
        }
        if (null != nums) {
            n = nums > 0 ? nums : 8;
        }
        return R.success(orderService.getAllOrder(p, n));
    }

    @GetMapping("deleteOrder")
    public R deleteOrder(
            HttpSession session,
            @RequestParam("id") @NotNull Long id
    ) {
        if (session.getAttribute("admin") == null) {
            return R.fail(ErrorMsg.COOKIE_ERROR);
        }
        if (orderService.deleteOrder(id)) {
            return R.success();
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

    @GetMapping("userList")
    public R userList(
            HttpSession session,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "nums", required = false) Integer nums,
            @RequestParam("status") @NotNull Integer status
    ) {
        if (session.getAttribute("admin") == null) {
            return R.fail(ErrorMsg.COOKIE_ERROR);
        }
        int p = 1;
        int n = 8;
        if (null != page) {
            p = page > 0 ? page : 1;
        }
        if (null != nums) {
            n = nums > 0 ? nums : 8;
        }
        return R.success(userService.getUserByStatus(status, p, n));
    }

    @GetMapping("updateUserStatus")
    public R updateUserStatus(
            HttpSession session,
            @RequestParam("id") @NotNull Long id,
            @RequestParam("status") @NotNull Integer status
    ) {
        if (session.getAttribute("admin") == null) {
            return R.fail(ErrorMsg.COOKIE_ERROR);
        }
        User user = new User();
        user.setId(id);
        user.setUserStatus(status.byteValue());
        if (userService.updateUserInfo(user)) {
            return R.success();
        }

        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

}
