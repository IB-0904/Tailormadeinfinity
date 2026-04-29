package com.casestudy.blogsite.service;

import com.casestudy.blogsite.dto.BlogRequestDto;
import com.casestudy.blogsite.model.Blog;
import com.casestudy.blogsite.model.User;
import com.casestudy.blogsite.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BlogService {

    @Autowired
    private BlogRepository blogRepository;

    public Blog addBlog(BlogRequestDto blogRequestDto, User user) {
        Blog blog = new Blog();
        blog.setBlogname(blogRequestDto.getBlogname());
        blog.setCategory(blogRequestDto.getCategory());
        blog.setArticle(blogRequestDto.getArticle());
        blog.setAuthorName(blogRequestDto.getAuthorName());
        blog.setUser(user);
        return blogRepository.save(blog);
    }

    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    public List<Blog> getBlogsByUserId(Long userId) {
        return blogRepository.findByUserId(userId);
    }

    public Optional<Blog> getBlogById(Long id) {
        return blogRepository.findById(id);
    }

    public void deleteBlogById(Long id) {
        blogRepository.deleteById(id);
    }

    public void deleteBlogByBlogname(String blogname) {
        Optional<Blog> blog = blogRepository.findByBlogname(blogname);
        blog.ifPresent(b -> blogRepository.delete(b));
    }

    public List<Blog> searchBlogs(String category, String duration) {
        LocalDateTime startDate;
        LocalDateTime now = LocalDateTime.now();

        switch (duration.toLowerCase()) {
            case "last 7 days":
                startDate = now.minusDays(7);
                break;
            case "last 30 days":
                startDate = now.minusDays(30);
                break;
            case "last 1 year":
                startDate = now.minusYears(1);
                break;
            default:
                // If duration is all or unrecognized, return all by category
                return blogRepository.findAll().stream()
                        .filter(b -> b.getCategory().equalsIgnoreCase(category))
                        .toList();
        }

        return blogRepository.findByCategoryAndTimestampAfter(category, startDate);
    }
}
