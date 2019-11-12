package com.curso.api.repository.matricula;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.curso.api.model.Matricula;
import com.curso.api.repository.filter.MatriculaFilter;

public interface MatriculaRepositoryQuery {

	public Page<Matricula> filtrar(MatriculaFilter matriculaFilter, Pageable pageable);
	
}
