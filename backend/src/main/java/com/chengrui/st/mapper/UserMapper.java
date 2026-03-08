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

    List<User> findUserByList(@Param("idList") List<Long> idList);

    List<User> getNormalUser(@Param("begin") int begin, @Param("nums") int nums);

    List<User> getBanUser(@Param("begin") int begin, @Param("nums") int nums);

    int countNormalUser();

    int countBanUser();

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);

    int updatePassword(@Param("newPassword") String newPassword,
                       @Param("oldPassword") String oldPassword, @Param("id") Long id);
}
