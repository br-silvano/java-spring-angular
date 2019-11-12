package com.curso.api.service.validation.util;

import com.curso.api.service.validation.EmailValidation;

public class ValidadorEmail {

	public static void main(String[] args) {
		// https://howtodoinjava.com/regex/
		EmailValidation validator = new EmailValidation();
		System.out.println(validator.isValid("user@domain.com"));
		System.out.println(validator.isValid("user@domain.co.in"));
		System.out.println(validator.isValid("user.name@domain.com"));
		System.out.println(validator.isValid("user_name@domain.com"));
		System.out.println(validator.isValid("username@yahoo.corporate.in"));
		System.out.println(validator.isValid(".username@yahoo.com"));
		System.out.println(validator.isValid("username@yahoo.com."));
		System.out.println(validator.isValid("username@yahoo..com"));
		System.out.println(validator.isValid("username@yahoo.c"));
		System.out.println(validator.isValid("username@yahoo.corporate"));
	}

}
