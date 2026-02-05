package com.minePing.BackEnd.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Configuration
public class WorkerConfig {
    @Bean
    public String workerId() {
        int random = ThreadLocalRandom.current().nextInt(0, 32*32*32);
        return Integer.toString(random, 32);
    }
}
