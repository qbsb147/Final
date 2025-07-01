package com.minePing.BackEnd.exception;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ConstraintExtractor {

    public static String extractConstraintName(String message) {
        Pattern pattern = Pattern.compile("for key '([^']+)'");
        Matcher matcher = pattern.matcher(message);

        if (matcher.find()) {
            return matcher.group(1); // 'member.uk_member_user_id'
        }

        return null; // 또는 "알 수 없음"
    }
}
