package com.curso.api.repository.aluno;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.curso.api.model.Aluno;
import com.curso.api.model.Usuario;
import com.curso.api.repository.filter.AlunoFilter;

public interface AlunoRepositoryQuery {

	public Page<Aluno> filtrar(AlunoFilter alunoFilter, Pageable pageable);
	public Aluno salvar(Long id, Aluno aluno, Usuario usuarioAlteracao);
	
}
