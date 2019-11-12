package com.curso.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.curso.api.model.StatusMatricula;

public interface StatusMatriculaRepository extends JpaRepository<StatusMatricula, Long> {
	
	public StatusMatricula findByCodigo(String codigo);

}
