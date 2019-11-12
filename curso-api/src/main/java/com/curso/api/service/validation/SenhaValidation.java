package com.curso.api.service.validation;

public class SenhaValidation {
	private static final String SENHA_REGEX = "^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@])\\S{6,12}$";

	public boolean isValid(String senha) {
		return senha.matches(SENHA_REGEX);
    }
}
