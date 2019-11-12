package com.curso.api.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.curso.api.security.ApiUserDetailsService;
import com.curso.api.service.exception.CpfInvalidoException;
import com.curso.api.service.exception.CpfJaExisteException;
import com.curso.api.service.exception.DadosInvalidosException;
import com.curso.api.service.exception.TelefoneDuplicadoException;
import com.curso.api.service.exception.TelefoneInvalidoException;
import com.curso.api.service.validation.CpfValidation;
import com.curso.api.service.validation.TelefoneValidation;
import com.curso.api.model.Aluno;
import com.curso.api.model.TipoResponsavel;
import com.curso.api.repository.AlunoRepository;
import com.curso.api.repository.AlunoTelefoneRepository;
import com.curso.api.repository.ResponsavelRepository;
import com.curso.api.repository.ResponsavelTelefoneRepository;

@Service
public class AlunoService {

	@Autowired
	ApiUserDetailsService apiUserDetailsService;

	@Autowired
	private AlunoRepository alunoRepository;

	@Autowired
	private AlunoTelefoneRepository alunoTelefoneRepository;

	@Autowired
	private ResponsavelRepository responsavelRepository;

	@Autowired
	private ResponsavelTelefoneRepository responsavelTelefoneRepository;

	@Transactional(readOnly=false)
	public Aluno criar(Aluno aluno) {
		ValidaDados(aluno);
		aluno.setUsuarioCriacao(apiUserDetailsService.loadAuthenticatedUser());
		aluno.setUsuarioAlteracao(apiUserDetailsService.loadAuthenticatedUser());
		aluno.setDataHoraCriacao(LocalDateTime.now());
		aluno.setDataHoraAlteracao(LocalDateTime.now());
		aluno.setAtivo(true);
		alunoRepository.save(aluno);
		aluno.getTelefones().forEach(telefone -> {
			alunoTelefoneRepository.save(telefone);
		});
		aluno.getResponsaveis().forEach(responsavel -> {
			responsavelRepository.save(responsavel);
			responsavel.getTelefones().forEach(telefone -> {
				responsavelTelefoneRepository.save(telefone);
			});
		});
		return aluno;
	}

	@Transactional(readOnly=false)
	public Aluno atualizar(Long id, Aluno aluno) {
		ValidaDados(aluno);
		return alunoRepository.salvar(id, aluno, apiUserDetailsService.loadAuthenticatedUser());
	}

	public void atualizarPropriedadeAtivo(Long id, Boolean ativo) {
		Aluno alunoSalvo = buscarAlunoPeloId(id);
		alunoSalvo.setAtivo(ativo);
		alunoRepository.save(alunoSalvo);
	}

	public Aluno buscarAlunoPeloId(Long id) {
		Aluno alunoSalvo = alunoRepository.getOne(id);
		if (alunoSalvo == null) {
			throw new EmptyResultDataAccessException(1);
		}
		return alunoSalvo;
	}

	private void ValidaDados(Aluno aluno) {
		CpfValidation cpfValidation = new CpfValidation();
		if (!cpfValidation.isValid(aluno.getCpf(), true)) {
			throw new CpfInvalidoException();
		}
		if (!cpfValidation.isValid(aluno.getCpf(), false)) {
			throw new CpfInvalidoException();
		}
		if (aluno.getId() == null) {
			Optional<Aluno> alunoValidacao = alunoRepository.findByCpf(aluno.getCpf());
			if (alunoValidacao.isPresent()) {
				throw new CpfJaExisteException();
			}
		} else {
			Aluno alunoSalvo = buscarAlunoPeloId(aluno.getId());
			if (!aluno.getCpf().contentEquals(alunoSalvo.getCpf())) {
				Optional<Aluno> alunoValidacao = alunoRepository.findByCpf(aluno.getCpf());
				if (alunoValidacao.isPresent()) {
					throw new CpfJaExisteException();
				}
			}
		}
		TelefoneValidation telefoneValidation = new TelefoneValidation();
		ArrayList<String> listaTelefonesAluno = new ArrayList<String>();
		aluno.getTelefones().forEach(telefone -> {
			if (!telefoneValidation.isValid(telefone.getNumero())) {
				throw new TelefoneInvalidoException();
			}
			listaTelefonesAluno.add(telefone.getNumero());
		});
		if (findDuplicates(listaTelefonesAluno).size() > 0) {
			throw new TelefoneDuplicadoException();
		}
		aluno.getResponsaveis().forEach(responsavel -> {
			ArrayList<String> listaTelefonesResponsavel = new ArrayList<String>();
			if (responsavel.getTipo() == TipoResponsavel.FINANCEIRO) {
				if (responsavel.getCpf() == null ||
					responsavel.getCpf().contentEquals("")) {
					throw new DadosInvalidosException();
				}
				if (!cpfValidation.isValid(responsavel.getCpf(), true)) {
					throw new CpfInvalidoException();
				}
				if (!cpfValidation.isValid(responsavel.getCpf(), false)) {
					throw new CpfInvalidoException();
				}
				if (responsavel.getDataNascimento() == null) {
					throw new DadosInvalidosException();
				}
			}
			responsavel.getTelefones().forEach(telefone -> {
				if (!telefoneValidation.isValid(telefone.getNumero())) {
					throw new TelefoneInvalidoException();
				}
				listaTelefonesResponsavel.add(telefone.getNumero());
			});
			if (findDuplicates(listaTelefonesResponsavel).size() > 0) {
				throw new TelefoneDuplicadoException();
			}
		});
	}

	private static Set<String> findDuplicates(List<String> list) {
 		final Set<String> resultList = new HashSet<String>();
		final Set<String> validation = new HashSet<String>();

		for (String el : list) {
			if (!validation.add(el)) {
				resultList.add(el);
			}
		}
		return resultList;
	}

}
