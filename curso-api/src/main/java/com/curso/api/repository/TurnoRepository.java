package com.curso.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.curso.api.model.Turno;
import com.curso.api.repository.turno.TurnoRepositoryQuery;

public interface TurnoRepository extends JpaRepository<Turno, Long>, TurnoRepositoryQuery {

	public Optional<Turno> findByCodigo(String codigo);
	
}
