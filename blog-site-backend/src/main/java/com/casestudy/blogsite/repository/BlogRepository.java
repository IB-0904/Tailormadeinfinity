package com.casestudy.blogsite.repository;

import com.casestudy.blogsite.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findByUserId(Long userId);
    Optional<Blog> findByBlogname(String blogname);

    @Query("SELECT b FROM Blog b WHERE b.category = :category AND b.timestamp >= :startDate")
    List<Blog> findByCategoryAndTimestampAfter(@Param("category") String category, @Param("startDate") LocalDateTime startDate);
}
