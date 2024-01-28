package com.example.portfoliotracker.controller;

import com.example.portfoliotracker.dto.UserDto;
import com.example.portfoliotracker.exception.ErrorResponse;
import com.example.portfoliotracker.model.User;
import com.example.portfoliotracker.repository.UserRepository;
import com.example.portfoliotracker.security.JWTGenerator;
import com.example.portfoliotracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JWTGenerator jwtGenerator;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository, AuthenticationManager authenticationManager,
                           JWTGenerator jwtGenerator) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.findAllUsers().stream()
                .map(user -> new UserDto(user.getId(), user.getUsername(), null))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.findUserById(id)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(new UserDto(user.getId(), user.getUsername(), null)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(
                        "NOT_FOUND",
                        "User not found",
                        Collections.singletonList("User with ID " + id + " does not exist.")
                )));
    }




    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody UserDto userDto) {
        if (userService.existsByUsername(userDto.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("BAD_REQUEST", "Username already taken.", List.of("The username '" + userDto.getUsername() + "' is already in use. Please choose a different username.")));
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        userService.saveUser(user);

        String token = jwtGenerator.generateToken(new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword()));

        UserDto newUserDto = new UserDto(user.getId(), user.getUsername(), token);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUserDto);
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword()));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwtToken = jwtGenerator.generateToken(authentication);
            User user;
            try {
                user = userRepository.findByUsername(userDto.getUsername());
            } catch (Exception ex) {
                // If user is not found, throw UsernameNotFoundException.
                throw new UsernameNotFoundException("User not found");
            }
            UserDto loginUserDto = new UserDto(user.getId(), userDetails.getUsername(), jwtToken);
            return ResponseEntity.ok(loginUserDto);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(
                    "UNAUTHORIZED",
                    "Invalid username or password.",
                    Collections.singletonList("The username or password you entered is incorrect.")
            ));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userService.findUserById(id)
                .map(user -> {
                    userService.deleteUser(id);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}