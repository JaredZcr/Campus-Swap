package com.chengrui.st.mapper;

import com.chengrui.st.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {
    int deleteByPrimaryKey(Long id);

    int insert(User record);

    int insertSelective(User record);

    User userLogin(@Param("accountNumber") String accountNumber, @Param("userPassword") String userPassword);

    User selectByPrimaryKey(Long id);

    List<User> getUserList();

    List<User> findUserByList(List<Long> idList);

    List<User> getNormalUser(int begin, int nums);

    List<User> getBanUser(int begin, int nums);

    int countNormalUser();

    int countBanUser();

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);

    int updatePassword(@Param("newPassword") String newPassword,
                       @Param("oldPassword") String oldPassword, @Param("id") Long id);
}
