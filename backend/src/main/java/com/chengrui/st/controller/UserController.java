package com.chengrui.st.controller;

import com.chengrui.st.entity.User;
import com.chengrui.st.enums.ErrorMsg;
import com.chengrui.st.service.UserService;
import com.chengrui.st.vo.R;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.sql.Timestamp;

@CrossOrigin
@RestController
@RequestMapping("user")
public class UserController {

    @Resource
    private UserService userService;

    @PostMapping("sign-in")
    public R signIn(@RequestBody User user) {
        user.setSignInTime(new Timestamp(System.currentTimeMillis()));
        if (user.getAvatar() == null || "".equals(user.getAvatar())) {
            user.setAvatar("https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png");
        }
        if (userService.userSignIn(user)) {
            return R.success(user);
        }
        return R.fail(ErrorMsg.REGISTER_ERROR);
    }

    @RequestMapping("login")
    public R login(
            @RequestParam("accountNumber") @NotEmpty @NotNull String accountNumber,
            @RequestParam("userPassword") @NotEmpty @NotNull String userPassword,
            HttpServletResponse response
    ) {
        User user = userService.userLogin(accountNumber, userPassword);
        if (null == user) {
            return R.fail(ErrorMsg.EMAIL_LOGIN_ERROR);
        }
        if (user.getUserStatus() != null && user.getUserStatus().equals((byte) 1)) {
            return R.fail(ErrorMsg.ACCOUNT_Ban);
        }
        Cookie cookie = new Cookie("shUserId", String.valueOf(user.getId()));
        cookie.setPath("/");
        cookie.setHttpOnly(false);
        response.addCookie(cookie);
        return R.success(user);
    }

    @RequestMapping("logout")
    public R logout(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId, HttpServletResponse response
    ) {
        Cookie cookie = new Cookie("shUserId", shUserId);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        response.addCookie(cookie);
        return R.success();
    }

    @GetMapping("info")
    public R getOneUser(
            @CookieValue("shUserId") @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again")
            String id
    ) {
        return R.success(userService.getUser(Long.valueOf(id)));
    }

    @PostMapping("/info")
    public R updateUserPublicInfo(@CookieValue("shUserId") @NotNull(message = "Login anomaly. Please log in again")
                                  @NotEmpty(message = "Login anomaly. Please log in again")
                                  String id, @RequestBody User user) {
        user.setId(Long.valueOf(id));
        if (userService.updateUserInfo(user)) {
            return R.success();
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

    @GetMapping("/password")
    public R updateUserPassword(
            @CookieValue("shUserId") @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String id,
            @RequestParam("oldPassword") @NotEmpty @NotNull String oldPassword,
            @RequestParam("newPassword") @NotEmpty @NotNull String newPassword) {
        if (userService.updatePassword(newPassword, oldPassword, Long.valueOf(id))
        ) {
            return R.success();
        }
        return R.fail(ErrorMsg.PASSWORD_RESET_ERROR);
    }
}
