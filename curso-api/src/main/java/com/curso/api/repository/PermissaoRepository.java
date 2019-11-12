package com.curso.api.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.curso.api.model.Permissao;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {
	
	public Page<Permissao> findByNomeContainingAndAtivo(String nome, Boolean ativo, Pageable pageable);	

}
