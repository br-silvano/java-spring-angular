package com.curso.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.curso.api.model.Curso;
import com.curso.api.repository.curso.CursoRepositoryQuery;

public interface CursoRepository extends JpaRepository<Curso, Long>, CursoRepositoryQuery {

	public Optional<Curso> findByCodigo(String codigo);
	
}
