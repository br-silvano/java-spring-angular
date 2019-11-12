package com.curso.api.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.curso.api.security.ApiUserDetailsService;
import com.curso.api.service.exception.CodigoJaExisteException;
import com.curso.api.model.Turma;
import com.curso.api.repository.TurmaRepository;

@Service
public class TurmaService {

	@Autowired
	ApiUserDetailsService apiUserDetailsService;

	@Autowired
	private TurmaRepository turmaRepository;

	@Transactional(readOnly=false)
	public Turma criar(Turma turma) {
		Optional<Turma> turmaValidacao = turmaRepository.findByCodigo(turma.getCodigo());
		if (turmaValidacao.isPresent()) {
			throw new CodigoJaExisteException();
		}
		turma.setUsuarioCriacao(apiUserDetailsService.loadAuthenticatedUser());
		turma.setUsuarioAlteracao(apiUserDetailsService.loadAuthenticatedUser());
		turma.setDataHoraCriacao(LocalDateTime.now());
		turma.setDataHoraAlteracao(LocalDateTime.now());
		return turmaRepository.save(turma);
	}

	@Transactional(readOnly=false)
	public Turma atualizar(Long id, Turma turma) {
		Turma turmaSalva = buscarTurmaPeloId(id);
		if (!turma.getCodigo().contentEquals(turmaSalva.getCodigo())) {
			Optional<Turma> turmaValidacao = turmaRepository.findByCodigo(turma.getCodigo());
			if (turmaValidacao.isPresent()) {
				throw new CodigoJaExisteException();
			}
		}
		BeanUtils.copyProperties(turma, turmaSalva, "id", "usuarioCriacao", "dataHoraCriacao");
		turmaSalva.setUsuarioAlteracao(apiUserDetailsService.loadAuthenticatedUser());
		turmaSalva.setDataHoraAlteracao(LocalDateTime.now());
		return turmaRepository.save(turmaSalva);
	}

	public Turma buscarTurmaPeloId(Long id) {
		Turma turmaSalva = turmaRepository.getOne(id);
		if (turmaSalva == null) {
			throw new EmptyResultDataAccessException(1);
		}
		return turmaSalva;
	}

}
