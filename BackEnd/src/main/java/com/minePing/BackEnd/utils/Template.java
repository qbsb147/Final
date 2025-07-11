package com.minePing.BackEnd.utils;

import com.minePing.BackEnd.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class Template {
    
    private static S3Service s3Service;
    
    @Autowired
    public void setS3Service(S3Service s3Service) {
        Template.s3Service = s3Service;
    }
    
    public static String saveFile(MultipartFile file, String path) {
        if (s3Service == null) {
            throw new RuntimeException("S3Service가 초기화되지 않았습니다.");
        }
        
        try {
            // S3에 업로드하고 CloudFront URL 반환
            return s3Service.uploadFile(file);
        } catch (Exception e) {
            throw new RuntimeException("파일 업로드 실패: " + e.getMessage(), e);
        }
    }
    
    // 기존 메서드와의 호환성을 위한 오버로드
    public static String saveFile(MultipartFile file, Object session, String path) {
        return saveFile(file, path);
    }
}
