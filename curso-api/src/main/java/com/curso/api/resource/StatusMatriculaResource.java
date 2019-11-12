package com.curso.api.resource;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.curso.api.model.StatusMatricula;
import com.curso.api.repository.StatusMatriculaRepository;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/statuss-matricula")
public class StatusMatriculaResource {

	@Autowired
	private StatusMatriculaRepository statusMatriculaRepository;

	@ApiOperation(value="Retorna uma lista de Todos os Status")
	@GetMapping(params = "todos")
	@PreAuthorize("#oauth2.hasScope('read')")
	public List<StatusMatricula> pesquisar() {
		return statusMatriculaRepository.findAll();
	}

}
