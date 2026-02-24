package com.chengrui.st.mapper;

import com.chengrui.st.entity.Address;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AddressMapper {

    int deleteByPrimaryKeyAndUser(Long id,Long userId);

    int insert(Address record);

    int insertSelective(Address record);

    Address selectByPrimaryKey(Long id);

    List<Address> getAddressByUser(Long userId);

    List<Address> getDefaultAddress(Long userId);

    int updateByPrimaryKeySelective(Address record);

    int updateByUserIdSelective(Address record);

    int updateByPrimaryKey(Address record);

}
