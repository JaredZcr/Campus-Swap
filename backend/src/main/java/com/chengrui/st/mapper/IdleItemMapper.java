package com.chengrui.st.mapper;

import com.chengrui.st.entity.IdleItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IdleItemMapper {
    int deleteByPrimaryKey(Long id);

    int insert(IdleItem record);

    int insertSelective(IdleItem record);

    IdleItem selectByPrimaryKey(Long id);

    List<IdleItem> getAllIdleItem(Long userId);

    int countIdleItem(@Param("findValue") String findValue);

    int countIdleItemByLable(@Param("idleLabel") int idleLabel, @Param("findValue") String findValue);

    int countIdleItemByStatus(@Param("status") int status);

    List<IdleItem> findIdleItem(@Param("findValue") String findValue, @Param("begin") int begin, @Param("nums") int nums);

    List<IdleItem> findIdleItemByLable(@Param("idleLabel") int idleLabel, @Param("findValue") String findValue, @Param("begin") int begin, @Param("nums") int nums);

    List<IdleItem> getIdleItemByStatus(@Param("status") int status, @Param("begin") int begin, @Param("nums") int nums);

    int updateByPrimaryKeySelective(IdleItem record);

    int updateByPrimaryKey(IdleItem record);

    List<IdleItem> findIdleByList(@Param("idList") List<Long> idList);
}
