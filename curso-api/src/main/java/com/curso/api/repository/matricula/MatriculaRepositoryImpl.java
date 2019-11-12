package com.curso.api.repository.matricula;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import com.curso.api.model.Aluno;
import com.curso.api.model.Matricula;
import com.curso.api.model.Matricula_;
import com.curso.api.model.StatusMatricula;
import com.curso.api.repository.filter.MatriculaFilter;

public class MatriculaRepositoryImpl implements MatriculaRepositoryQuery {

	@PersistenceContext
	private EntityManager manager;
	
	@Override
	public Page<Matricula> filtrar(MatriculaFilter matriculaFilter, Pageable pageable) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Matricula> criteria = builder.createQuery(Matricula.class);
		Root<Matricula> root = criteria.from(Matricula.class);
		
		Predicate[] predicates = criarRestricoes(matriculaFilter, builder, root);
		criteria.where(predicates);
		
		TypedQuery<Matricula> query = manager.createQuery(criteria);
		adicionarRestricoesDePaginacao(query, pageable);
		
		return new PageImpl<>(query.getResultList(), pageable, total(matriculaFilter));
	}
	
	private Predicate[] criarRestricoes(MatriculaFilter matriculaFilter, CriteriaBuilder builder,
			Root<Matricula> root) {
		List<Predicate> predicates = new ArrayList<>();
		
		if (matriculaFilter.getId() != null) {
			predicates.add(
					builder.equal(root.get(Matricula_.id), matriculaFilter.getId()));
		}
		
		if (!StringUtils.isEmpty(matriculaFilter.getCpf())) {
			Query q = manager.createNativeQuery("SELECT id FROM aluno WHERE cpf = :cpf");
			q.setParameter("cpf", matriculaFilter.getCpf().trim());
			Object obj = (Object)q.getSingleResult();
			if (obj != null) {
				Aluno aluno = manager.find(Aluno.class, Long.parseLong(obj.toString()));
				predicates.add(
						builder.equal(root.get(Matricula_.aluno), aluno));
			}
		}
		
		if (matriculaFilter.getStatus() != null) {
			StatusMatricula statusMatricula = manager.find(StatusMatricula.class, Long.parseLong(matriculaFilter.getStatus()));
			predicates.add(
					builder.equal(root.get(Matricula_.statusMatricula), statusMatricula));
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
	
	private Long total(MatriculaFilter matriculaFilter) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
		Root<Matricula> root = criteria.from(Matricula.class);
		
		Predicate[] predicates = criarRestricoes(matriculaFilter, builder, root);
		criteria.where(predicates);
		
		criteria.select(builder.count(root));
		return manager.createQuery(criteria).getSingleResult();
	}
	
}
