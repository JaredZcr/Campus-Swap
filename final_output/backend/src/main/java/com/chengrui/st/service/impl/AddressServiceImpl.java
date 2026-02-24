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
        if(userId.equals(address.getUserId())){
            return address;
        }
        return null;
    }

    public boolean addAddress(Address address){
        if(address.getDefaultFlag()){
            Address a=new Address();
            a.setDefaultFlag(false);
            a.setUserId(address.getUserId());
            
            addressMapper.updateByUserIdSelective(a);
        }else {
            
            List<Address> list= addressMapper.getDefaultAddress(address.getUserId());
            
            if(null==list||0==list.size()){
                address.setDefaultFlag(true);
            }
        }
        return addressMapper.insert(address)==1;
    }

    public boolean updateAddress(Address address){
        if(address.getDefaultFlag()){
            
            Address a=new Address();
            a.setDefaultFlag(false);
            a.setUserId(address.getUserId());
            addressMapper.updateByUserIdSelective(a);
        }else{
            
            List<Address> list= addressMapper.getAddressByUser(address.getUserId());
            for(Address a:list){
                if(a.getDefaultFlag()&& a.getId().equals(address.getId())){
                    Address a1=new Address();
                    a1.setId(list.get(0).getId());
                    a1.setDefaultFlag(true);
                    return addressMapper.updateByPrimaryKeySelective(address)==1&&
                            addressMapper.updateByPrimaryKeySelective(a1)==1;
                }
            }
        }
        return addressMapper.updateByPrimaryKeySelective(address)==1;
    }

    public boolean deleteAddress(Address address){
        return addressMapper.deleteByPrimaryKeyAndUser(address.getId(), address.getUserId())==1;
    }
}
