package com.chengrui.st.enums;

public enum ErrorMsg {

    ACCOUNT_EXIT("User already exists"),
    ACCOUNT_Ban("Account has been banned"),
    ACCOUNT_NOT_EXIT("User does not exist"),
    PASSWORD_IS_NOT_SAME("Passwords do not match"),
    PASSWORD_RESET_ERROR("Failed to change password"),
    EMAIL_SEND_ERROR("Failed to send email. Please try again"),
    PARAM_ERROR("Invalid parameters"),
    SYSTEM_ERROR("System error"),
    REGISTER_ERROR("Registration failed"),
    FILE_TYPE_ERROR("Invalid file type. Please choose .jpg or .png"),
    FILE_UPLOAD_ERROR("File upload failed"),
    FILE_NOT_EXIT("File does not exist"),
    FILE_DOWNLOAD_ERROR("File download error"),
    FILE_SIZE_ERROR("File is too large"),
    OPERAT_FREQUENCY("Too many requests. Please try again later"),
    MISSING_PARAMETER("Missing parameter(s)"),
    COOKIE_ERROR("Please log in again"),
    EMAIL_LOGIN_ERROR("Login failed. Incorrect account or password"),
    JSON_READ_ERROR("JSON parameter parsing error"),
    FORM_NUMBER_ERROR("Invalid form ID"),
    REPEAT_COMMIT_ERROR("Please do not submit repeatedly"),
    COMMIT_FAIL_ERROR("Submission failed"),
    FAVORITE_EXIT("Favorite already exists");

    private String msg;

    ErrorMsg(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
