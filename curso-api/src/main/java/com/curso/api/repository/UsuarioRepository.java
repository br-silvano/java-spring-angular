package com.curso.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.curso.api.model.Usuario;
import com.curso.api.repository.usuario.UsuarioRepositoryQuery;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>, UsuarioRepositoryQuery {

	public Optional<Usuario> findByEmail(String email);
	public Optional<Usuario> findByEmailAndAtivo(String email, Boolean ativo);
	
}
