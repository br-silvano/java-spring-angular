package com.curso.api.repository.unidade;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.curso.api.model.Unidade;
import com.curso.api.repository.filter.UnidadeFilter;

public interface UnidadeRepositoryQuery {

	public Page<Unidade> filtrar(UnidadeFilter unidadeFilter, Pageable pageable);
	
}
