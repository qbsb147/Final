package com.minePing.BackEnd.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.beans.factory.annotation.Value;
import java.util.Properties;

@Configuration
@ConditionalOnProperty(name = "mail.host")
public class MailConfig {
    @Bean
    public JavaMailSender javaMailSender(
            @Value("${mail.host}") String host,
            @Value("${mail.port}") int port,
            @Value("${mail.username}") String username,
            @Value("${mail.password}") String password
    ) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.timeout", "5000");
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.writetimeout", "5000");
        mailSender.setDefaultEncoding("UTF-8");

        return mailSender;
    }
}
