package com.curso.api.service;

import java.time.LocalDateTime;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.curso.api.model.Matricula;
import com.curso.api.repository.MatriculaRepository;
import com.curso.api.security.ApiUserDetailsService;

@Service
public class MatriculaService {

	@Autowired
	ApiUserDetailsService apiUserDetailsService;

	@Autowired
	private MatriculaRepository matriculaRepository;

	@Transactional(readOnly=false)
	public Matricula criar(Matricula matricula) {
		matricula.setUsuarioCriacao(apiUserDetailsService.loadAuthenticatedUser());
		matricula.setUsuarioAlteracao(apiUserDetailsService.loadAuthenticatedUser());
		matricula.setDataHoraCriacao(LocalDateTime.now());
		matricula.setDataHoraAlteracao(LocalDateTime.now());
		return matriculaRepository.save(matricula);
	}

	@Transactional(readOnly=false)
	public Matricula atualizar(Long id, Matricula matricula) {
		Matricula matriculaSalva = buscarMatriculaPeloId(id);
		BeanUtils.copyProperties(matricula, matriculaSalva, "id", "usuarioCriacao", "dataHoraCriacao");
		matriculaSalva.setUsuarioAlteracao(apiUserDetailsService.loadAuthenticatedUser());
		matriculaSalva.setDataHoraAlteracao(LocalDateTime.now());
		return matriculaRepository.save(matriculaSalva);
	}

	public Matricula buscarMatriculaPeloId(Long id) {
		Matricula matriculaSalva = matriculaRepository.getOne(id);
		if (matriculaSalva == null) {
			throw new EmptyResultDataAccessException(1);
		}
		return matriculaSalva;
	}

}
