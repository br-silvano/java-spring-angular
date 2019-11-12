package com.curso.api.repository.curso;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import com.curso.api.model.Curso;
import com.curso.api.model.Curso_;
import com.curso.api.repository.filter.CursoFilter;

public class CursoRepositoryImpl implements CursoRepositoryQuery {

	@PersistenceContext
	private EntityManager manager;
	
	@Override
	public Page<Curso> filtrar(CursoFilter cursoFilter, Pageable pageable) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Curso> criteria = builder.createQuery(Curso.class);
		Root<Curso> root = criteria.from(Curso.class);
		
		Predicate[] predicates = criarRestricoes(cursoFilter, builder, root);
		criteria.where(predicates);
		
		TypedQuery<Curso> query = manager.createQuery(criteria);
		adicionarRestricoesDePaginacao(query, pageable);
		
		return new PageImpl<>(query.getResultList(), pageable, total(cursoFilter));
	}
	
	private Predicate[] criarRestricoes(CursoFilter cursoFilter, CriteriaBuilder builder,
			Root<Curso> root) {
		List<Predicate> predicates = new ArrayList<>();
		
		if (!StringUtils.isEmpty(cursoFilter.getCodigo())) {
			predicates.add(builder.like(
					builder.lower(root.get(Curso_.codigo)), "%" + cursoFilter.getCodigo().toLowerCase() + "%"));
		}
		
		if (!StringUtils.isEmpty(cursoFilter.getDescricao())) {
			predicates.add(builder.like(
					builder.lower(root.get(Curso_.descricao)), "%" + cursoFilter.getDescricao().toLowerCase() + "%"));
		}
		
		if (cursoFilter.getAtivo() != null) {
			predicates.add(
					builder.equal(root.get(Curso_.ativo), cursoFilter.getAtivo()));
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
	
	private Long total(CursoFilter cursoFilter) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
		Root<Curso> root = criteria.from(Curso.class);
		
		Predicate[] predicates = criarRestricoes(cursoFilter, builder, root);
		criteria.where(predicates);
		
		criteria.select(builder.count(root));
		return manager.createQuery(criteria).getSingleResult();
	}
	
}
