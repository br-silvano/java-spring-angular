package com.curso.api.service.validation;

public class TelefoneValidation {
	private static final String PHONE_NUMBER_REGEX = "^\\(?([0-9]{2})\\)[\\s]{1}([0-9]{4}|[0-9]{5})[-\\s]{1}([0-9]{4})$";

	public boolean isValid(String phoneNumber) {
		return phoneNumber.matches(PHONE_NUMBER_REGEX);
    }
}
