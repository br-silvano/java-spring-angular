package com.curso.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.curso.api.model.AlunoTelefone;

public interface AlunoTelefoneRepository extends JpaRepository<AlunoTelefone, Long> {
	
}
