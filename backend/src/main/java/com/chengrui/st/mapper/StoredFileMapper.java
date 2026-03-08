package com.chengrui.st.mapper;

import com.chengrui.st.entity.StoredFile;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface StoredFileMapper {

    int insert(StoredFile record);

    StoredFile selectByPrimaryKey(Long id);

    StoredFile selectByFileName(@Param("fileName") String fileName);
}
