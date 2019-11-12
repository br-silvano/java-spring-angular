package com.curso.api.service.validation.util;

import com.curso.api.service.validation.TelefoneValidation;

public class ValidadorTelefone {

	public static void main(String[] args) {
		// https://howtodoinjava.com/regex/
		TelefoneValidation validator = new TelefoneValidation();
		System.out.println(validator.isValid("(16) 99716-3946"));
		System.out.println(validator.isValid("(016) 99716-3946"));
		System.out.println(validator.isValid("(16) 9716-3946"));
		System.out.println(validator.isValid("(016) 9716-3946"));
		System.out.println(validator.isValid("(16)"));
		System.out.println(validator.isValid("(16)9716"));
		System.out.println(validator.isValid("(16)9716-3946"));
		System.out.println(validator.isValid("(16) 9716-39460"));
		System.out.println(validator.isValid("(16) 99716-39460"));
		System.out.println(validator.isValid("(16) 97163946"));
		System.out.println(validator.isValid("(16) 997163946"));
		System.out.println(validator.isValid(""));
		System.out.println(validator.isValid("()"));
		System.out.println(validator.isValid("( )"));
		System.out.println(validator.isValid("() 99716-3946"));
		System.out.println(validator.isValid("( ) 99716-3946"));
	}

}
