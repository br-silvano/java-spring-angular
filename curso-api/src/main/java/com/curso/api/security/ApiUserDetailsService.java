package com.curso.api.security;

import java.util.Collection;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.curso.api.model.Usuario;
import com.curso.api.repository.UsuarioRepository;

@Service
public class ApiUserDetailsService implements UserDetailsService {

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
    private IAuthenticationFacade authenticationFacade;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		Optional<Usuario> usuarioOptional = usuarioRepository.findByEmailAndAtivo(email, true);
		Usuario usuario = usuarioOptional.orElseThrow(() -> new UsernameNotFoundException("Usuário e/ou senha incorretos"));
		return new UsuarioSistema(usuario, getPermissoes(usuario));
	}

	private Collection<? extends GrantedAuthority> getPermissoes(Usuario usuario) {
		Set<SimpleGrantedAuthority> authorities = new HashSet<>();
		usuario.getPermissoes().forEach(p -> {
			if (p.getAtivo() == true){
				authorities.add(new SimpleGrantedAuthority(p.getNome().toUpperCase()));
			}
		});
		return authorities;
	}

	public Usuario loadAuthenticatedUser() throws UsernameNotFoundException {
		Authentication authentication = authenticationFacade.getAuthentication();
		Optional<Usuario> usuarioOptional = usuarioRepository.findByEmailAndAtivo(authentication.getName(), true);
		Usuario usuario = usuarioOptional.orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
		return usuario;
	}

}
