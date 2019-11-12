package com.curso.api.security.util;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class GeradorSenha {

	public static void main(String[] args) {
		String idForEncoder = "bcrypt";
		Map<String, PasswordEncoder> encoderMap = new HashMap<>();
		encoderMap.put(idForEncoder, new BCryptPasswordEncoder());
		PasswordEncoder passwordEncoder = new DelegatingPasswordEncoder(idForEncoder, encoderMap);
		System.out.println(passwordEncoder.encode("123456"));
	}

}
