package com.curso.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.curso.api.model.Unidade;
import com.curso.api.repository.unidade.UnidadeRepositoryQuery;

public interface UnidadeRepository extends JpaRepository<Unidade, Long>, UnidadeRepositoryQuery {

	public Optional<Unidade> findByCodigo(String codigo);
	
}
