package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final S3Service s3Service;

    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated() and hasRole('WORCATION')")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = s3Service.uploadFile(file);
            이이
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            response.put("message", "파일 업로드 성공");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/upload-multiple")
    @PreAuthorize("isAuthenticated() and hasRole('WORCATION')")
    public ResponseEntity<Map<String, Object>> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        try {
            Map<String, Object> response = new HashMap<>();
            String[] imageUrls = new String[files.length];
            
            for (int i = 0; i < files.length; i++) {
                imageUrls[i] = s3Service.uploadFile(files[i]);
            }
            
            response.put("imageUrls", imageUrls);
            response.put("message", "파일 업로드 성공");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/delete")
    @PreAuthorize("isAuthenticated() and hasRole('WORCATION')")
    public ResponseEntity<Map<String, String>> deleteFile(@RequestParam("imageUrl") String imageUrl) {
        try {
            s3Service.deleteFile(imageUrl);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "파일 삭제 성공");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
} 