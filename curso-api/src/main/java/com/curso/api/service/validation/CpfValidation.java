package com.curso.api.service.validation;

public class CpfValidation {
	private static final String CPF_REGEX = "^[0-9]{3}\\.{1}[0-9]{3}\\.{1}[0-9]{3}\\-{1}[0-9]{2}$";

	public boolean isValid(String cpf, boolean REGEX) {
		if (REGEX) {
			return cpf.matches(CPF_REGEX);
		} else {
			int soma;
			int resto;
			soma = 0;
			cpf = cpf.replaceAll("[^0-9]", "");
			if (cpf == "") {
				return false;
			}
			if (cpf.length() != 11 ||
				cpf == "00000000000" ||
				cpf == "11111111111" ||
				cpf == "22222222222" ||
				cpf == "33333333333" ||
				cpf == "44444444444" ||
				cpf == "55555555555" ||
				cpf == "66666666666" ||
				cpf == "77777777777" ||
				cpf == "88888888888" ||
				cpf == "99999999999") {
				return false;
			}
			for (int i = 1; i <= 9; i++) {
				soma = soma + Integer.parseInt(cpf.substring(i - 1, i)) * (11 - i);
			}
			resto = (soma * 10) % 11;
			if ((resto == 10) || (resto == 11)) {
				resto = 0;
			}
			if (resto != Integer.parseInt(cpf.substring(9, 10))) {
				return false;
			}
			soma = 0;
			for (int i = 1; i <= 10; i++) {
				soma = soma + Integer.parseInt(cpf.substring(i - 1, i)) * (12 - i);
			}
			resto = (soma * 10) % 11;
			if ((resto == 10) || (resto == 11)) {
				resto = 0;
			}
			if (resto != Integer.parseInt(cpf.substring(10, 11))) {
				return false;
			}
			return true;
		}

	}
}
