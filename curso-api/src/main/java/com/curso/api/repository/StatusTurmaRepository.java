package com.curso.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.curso.api.model.StatusTurma;

public interface StatusTurmaRepository extends JpaRepository<StatusTurma, Long> {
	
	public StatusTurma findByCodigo(String codigo);

}
