package com.curso.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.curso.api.config.property.CursoApiProperty;

@SpringBootApplication
@EnableConfigurationProperties(CursoApiProperty.class)
public class CursoApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(CursoApiApplication.class, args);
	}
}
