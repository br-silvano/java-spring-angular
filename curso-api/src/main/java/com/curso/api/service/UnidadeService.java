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
import com.curso.api.model.Unidade;
import com.curso.api.repository.UnidadeRepository;

@Service
public class UnidadeService {

	@Autowired
	ApiUserDetailsService apiUserDetailsService;

	@Autowired
	private UnidadeRepository unidadeRepository;

	@Transactional(readOnly=false)
	public Unidade criar(Unidade unidade) {
		Optional<Unidade> unidadeValidacao = unidadeRepository.findByCodigo(unidade.getCodigo());
		if (unidadeValidacao.isPresent()) {
			throw new CodigoJaExisteException();
		}
		unidade.setUsuarioCriacao(apiUserDetailsService.loadAuthenticatedUser());
		unidade.setUsuarioAlteracao(apiUserDetailsService.loadAuthenticatedUser());
		unidade.setDataHoraCriacao(LocalDateTime.now());
		unidade.setDataHoraAlteracao(LocalDateTime.now());
		unidade.setAtivo(true);
		return unidadeRepository.save(unidade);
	}

	@Transactional(readOnly=false)
	public Unidade atualizar(Long id, Unidade unidade) {
		Unidade unidadeSalva = buscarUnidadePeloId(id);
		if (!unidade.getCodigo().contentEquals(unidadeSalva.getCodigo())) {
			Optional<Unidade> unidadeValidacao = unidadeRepository.findByCodigo(unidade.getCodigo());
			if (unidadeValidacao.isPresent()) {
				throw new CodigoJaExisteException();
			}
		}
		BeanUtils.copyProperties(unidade, unidadeSalva, "id", "usuarioCriacao", "dataHoraCriacao", "ativo");
		unidadeSalva.setUsuarioAlteracao(apiUserDetailsService.loadAuthenticatedUser());
		unidadeSalva.setDataHoraAlteracao(LocalDateTime.now());
		return unidadeRepository.save(unidadeSalva);
	}

	public void atualizarPropriedadeAtivo(Long id, Boolean ativo) {
		Unidade unidadeSalva = buscarUnidadePeloId(id);
		unidadeSalva.setAtivo(ativo);
		unidadeRepository.save(unidadeSalva);
	}

	public Unidade buscarUnidadePeloId(Long id) {
		Unidade unidadeSalva = unidadeRepository.getOne(id);
		if (unidadeSalva == null) {
			throw new EmptyResultDataAccessException(1);
		}
		return unidadeSalva;
	}

}
