package com.chengrui.st.service;

import com.chengrui.st.entity.Favorite;

import java.util.List;

public interface FavoriteService {

    
    boolean addFavorite(Favorite favorite);

    
    boolean deleteFavorite(Long id);

    
    Integer isFavorite(Long userId, Long idleId);

    
    List<Favorite> getAllFavorite(Long userId);
}
