package com.curso.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.curso.api.model.Responsavel;

public interface ResponsavelRepository extends JpaRepository<Responsavel, Long> {
	
}
