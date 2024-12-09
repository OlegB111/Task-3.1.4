package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.DTO.UserUpdateDTO;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@Validated
@RequestMapping("api/admins")
public class AdminControllerREST {

    private final UserService userService;

    @Autowired
    public AdminControllerREST(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> showUsers() {
        List<User> userList = new ArrayList<>();

        for (User user : userService.getAllUsers()) {
            userList.add(user);
        }
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> showUser(@PathVariable("id") int id) {
        return new ResponseEntity<>(userService.getById(id), HttpStatus.OK);
    }

    @GetMapping("/userAuth")
    public ResponseEntity<User> showAuthUser() {
        return new ResponseEntity<>(userService.getCurrentUser(), HttpStatus.OK);
    }

    @PostMapping("/newAddUser")
    public ResponseEntity<HttpStatus> saveNewUser(@Valid @RequestBody User user, BindingResult bindingResult) throws MethodArgumentNotValidException, NoSuchMethodException {
        if (userService.getByUsername(user.getEmail()).isPresent()) {
            bindingResult.addError(new FieldError("user", "Email address", "Пользователь с таким email уже существует"));
        }

        if (bindingResult.hasErrors()) {
            MethodParameter methodParameter = new MethodParameter(
                    this.getClass().getMethod("saveNewUser", User.class, BindingResult.class),
                    0);

            throw new MethodArgumentNotValidException(methodParameter, bindingResult);
        }

        userService.add(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") int id) {
        userService.delete(id);
        return new ResponseEntity<> (HttpStatus.OK);
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<HttpStatus> userSaveEdit(@Valid @RequestBody UserUpdateDTO userDTO, @PathVariable Integer id) {
        userService.update(userDTO, id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
