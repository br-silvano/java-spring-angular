package com.curso.api.resource;

import io.swagger.annotations.ApiOperation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.curso.api.model.StatusTurma;
import com.curso.api.repository.StatusTurmaRepository;

@RestController
@RequestMapping("/statuss-turma")
public class StatusTurmaResource {

	@Autowired
	private StatusTurmaRepository statusTurmaRepository;

	@ApiOperation(value="Retorna uma lista de Todos os Status")
	@GetMapping(params = "todos")
	@PreAuthorize("#oauth2.hasScope('read')")
	public List<StatusTurma> pesquisar() {
		return statusTurmaRepository.findAll();
	}

}
