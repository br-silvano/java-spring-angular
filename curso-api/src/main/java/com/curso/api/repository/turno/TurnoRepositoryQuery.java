package com.curso.api.repository.turno;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.curso.api.model.Turno;
import com.curso.api.repository.filter.TurnoFilter;

public interface TurnoRepositoryQuery {

	public Page<Turno> filtrar(TurnoFilter turnoFilter, Pageable pageable);
	
}
