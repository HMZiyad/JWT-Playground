package com.playground.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class PlaygroundController {

    @GetMapping("/slide")
    public Map<String, String> goDownTheSlide() {
        return Map.of("message", "Yay! You are playing on the big slide!");
    }

    @GetMapping("/sandbox")
    public Map<String, String> digInTheSandbox() {
        return Map.of("message", "You are digging in the sandbox!");
    }
}
