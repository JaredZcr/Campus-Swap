package com.chengrui.st.service;

import com.chengrui.st.entity.Address;

import java.util.List;

public interface AddressService {

    
    List<Address> getAddressByUser(Long userId);

    
    Address getAddressById(Long id, Long userId);

    
    boolean addAddress(Address address);

    
    boolean updateAddress(Address address);

    
    boolean deleteAddress(Address address);
}
