package com.blooddonorpakistan.app.utils;

import android.text.TextUtils;
import java.util.regex.Pattern;

/**
 * Input validation utilities for Blood Donor Pakistan.
 */
public class ValidationUtils {

    // Pakistani mobile number pattern: 03XX-XXXXXXX or +923XX-XXXXXXX or 00923XXXXXXXXX
    private static final Pattern PK_PHONE_PATTERN = Pattern.compile("^((\\+92)|(0092)|(0))?3[0-9]{9}$");

    public static boolean isValidName(String name) {
        return !TextUtils.isEmpty(name) && name.trim().length() >= 2 && name.trim().length() <= 80;
    }

    public static boolean isValidPhone(String phone) {
        if (TextUtils.isEmpty(phone)) {
            return false;
        }
        String cleanPhone = phone.replaceAll("[\\s\\-\\(\\)]", "");
        return PK_PHONE_PATTERN.matcher(cleanPhone).matches();
    }

    public static String formatPakistaniPhoneForAuth(String phone) {
        if (TextUtils.isEmpty(phone)) return "";
        String clean = phone.replaceAll("[\\s\\-\\(\\)]", "");
        if (clean.startsWith("+92")) {
            return clean;
        } else if (clean.startsWith("0092")) {
            return "+" + clean.substring(2);
        } else if (clean.startsWith("03")) {
            return "+92" + clean.substring(1);
        } else if (clean.startsWith("3") && clean.length() == 10) {
            return "+92" + clean;
        }
        return clean;
    }

    public static boolean isValidAge(String ageStr) {
        if (TextUtils.isEmpty(ageStr)) {
            return false;
        }
        try {
            int age = Integer.parseInt(ageStr.trim());
            return age >= 18 && age <= 65;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static boolean isValidBloodGroup(String bloodGroup) {
        if (TextUtils.isEmpty(bloodGroup)) {
            return false;
        }
        String[] validGroups = LocationHelper.getBloodGroups();
        for (String bg : validGroups) {
            if (bg.equalsIgnoreCase(bloodGroup.trim())) {
                return true;
            }
        }
        return false;
    }
}
