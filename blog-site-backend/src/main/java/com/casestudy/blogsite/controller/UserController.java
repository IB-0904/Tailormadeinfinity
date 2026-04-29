package com.casestudy.blogsite.controller;

import com.casestudy.blogsite.dto.UserLoginDto;
import com.casestudy.blogsite.dto.UserRegistrationDto;
import com.casestudy.blogsite.model.User;
import com.casestudy.blogsite.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1.0/blogsite/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDto registrationDto) {
        try {
            User user = userService.registerUser(registrationDto);
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDto loginDto) {
        Optional<User> userOpt = userService.findByEmail(loginDto.getEmail());
        if (userOpt.isPresent() && passwordEncoder.matches(loginDto.getPassword(), userOpt.get().getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("user", userOpt.get());
            return ResponseEntity.ok(response);
        }
        Map<String, String> response = new HashMap<>();
        response.put("error", "Invalid email or password");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }
}
