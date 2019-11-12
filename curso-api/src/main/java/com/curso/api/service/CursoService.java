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
import com.curso.api.model.Curso;
import com.curso.api.repository.CursoRepository;

@Service
public class CursoService {

	@Autowired
	ApiUserDetailsService apiUserDetailsService;

	@Autowired
	private CursoRepository cursoRepository;

	@Transactional(readOnly=false)
	public Curso criar(Curso curso) {
		Optional<Curso> cursoValidacao = cursoRepository.findByCodigo(curso.getCodigo());
		if (cursoValidacao.isPresent()) {
			throw new CodigoJaExisteException();
		}
		curso.setUsuarioCriacao(apiUserDetailsService.loadAuthenticatedUser());
		curso.setUsuarioAlteracao(apiUserDetailsService.loadAuthenticatedUser());
		curso.setDataHoraCriacao(LocalDateTime.now());
		curso.setDataHoraAlteracao(LocalDateTime.now());
		curso.setAtivo(true);
		return cursoRepository.save(curso);
	}

	@Transactional(readOnly=false)
	public Curso atualizar(Long id, Curso curso) {
		Curso cursoSalvo = buscarCursoPeloId(id);
		if (!curso.getCodigo().contentEquals(cursoSalvo.getCodigo())) {
			Optional<Curso> cursoValidacao = cursoRepository.findByCodigo(curso.getCodigo());
			if (cursoValidacao.isPresent()) {
				throw new CodigoJaExisteException();
			}
		}
		BeanUtils.copyProperties(curso, cursoSalvo, "id", "usuarioCriacao", "dataHoraCriacao", "ativo");
		cursoSalvo.setUsuarioAlteracao(apiUserDetailsService.loadAuthenticatedUser());
		cursoSalvo.setDataHoraAlteracao(LocalDateTime.now());
		return cursoRepository.save(cursoSalvo);
	}

	public void atualizarPropriedadeAtivo(Long id, Boolean ativo) {
		Curso cursoSalvo = buscarCursoPeloId(id);
		cursoSalvo.setAtivo(ativo);
		cursoRepository.save(cursoSalvo);
	}

	public Curso buscarCursoPeloId(Long id) {
		Optional<Curso> cursoSalvo = cursoRepository.findById(id);
		if (!cursoSalvo.isPresent()) {
			throw new EmptyResultDataAccessException(1);
		}
		return cursoSalvo.get();
	}

}
