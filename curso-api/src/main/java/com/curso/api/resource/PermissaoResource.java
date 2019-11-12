package com.curso.api.resource;

import io.swagger.annotations.ApiOperation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.curso.api.model.Permissao;
import com.curso.api.repository.PermissaoRepository;

@RestController
@RequestMapping("/permissoes")
public class PermissaoResource {

	@Autowired
	private PermissaoRepository permissaoRepository;

	@ApiOperation(value="Retorna uma lista de Todas Permissões")
	@GetMapping(params = "todas")
	@PreAuthorize("#oauth2.hasScope('read')")
	public List<Permissao> pesquisar() {
		return permissaoRepository.findAll();
	}

}
