package com.curso.api.repository.unidade;

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

import com.curso.api.model.Unidade;
import com.curso.api.model.Unidade_;
import com.curso.api.repository.filter.UnidadeFilter;

public class UnidadeRepositoryImpl implements UnidadeRepositoryQuery {

	@PersistenceContext
	private EntityManager manager;
	
	@Override
	public Page<Unidade> filtrar(UnidadeFilter unidadeFilter, Pageable pageable) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Unidade> criteria = builder.createQuery(Unidade.class);
		Root<Unidade> root = criteria.from(Unidade.class);
		
		Predicate[] predicates = criarRestricoes(unidadeFilter, builder, root);
		criteria.where(predicates);
		
		TypedQuery<Unidade> query = manager.createQuery(criteria);
		adicionarRestricoesDePaginacao(query, pageable);
		
		return new PageImpl<>(query.getResultList(), pageable, total(unidadeFilter));
	}
	
	private Predicate[] criarRestricoes(UnidadeFilter unidadeFilter, CriteriaBuilder builder,
			Root<Unidade> root) {
		List<Predicate> predicates = new ArrayList<>();
		
		if (!StringUtils.isEmpty(unidadeFilter.getCodigo())) {
			predicates.add(builder.like(
					builder.lower(root.get(Unidade_.codigo)), "%" + unidadeFilter.getCodigo().toLowerCase() + "%"));
		}
		
		if (!StringUtils.isEmpty(unidadeFilter.getNome())) {
			predicates.add(builder.like(
					builder.lower(root.get(Unidade_.nome)), "%" + unidadeFilter.getNome().toLowerCase() + "%"));
		}
		
		if (unidadeFilter.getAtivo() != null) {
			predicates.add(
					builder.equal(root.get(Unidade_.ativo), unidadeFilter.getAtivo()));
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
	
	private Long total(UnidadeFilter unidadeFilter) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
		Root<Unidade> root = criteria.from(Unidade.class);
		
		Predicate[] predicates = criarRestricoes(unidadeFilter, builder, root);
		criteria.where(predicates);
		
		criteria.select(builder.count(root));
		return manager.createQuery(criteria).getSingleResult();
	}
	
}
