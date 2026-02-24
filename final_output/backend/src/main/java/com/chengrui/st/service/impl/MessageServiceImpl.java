package com.chengrui.st.service.impl;

import com.chengrui.st.entity.IdleItem;
import com.chengrui.st.entity.Message;
import com.chengrui.st.entity.User;
import com.chengrui.st.mapper.IdleItemMapper;
import com.chengrui.st.mapper.MessageMapper;
import com.chengrui.st.mapper.UserMapper;
import com.chengrui.st.service.MessageService;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MessageServiceImpl implements MessageService {

    @Resource
    private MessageMapper messageMapper;

    @Resource
    private UserMapper userMapper;

    @Resource
    private IdleItemMapper idleItemMapper;

    public boolean addMessage(Message message) {
        return messageMapper.insert(message) == 1;
    }

    public boolean deleteMessage(Long id) {
        return messageMapper.deleteByPrimaryKey(id) == 1;
    }

    public Message getMessage(Long id) {
        return messageMapper.selectByPrimaryKey(id);
    }

    public List<Message> getAllMyMessage(Long userId) {
        List<Message> list = messageMapper.getMyMessage(userId);
        if (list.size() > 0) {
            List<Long> idList = new ArrayList<>();
            for (Message i : list) {
                if (i.getUserId() != null) idList.add(i.getUserId());
                if (i.getToUser() != null) idList.add(i.getToUser());
            }
            List<User> userList = userMapper.findUserByList(idList);
            Map<Long, User> map = new HashMap<>();
            for (User user : userList) {
                map.put(user.getId(), user);
            }
            for (Message i : list) {
                i.setFromU(map.get(i.getUserId()));
                i.setToU(map.get(i.getToUser()));
            }

            List<Long> idleIdList = new ArrayList<>();
            for (Message i : list) {
                idleIdList.add(i.getIdleId());
            }
            List<IdleItem> idleList = idleItemMapper.findIdleByList(idleIdList);
            Map<Long, IdleItem> idleMap = new HashMap<>();
            for (IdleItem idle : idleList) {
                idleMap.put(idle.getId(), idle);
            }
            for (Message i : list) {
                i.setIdle(idleMap.get(i.getIdleId()));
            }

            // Attach replied-to message (if any)
            Map<Long, Message> mesMap = new HashMap<>();
            for (Message i : list) {
                mesMap.put(i.getId(), i);
            }
            for (Message i : list) {
                if (i.getToMessage() != null && mesMap.get(i.getToMessage()) != null) {
                    Message toM = new Message();
                    toM.setContent(mesMap.get(i.getToMessage()).getContent());
                    i.setToM(toM);
                }
            }
        }
        return list;
    }

    public List<Message> getAllIdleMessage(Long idleId) {
        List<Message> list = messageMapper.getIdleMessage(idleId);
        if (list.size() > 0) {
            List<Long> idList = new ArrayList<>();
            for (Message i : list) {
                if (i.getUserId() != null) idList.add(i.getUserId());
                if (i.getToUser() != null) idList.add(i.getToUser());
            }
            List<User> userList = userMapper.findUserByList(idList);
            Map<Long, User> map = new HashMap<>();
            for (User user : userList) {
                map.put(user.getId(), user);
            }
            for (Message i : list) {
                i.setFromU(map.get(i.getUserId()));
            }
            Map<Long, Message> mesMap = new HashMap<>();
            for (Message i : list) {
                mesMap.put(i.getId(), i);
            }
            for (Message i : list) {
                Message toM = new Message();
                if (i.getToMessage() != null && mesMap.get(i.getToMessage()) != null) {
                    toM.setContent(mesMap.get(i.getToMessage()).getContent());
                }
                i.setToM(toM);
                i.setToU(map.get(i.getToUser()));
            }
        }
        return list;
    }
}
