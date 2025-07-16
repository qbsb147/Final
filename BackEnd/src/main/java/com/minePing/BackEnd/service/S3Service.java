package com.minePing.BackEnd.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.net.URL;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.cloudfront.domain}")
    private String cloudFrontDomain;



    public String uploadFile(MultipartFile file) {
        // 파일 검증
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }

        // 파일 크기 검증 (10MB 제한)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("파일 크기는 10MB를 초과할 수 없습니다.");
        }

        // 허용된 이미지 타입 검증
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드 가능합니다.");
        }

        // 파일 확장자 검증
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("파일명이 없습니다.");
        }
        
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        String[] allowedExtensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"};
        boolean isValidExtension = false;
        for (String allowedExt : allowedExtensions) {
            if (extension.equals(allowedExt)) {
                isValidExtension = true;
                break;
            }
        }
        if (!isValidExtension) {
            throw new IllegalArgumentException("허용되지 않는 파일 형식입니다. (jpg, jpeg, png, gif, webp만 가능)");
        }

        try {
            // 파일명 생성 (원본 확장자 유지)
            String fileName = UUID.randomUUID().toString() + extension;

            // 메타데이터 설정
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            // S3에 업로드
            amazonS3.putObject(new PutObjectRequest(
                bucketName, 
                "images/" + fileName, 
                file.getInputStream(), 
                metadata
            ));

            // CloudFront URL 반환
            return String.format("https://%s/images/%s", cloudFrontDomain, fileName);

        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String imageUrl) {
        try {
            // CloudFront URL에서 파일명 추출
            String fileName = extractFileNameFromUrl(imageUrl);
            
            if (fileName != null) {
                // S3에서 파일 삭제
                amazonS3.deleteObject(new DeleteObjectRequest(bucketName, "images/" + fileName));
            }
        } catch (Exception e) {
            throw new RuntimeException("파일 삭제 실패: " + e.getMessage(), e);
        }
    }

    private String extractFileNameFromUrl(String imageUrl) {
        try {
            // CloudFront URL에서 파일명 추출
            // 예: https://cloudfront-domain.com/images/filename.jpg
            String[] parts = imageUrl.split("/");
            return parts[parts.length - 1];
        } catch (Exception e) {
            return null;
        }
    }


    public String uploadFromUrl(String imageUrl, String keyName) {
        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("image/png"); // 또는 image/jpeg 등 필요시 확장자에 따라 분기 가능

            amazonS3.putObject(new PutObjectRequest(
                    bucketName,
                    keyName,
                    inputStream,
                    metadata
            ));

            return String.format("https://%s/%s", cloudFrontDomain, keyName);

        } catch (Exception e) {
            throw new RuntimeException("AI 이미지 URL 업로드 실패: " + e.getMessage(), e);
        }
    }
} 