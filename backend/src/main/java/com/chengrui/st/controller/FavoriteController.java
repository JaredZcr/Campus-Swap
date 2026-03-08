package com.chengrui.st.controller;

import com.chengrui.st.entity.Favorite;
import com.chengrui.st.enums.ErrorMsg;
import com.chengrui.st.service.FavoriteService;
import com.chengrui.st.vo.R;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

@CrossOrigin
@RestController
@RequestMapping("/favorite")
public class FavoriteController {

    @Resource
    private FavoriteService favoriteService;

    @PostMapping("/add")
    public R addFavorite(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId,
            @RequestBody Favorite favorite
    ) {
        favorite.setUserId(Long.valueOf(shUserId));
        favorite.setCreateTime(new Date());
        if (favoriteService.addFavorite(favorite)) {
            return R.success(favorite.getId());
        }
        return R.fail(ErrorMsg.FAVORITE_EXIT);
    }

    @GetMapping("/delete")
    public R deleteFavorite(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again") String shUserId,
            @RequestParam Long id
    ) {
        Favorite favorite = favoriteService.getFavorite(id);
        if (favorite == null || !favorite.getUserId().equals(Long.valueOf(shUserId))) {
            return R.fail(ErrorMsg.SYSTEM_ERROR);
        }
        if (favoriteService.deleteFavorite(id)) {
            return R.success();
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

    @GetMapping("/check")
    public R checkFavorite(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId,
            @RequestParam Long idleId
    ) {
        return R.success(favoriteService.isFavorite(Long.valueOf(shUserId), idleId));
    }

    @GetMapping("/my")
    public R getMyFavorite(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId
    ) {
        return R.success(favoriteService.getAllFavorite(Long.valueOf(shUserId)));
    }
}
