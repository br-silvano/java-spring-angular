package com.curso.api.repository.usuario;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.curso.api.model.Usuario;
import com.curso.api.repository.filter.UsuarioFilter;
import com.curso.api.repository.projection.ResumoUsuario;

public interface UsuarioRepositoryQuery {

	public Page<Usuario> filtrar(UsuarioFilter usuarioFilter, Pageable pageable);
	public Page<ResumoUsuario> resumir(UsuarioFilter usuarioFilter, Pageable pageable);
	
}
