package com.curso.api.repository.curso;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.curso.api.model.Curso;
import com.curso.api.repository.filter.CursoFilter;

public interface CursoRepositoryQuery {

	public Page<Curso> filtrar(CursoFilter cursoFilter, Pageable pageable);
	
}
