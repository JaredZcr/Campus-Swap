package com.chengrui.st.service.impl;

import com.chengrui.st.entity.Address;
import com.chengrui.st.mapper.AddressMapper;
import com.chengrui.st.service.AddressService;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {

    @Resource
    private AddressMapper addressMapper;

    public List<Address> getAddressByUser(Long userId){
        return addressMapper.getAddressByUser(userId);
    }

    public Address getAddressById(Long id, Long userId){
        Address address = addressMapper.selectByPrimaryKey(id);
        if(address == null){
            return null;
        }
        if(userId.equals(address.getUserId())){
            return address;
        }
        return null;
    }

    public boolean addAddress(Address address){
        if(Boolean.TRUE.equals(address.getDefaultFlag())){
            Address a = new Address();
            a.setDefaultFlag(false);
            a.setUserId(address.getUserId());
            addressMapper.updateByUserIdSelective(a);
        } else {
            List<Address> list = addressMapper.getDefaultAddress(address.getUserId());
            if(list == null || list.isEmpty()){
                address.setDefaultFlag(true);
            }
        }
        return addressMapper.insert(address) == 1;
    }

    public boolean updateAddress(Address address){
        Address current = addressMapper.selectByPrimaryKey(address.getId());
        if (current == null || !address.getUserId().equals(current.getUserId())) {
            return false;
        }

        if (Boolean.TRUE.equals(address.getDefaultFlag())) {
            Address a = new Address();
            a.setDefaultFlag(false);
            a.setUserId(address.getUserId());
            addressMapper.updateByUserIdSelective(a);
        } else if (Boolean.TRUE.equals(current.getDefaultFlag())) {
            List<Address> list = addressMapper.getAddressByUser(address.getUserId());
            for (Address a : list) {
                if (!a.getId().equals(address.getId())) {
                    Address replacement = new Address();
                    replacement.setId(a.getId());
                    replacement.setDefaultFlag(true);
                    addressMapper.updateByPrimaryKeySelective(replacement);
                    break;
                }
            }
        }
        return addressMapper.updateByPrimaryKeySelective(address) == 1;
    }

    public boolean deleteAddress(Address address){
        Address current = addressMapper.selectByPrimaryKey(address.getId());
        if (current == null || !address.getUserId().equals(current.getUserId())) {
            return false;
        }
        boolean wasDefault = Boolean.TRUE.equals(current.getDefaultFlag());
        boolean deleted = addressMapper.deleteByPrimaryKeyAndUser(address.getId(), address.getUserId()) == 1;
        if (deleted && wasDefault) {
            List<Address> remain = addressMapper.getAddressByUser(address.getUserId());
            if (remain != null && !remain.isEmpty()) {
                Address replacement = new Address();
                replacement.setId(remain.get(0).getId());
                replacement.setDefaultFlag(true);
                addressMapper.updateByPrimaryKeySelective(replacement);
            }
        }
        return deleted;
    }
}
