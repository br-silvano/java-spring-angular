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
import com.curso.api.model.Turno;
import com.curso.api.repository.TurnoRepository;

@Service
public class TurnoService {

	@Autowired
	ApiUserDetailsService apiUserDetailsService;

	@Autowired
	private TurnoRepository turnoRepository;

	@Transactional(readOnly=false)
	public Turno criar(Turno turno) {
		Optional<Turno> turnoValidacao = turnoRepository.findByCodigo(turno.getCodigo());
		if (turnoValidacao.isPresent()) {
			throw new CodigoJaExisteException();
		}
		turno.setUsuarioCriacao(apiUserDetailsService.loadAuthenticatedUser());
		turno.setUsuarioAlteracao(apiUserDetailsService.loadAuthenticatedUser());
		turno.setDataHoraCriacao(LocalDateTime.now());
		turno.setDataHoraAlteracao(LocalDateTime.now());
		turno.setAtivo(true);
		return turnoRepository.save(turno);
	}

	@Transactional(readOnly=false)
	public Turno atualizar(Long id, Turno turno) {
		Turno turnoSalvo = buscarTurnoPeloId(id);
		if (!turno.getCodigo().contentEquals(turnoSalvo.getCodigo())) {
			Optional<Turno> turnoValidacao = turnoRepository.findByCodigo(turno.getCodigo());
			if (turnoValidacao.isPresent()) {
				throw new CodigoJaExisteException();
			}
		}
		BeanUtils.copyProperties(turno, turnoSalvo, "id", "usuarioCriacao", "dataHoraCriacao", "ativo");
		turnoSalvo.setUsuarioAlteracao(apiUserDetailsService.loadAuthenticatedUser());
		turnoSalvo.setDataHoraAlteracao(LocalDateTime.now());
		return turnoRepository.save(turnoSalvo);
	}

	public void atualizarPropriedadeAtivo(Long id, Boolean ativo) {
		Turno turnoSalvo = buscarTurnoPeloId(id);
		turnoSalvo.setAtivo(ativo);
		turnoRepository.save(turnoSalvo);
	}

	public Turno buscarTurnoPeloId(Long id) {
		Turno turnoSalvo = turnoRepository.getOne(id);
		if (turnoSalvo == null) {
			throw new EmptyResultDataAccessException(1);
		}
		return turnoSalvo;
	}

}
