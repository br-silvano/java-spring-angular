package com.curso.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.curso.api.model.Aluno;
import com.curso.api.repository.aluno.AlunoRepositoryQuery;

public interface AlunoRepository extends JpaRepository<Aluno, Long>, AlunoRepositoryQuery {

	public Optional<Aluno> findByCpf(String cpf);
	
}
