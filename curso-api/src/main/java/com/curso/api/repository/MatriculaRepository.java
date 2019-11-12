package com.curso.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.curso.api.model.Matricula;
import com.curso.api.repository.matricula.MatriculaRepositoryQuery;

public interface MatriculaRepository extends JpaRepository<Matricula, Long>, MatriculaRepositoryQuery {

}
