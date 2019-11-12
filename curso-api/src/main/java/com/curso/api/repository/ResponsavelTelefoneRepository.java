package com.curso.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.curso.api.model.ResponsavelTelefone;

public interface ResponsavelTelefoneRepository extends JpaRepository<ResponsavelTelefone, Long> {
	
}
