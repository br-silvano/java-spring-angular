package com.curso.api.repository.turma;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.curso.api.model.Turma;
import com.curso.api.repository.filter.TurmaFilter;

public interface TurmaRepositoryQuery {

	public Page<Turma> filtrar(TurmaFilter turmaFilter, Pageable pageable);
	
}
