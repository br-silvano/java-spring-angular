package com.curso.api.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.curso.api.dto.AlteraEmailDto;
import com.curso.api.dto.AlteraSenhaDto;
import com.curso.api.model.Usuario;
import com.curso.api.repository.UsuarioRepository;
import com.curso.api.security.ApiUserDetailsService;
import com.curso.api.service.exception.DadosInvalidosException;
import com.curso.api.service.exception.EmailInvalidoException;
import com.curso.api.service.exception.EmailJaExisteException;
import com.curso.api.service.exception.SenhaInvalidaException;
import com.curso.api.service.validation.EmailValidation;
import com.curso.api.service.validation.SenhaValidation;

@Service
public class UsuarioService {

	@Autowired
	ApiUserDetailsService apiUserDetailsService;

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Transactional(readOnly=false)
	public Usuario criar(Usuario usuario) {
		EmailValidation emailValidation = new EmailValidation();
		if (!emailValidation.isValid(usuario.getEmail())) {
			throw new EmailInvalidoException();
		}
		SenhaValidation senhaValidation = new SenhaValidation();
		if (!senhaValidation.isValid(usuario.getSenha())) {
			throw new SenhaInvalidaException();
		}
		Optional<Usuario> usuarioSalvo = usuarioRepository.findByEmail(usuario.getEmail());
		if (usuarioSalvo.isPresent()) {
			throw new EmailJaExisteException();
		}
		String idForEncoder = "bcrypt";
		Map<String, PasswordEncoder> encoderMap = new HashMap<>();
		encoderMap.put(idForEncoder, new BCryptPasswordEncoder());
		PasswordEncoder passwordEncoder = new DelegatingPasswordEncoder(idForEncoder, encoderMap);
		usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
		usuario.setDataHoraCriacao(LocalDateTime.now());
		usuario.setDataHoraAlteracao(LocalDateTime.now());
		usuario.setAtivo(true);
		return usuarioRepository.save(usuario);
	}

	@Transactional(readOnly=false)
	public Usuario atualizar(Long id, Usuario usuario) {
		Usuario usuarioSalvo = buscarUsuarioPeloId(id);
		if (!usuarioSalvo.getEmail().contentEquals(usuario.getEmail())){
			EmailValidation emailValidation = new EmailValidation();
			if (!emailValidation.isValid(usuario.getEmail())) {
				throw new EmailInvalidoException();
			}
			Optional<Usuario> usuarioSalvoExiste = usuarioRepository.findByEmail(usuario.getEmail());
			if (usuarioSalvoExiste.isPresent()) {
				throw new EmailJaExisteException();
			}
		}
		BeanUtils.copyProperties(usuario, usuarioSalvo, "id", "senha", "dataHoraCriacao", "ativo");
		usuarioSalvo.setDataHoraAlteracao(LocalDateTime.now());
		return usuarioRepository.save(usuarioSalvo);
	}

	@Transactional(readOnly=false)
	public void atualizarPropriedadeAtivo(Long id, Boolean ativo) {
		Usuario usuarioSalvo = buscarUsuarioPeloId(id);
		usuarioSalvo.setAtivo(ativo);
		usuarioRepository.save(usuarioSalvo);
	}

	@Transactional(readOnly=false)
	public Usuario alterarSenha(Long id, AlteraSenhaDto alteraSenha) {
		String idForEncoder = "bcrypt";
		Map<String, PasswordEncoder> encoderMap = new HashMap<>();
		encoderMap.put(idForEncoder, new BCryptPasswordEncoder());
		PasswordEncoder passwordEncoder = new DelegatingPasswordEncoder(idForEncoder, encoderMap);
		Usuario usuarioSalvo = buscarUsuarioPeloId(id);
		if (usuarioSalvo == null) {
			throw new DadosInvalidosException();
		}
		if (!alteraSenha.getNovaSenha().trim().contentEquals(alteraSenha.getConfirmaNovaSenha().trim())) {
			throw new DadosInvalidosException();
		}
		SenhaValidation senhaValidation = new SenhaValidation();
		if (!senhaValidation.isValid(alteraSenha.getNovaSenha())) {
			throw new SenhaInvalidaException();
		}
		usuarioSalvo.setSenha(passwordEncoder.encode(alteraSenha.getNovaSenha()));
		usuarioSalvo.setDataHoraAlteracao(LocalDateTime.now());
		return usuarioRepository.save(usuarioSalvo);
	}

	@Transactional(readOnly=false)
	public Usuario alterarSenha(AlteraSenhaDto alteraSenha) {
		String idForEncoder = "bcrypt";
		Map<String, PasswordEncoder> encoderMap = new HashMap<>();
		encoderMap.put(idForEncoder, new BCryptPasswordEncoder());
		PasswordEncoder passwordEncoder = new DelegatingPasswordEncoder(idForEncoder, encoderMap);
		Usuario usuarioSalvo = buscarUsuarioPeloId(apiUserDetailsService.loadAuthenticatedUser().getId());
		if (alteraSenha.getSenha() == null) {
			throw new DadosInvalidosException();
		}
		if (!passwordEncoder.matches(alteraSenha.getSenha(), usuarioSalvo.getSenha())) {
			throw new DadosInvalidosException();
		}
		if (!alteraSenha.getNovaSenha().trim().contentEquals(alteraSenha.getConfirmaNovaSenha().trim())) {
			throw new DadosInvalidosException();
		}
		SenhaValidation senhaValidation = new SenhaValidation();
		if (!senhaValidation.isValid(alteraSenha.getNovaSenha())) {
			throw new SenhaInvalidaException();
		}
		usuarioSalvo.setSenha(passwordEncoder.encode(alteraSenha.getNovaSenha()));
		usuarioSalvo.setDataHoraAlteracao(LocalDateTime.now());
		return usuarioRepository.save(usuarioSalvo);
	}

	@Transactional(readOnly=false)
	public Usuario alterarEmail(AlteraEmailDto alteraEmail) {
		String idForEncoder = "bcrypt";
		Map<String, PasswordEncoder> encoderMap = new HashMap<>();
		encoderMap.put(idForEncoder, new BCryptPasswordEncoder());
		PasswordEncoder passwordEncoder = new DelegatingPasswordEncoder(idForEncoder, encoderMap);
		Usuario usuarioSalvo = buscarUsuarioPeloId(apiUserDetailsService.loadAuthenticatedUser().getId());
		EmailValidation emailValidation = new EmailValidation();
		if (!passwordEncoder.matches(alteraEmail.getSenha(), usuarioSalvo.getSenha())) {
			throw new DadosInvalidosException();
		}
		if (!alteraEmail.getNovoEmail().trim().contentEquals(alteraEmail.getConfirmaNovoEmail().trim())) {
			throw new DadosInvalidosException();
		}
		if (!emailValidation.isValid(alteraEmail.getNovoEmail())) {
			throw new EmailInvalidoException();
		}
		usuarioSalvo.setEmail(alteraEmail.getNovoEmail());
		usuarioSalvo.setDataHoraAlteracao(LocalDateTime.now());
		return usuarioRepository.save(usuarioSalvo);
	}

	public Usuario buscarUsuarioPeloId(Long id) {
		Usuario usuarioSalvo = usuarioRepository.getOne(id);
		if (usuarioSalvo == null) {
			throw new EmptyResultDataAccessException(1);
		}
		return usuarioSalvo;
	}

}
