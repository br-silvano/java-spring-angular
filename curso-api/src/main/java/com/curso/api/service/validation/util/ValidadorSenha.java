package com.curso.api.service.validation.util;

import com.curso.api.service.validation.SenhaValidation;

public class ValidadorSenha {

	public static void main(String[] args) {
		// https://howtodoinjava.com/regex/
		SenhaValidation validator = new SenhaValidation();
		System.out.println(validator.isValid("123456"));
		System.out.println(validator.isValid("a@5B68"));
	}

}
