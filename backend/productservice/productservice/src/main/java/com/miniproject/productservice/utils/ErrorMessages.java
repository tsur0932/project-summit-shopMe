package com.miniproject.productservice.utils;

public final class ErrorMessages {

    public static final String INTERNAL_ERROR = "An internal error has occurred while performing the request";
    public static final String TYPE_ERROR = "A type error has occurred in request parameters";
    public static final String REQUIRED_PARAM_ERROR = "Required parameters are missing in the request";
    public static final String INVALID_PARAM_ERROR = "An invalid parameter has sent in the request";
    public static final String DATABASE_ERROR = "Database error";
    public static final String NO_RESOURCE = "Resource not found";
    public static final String CONVERSION_ERROR = "Failed to convert String to JSON";
    public static final String UNAUTHORIZED = "The namespace is not authorized";
    public static final String DUPLICATE_VALUE = "Duplicate key value violation";
    public static final String WRONG_FORMAT = "The given string is in incorrect format";
    public static final String MISSING_REFERENCE_ID_ERROR = "A Reference ID is required for the requested preference";
    public static final String MISSING_SHOP_ACCOUNT_ID_ERROR = "An invalid shop account id has sent in the request";
    public static final String MISSING_SHOP_ACCOUNT_ID_ERROR_FOR_PREFERENCE = "A Shop Account ID is required for the requested preference";

    private ErrorMessages() {

    }
}
