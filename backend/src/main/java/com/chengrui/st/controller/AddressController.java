package com.chengrui.st.controller;

import com.chengrui.st.entity.Address;
import com.chengrui.st.enums.ErrorMsg;
import com.chengrui.st.service.AddressService;
import com.chengrui.st.vo.R;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@CrossOrigin
@RestController
@RequestMapping("/address")
public class AddressController {

    @Resource
    private AddressService addressService;

    @GetMapping("/info")
    public R getAddress(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId,
            @RequestParam(value = "id", required = false) Long id
    ) {
        if (null == id) {
            return R.success(addressService.getAddressByUser(Long.valueOf(shUserId)));
        } else {
            return R.success(addressService.getAddressById(id, Long.valueOf(shUserId)));
        }
    }
    @PostMapping("/add")
    public R addAddress(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId,
            @RequestBody Address address
    ) {
        address.setUserId(Long.valueOf(shUserId));
        if (addressService.addAddress(address)) {
            return R.success(address);
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

    @PostMapping("/update")
    public R updateAddress(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId,
            @RequestBody Address address
    ) {
        address.setUserId(Long.valueOf(shUserId));
        if (addressService.updateAddress(address)) {
            return R.success();
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

    @PostMapping("/delete")
    public R deleteAddress(
            @CookieValue("shUserId")
            @NotNull(message = "Login anomaly. Please log in again")
            @NotEmpty(message = "Login anomaly. Please log in again") String shUserId,
            @RequestBody Address address
    ) {
        address.setUserId(Long.valueOf(shUserId));
        if (addressService.deleteAddress(address)) {
            return R.success();
        }
        return R.fail(ErrorMsg.SYSTEM_ERROR);
    }

}
