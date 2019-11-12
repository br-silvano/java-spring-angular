package com.curso.api.service.validation;

public class EmailValidation {
	private static final String EMAIL_REGEX = "^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$";

	public boolean isValid(String email) {
		return email.matches(EMAIL_REGEX);
    }
}
