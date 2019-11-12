package com.curso.api.repository.turno;

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

import com.curso.api.model.Turno;
import com.curso.api.model.Turno_;
import com.curso.api.repository.filter.TurnoFilter;

public class TurnoRepositoryImpl implements TurnoRepositoryQuery {

	@PersistenceContext
	private EntityManager manager;
	
	@Override
	public Page<Turno> filtrar(TurnoFilter turnoFilter, Pageable pageable) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Turno> criteria = builder.createQuery(Turno.class);
		Root<Turno> root = criteria.from(Turno.class);
		
		Predicate[] predicates = criarRestricoes(turnoFilter, builder, root);
		criteria.where(predicates);
		
		TypedQuery<Turno> query = manager.createQuery(criteria);
		adicionarRestricoesDePaginacao(query, pageable);
		
		return new PageImpl<>(query.getResultList(), pageable, total(turnoFilter));
	}
	
	private Predicate[] criarRestricoes(TurnoFilter turnoFilter, CriteriaBuilder builder,
			Root<Turno> root) {
		List<Predicate> predicates = new ArrayList<>();
		
		if (!StringUtils.isEmpty(turnoFilter.getCodigo())) {
			predicates.add(builder.like(
					builder.lower(root.get(Turno_.codigo)), "%" + turnoFilter.getCodigo().toLowerCase() + "%"));
		}
		
		if (!StringUtils.isEmpty(turnoFilter.getDescricao())) {
			predicates.add(builder.like(
					builder.lower(root.get(Turno_.descricao)), "%" + turnoFilter.getDescricao().toLowerCase() + "%"));
		}
		
		if (turnoFilter.getAtivo() != null) {
			predicates.add(
					builder.equal(root.get(Turno_.ativo), turnoFilter.getAtivo()));
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
	
	private Long total(TurnoFilter turnoFilter) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
		Root<Turno> root = criteria.from(Turno.class);
		
		Predicate[] predicates = criarRestricoes(turnoFilter, builder, root);
		criteria.where(predicates);
		
		criteria.select(builder.count(root));
		return manager.createQuery(criteria).getSingleResult();
	}
	
}
