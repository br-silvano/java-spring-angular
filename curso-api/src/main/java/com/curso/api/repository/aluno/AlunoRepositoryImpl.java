package com.curso.api.repository.aluno;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import com.curso.api.model.Aluno;
import com.curso.api.model.AlunoTelefone;
import com.curso.api.model.Aluno_;
import com.curso.api.model.Responsavel;
import com.curso.api.model.ResponsavelTelefone;
import com.curso.api.model.Usuario;
import com.curso.api.repository.filter.AlunoFilter;

public class AlunoRepositoryImpl implements AlunoRepositoryQuery {

	@PersistenceContext
	private EntityManager manager;

	@Override
	public Aluno salvar(Long id, Aluno aluno, Usuario usuarioAlteracao) {
		Aluno alunoSalvo = manager.find(Aluno.class, id);

		List<AlunoTelefone> alunoTelefonesSalvos = new ArrayList<AlunoTelefone>();
		List<Responsavel> responsaveisSalvos = new ArrayList<Responsavel>();
		List<ResponsavelTelefone> responsaveisTelefonesSalvos = new ArrayList<ResponsavelTelefone>();

		alunoTelefonesSalvos.addAll(alunoSalvo.getTelefones());
		responsaveisSalvos.addAll(alunoSalvo.getResponsaveis());
		alunoSalvo.getResponsaveis().forEach(responsavel -> {
			responsaveisTelefonesSalvos.addAll(responsavel.getTelefones());
		});

		aluno.getTelefones().forEach(telefone -> {
			if (telefone.getId() != null) {
				AlunoTelefone telefoneSalvo = manager.find(AlunoTelefone.class, telefone.getId());
				if (telefoneSalvo != null) {
					alunoTelefonesSalvos.removeIf(filter -> filter.getId() == telefoneSalvo.getId());
				}
			}
		});
		aluno.getResponsaveis().forEach(responsavel -> {
			if (responsavel.getId() != null) {
				Responsavel responsavelSalvo = manager.find(Responsavel.class, responsavel.getId());
				if (responsavelSalvo != null) {
					responsaveisSalvos.removeIf(filter -> filter.getId() == responsavelSalvo.getId());
				}
			}
			responsavel.getTelefones().forEach(telefone -> {
				if (telefone.getId() != null) {
					ResponsavelTelefone telefoneSalvo = manager.find(ResponsavelTelefone.class, telefone.getId());
					if (telefoneSalvo != null) {
						responsaveisTelefonesSalvos.removeIf(filter -> filter.getId() == telefoneSalvo.getId());
					}
				}
			});
		});

		alunoTelefonesSalvos.forEach(telefone -> {
			manager.remove(telefone);
		});
		responsaveisTelefonesSalvos.forEach(telefone -> {
			manager.remove(telefone);
		});
		responsaveisSalvos.forEach(responsavel -> {
			manager.remove(responsavel);
		});

		//manager.flush();

		BeanUtils.copyProperties(aluno, alunoSalvo, "id", "usuarioCriacao", "dataHoraCriacao", "ativo");
		alunoSalvo.setUsuarioAlteracao(usuarioAlteracao);
		alunoSalvo.setDataHoraAlteracao(LocalDateTime.now());
		manager.persist(alunoSalvo);

		aluno.getTelefones().forEach(telefone -> {
			if (telefone.getId() == null)
				manager.persist(telefone);
			else {
				AlunoTelefone telefoneSalvo = manager.find(AlunoTelefone.class, telefone.getId());
				if (telefoneSalvo != null) {
					BeanUtils.copyProperties(telefone, telefoneSalvo, "id", "aluno");
					manager.persist(telefoneSalvo);
				}
				else {
					telefone.setId(null);
					manager.persist(telefone);
				}
			}
		});
		aluno.getResponsaveis().forEach(responsavel -> {
			if (responsavel.getId() == null)
				manager.persist(responsavel);
			else {
				Responsavel responsavelSalvo = manager.find(Responsavel.class, responsavel.getId());
				if (responsavelSalvo != null) {
					BeanUtils.copyProperties(responsavel, responsavelSalvo, "id", "aluno");
					manager.persist(responsavelSalvo);
				}
				else {
					responsavel.setId(null);
					manager.persist(responsavel);
				}
			}

			responsavel.getTelefones().forEach(telefone -> {
				if (telefone.getId() == null)
					manager.persist(telefone);
				else {
					ResponsavelTelefone telefoneSalvo = manager.find(ResponsavelTelefone.class, telefone.getId());
					if (telefoneSalvo != null) {
						BeanUtils.copyProperties(telefone, telefoneSalvo, "id", "responsavel");
						manager.persist(telefoneSalvo);
					}
					else {
						telefone.setId(null);
						manager.persist(telefone);
					}
				}
			});
		});

		return alunoSalvo;
	}

	@Override
	public Page<Aluno> filtrar(AlunoFilter alunoFilter, Pageable pageable) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Aluno> criteria = builder.createQuery(Aluno.class);
		Root<Aluno> root = criteria.from(Aluno.class);

		Predicate[] predicates = criarRestricoes(alunoFilter, builder, root);
		criteria.where(predicates);

		TypedQuery<Aluno> query = manager.createQuery(criteria);
		adicionarRestricoesDePaginacao(query, pageable);

		return new PageImpl<>(query.getResultList(), pageable, total(alunoFilter));
	}

	private Predicate[] criarRestricoes(AlunoFilter alunoFilter, CriteriaBuilder builder,
			Root<Aluno> root) {
		List<Predicate> predicates = new ArrayList<>();

		if (!StringUtils.isEmpty(alunoFilter.getCpf())) {
			predicates.add(builder.like(
					builder.lower(root.get(Aluno_.cpf)), "%" + alunoFilter.getCpf().toLowerCase() + "%"));
		}

		if (!StringUtils.isEmpty(alunoFilter.getNome())) {
			predicates.add(builder.like(
					builder.lower(root.get(Aluno_.nome)), "%" + alunoFilter.getNome().toLowerCase() + "%"));
		}

		if (alunoFilter.getAtivo() != null) {
			predicates.add(
					builder.equal(root.get(Aluno_.ativo), alunoFilter.getAtivo()));
		}

		return predicates.toArray(new Predicate[predicates.size()]);
	}

	private void adicionarRestricoesDePaginacao(TypedQuery<?> query, Pageable pageable) {
		int paginaAtual = pageable.getPageNumber();
		int totalRegistrosPorPagina = pageable.getPageSize();
		int primeiroRegistroDaPagina = paginaAtual * totalRegistrosPorPagina;

		query.setFirstResult(primeiroRegistroDaPagina);
		query.setMaxResults(totalRegistrosPorPagina);
	}

	private Long total(AlunoFilter alunoFilter) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
		Root<Aluno> root = criteria.from(Aluno.class);

		Predicate[] predicates = criarRestricoes(alunoFilter, builder, root);
		criteria.where(predicates);

		criteria.select(builder.count(root));
		return manager.createQuery(criteria).getSingleResult();
	}

}
