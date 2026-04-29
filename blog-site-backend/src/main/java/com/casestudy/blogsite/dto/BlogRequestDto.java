package com.casestudy.blogsite.dto;

import lombok.Data;

@Data
public class BlogRequestDto {
    private String blogname;
    private String category;
    private String article;
    private String authorName;
}
