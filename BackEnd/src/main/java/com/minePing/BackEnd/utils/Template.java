package com.minePing.BackEnd.utils;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

public class Template {
    public static String saveFile(MultipartFile file, HttpSession session, String path){
        //파일 원본명
        String originName = file.getOriginalFilename();

        //확장자
        String ext = originName.substring(originName.lastIndexOf("."));

        String changeName;
        if(originName.length() >= 10){
            changeName = originName.substring(0,10) + UUID.randomUUID() + ext;
        }else{
            changeName = originName.substring(0,originName.lastIndexOf(".")) + UUID.randomUUID() + ext;
        }

        //첨부파일을 저장할 폴더의 물리적 경로
        String savePath = session.getServletContext().getRealPath(path);

        try {
            file.transferTo(new File(savePath + changeName));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return changeName;
    }
}
