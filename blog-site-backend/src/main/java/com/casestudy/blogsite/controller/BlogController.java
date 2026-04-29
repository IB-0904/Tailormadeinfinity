package com.casestudy.blogsite.controller;

import com.casestudy.blogsite.dto.BlogRequestDto;
import com.casestudy.blogsite.model.Blog;
import com.casestudy.blogsite.model.User;
import com.casestudy.blogsite.service.BlogService;
import com.casestudy.blogsite.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1.0/blogsite/user/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @Autowired
    private UserService userService;

    private User getAuthenticatedUser(Authentication authentication) {
        return userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/add")
    public ResponseEntity<Blog> addBlog(@RequestBody BlogRequestDto blogRequestDto, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Blog blog = blogService.addBlog(blogRequestDto, user);
        return new ResponseEntity<>(blog, HttpStatus.CREATED);
    }

    @GetMapping("/getall")
    public ResponseEntity<List<Blog>> getAllBlogs() {
        return ResponseEntity.ok(blogService.getAllBlogs());
    }

    @GetMapping("/myblogs")
    public ResponseEntity<List<Blog>> getMyBlogs(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(blogService.getBlogsByUserId(user.getId()));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBlogById(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Blog blog = blogService.getBlogById(id).orElse(null);
        if (blog == null || !blog.getUser().getId().equals(user.getId())) {
            return new ResponseEntity<>(java.util.Map.of("message", "Blog not found or unauthorized"), HttpStatus.FORBIDDEN);
        }
        blogService.deleteBlogById(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Blog deleted successfully"));
    }

    @DeleteMapping("/delete/blogname/{blogname}")
    public ResponseEntity<?> deleteBlogByBlogname(@PathVariable String blogname, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<Blog> userBlogs = blogService.getBlogsByUserId(user.getId());
        boolean hasBlog = userBlogs.stream().anyMatch(b -> b.getBlogname().equals(blogname));

        if (!hasBlog) {
            return new ResponseEntity<>(java.util.Map.of("message", "Blog not found or unauthorized"), HttpStatus.FORBIDDEN);
        }
        blogService.deleteBlogByBlogname(blogname);
        return ResponseEntity.ok(java.util.Map.of("message", "Blog deleted successfully"));
    }

    @GetMapping("/info/{category}/{duration}")
    public ResponseEntity<List<Blog>> searchBlogs(@PathVariable String category, @PathVariable String duration) {
        return ResponseEntity.ok(blogService.searchBlogs(category, duration));
    }
}
