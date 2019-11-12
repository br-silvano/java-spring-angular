package com.curso.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.curso.api.model.Turma;
import com.curso.api.repository.turma.TurmaRepositoryQuery;

public interface TurmaRepository extends JpaRepository<Turma, Long>, TurmaRepositoryQuery {

	public Optional<Turma> findByCodigo(String codigo);
	
}
