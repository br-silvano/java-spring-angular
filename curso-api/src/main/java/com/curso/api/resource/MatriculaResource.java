package com.curso.api.resource;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.curso.api.event.RecursoCriadoEvent;
import com.curso.api.model.Matricula;
import com.curso.api.repository.MatriculaRepository;
import com.curso.api.repository.filter.MatriculaFilter;
import com.curso.api.service.MatriculaService;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/matriculas")
public class MatriculaResource {

	@Autowired
	private MatriculaRepository matriculaRepository;

	@Autowired
	private MatriculaService matriculaService;

	@Autowired
	private ApplicationEventPublisher publisher;

	@ApiOperation(value="Insere uma Matricula")
	@PostMapping
	@PreAuthorize("hasAuthority('ROLE_REALIZAR_MATRICULA') and #oauth2.hasScope('write')")
	public ResponseEntity<Matricula> criar(@Valid @RequestBody Matricula matricula, HttpServletResponse response) {
		Matricula matriculaSalva = matriculaService.criar(matricula);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, matriculaSalva.getId()));
		return ResponseEntity.status(HttpStatus.CREATED).body(matriculaSalva);
	}

	@ApiOperation(value="Altera uma Matricula")
	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_REALIZAR_MATRICULA') and #oauth2.hasScope('write')")
	public ResponseEntity<Matricula> atualizar(@PathVariable Long id, @Valid @RequestBody Matricula matricula) {
		try {
			Matricula matriculaSalva = matriculaService.atualizar(id, matricula);
			return ResponseEntity.ok(matriculaSalva);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@ApiOperation(value="Remove uma Matricula")
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('ROLE_REMOVER_MATRICULA') and #oauth2.hasScope('write')")
	public ResponseEntity<Void> remover(@PathVariable Long id) {
		Matricula matricula = matriculaRepository.getOne(id);
		matriculaRepository.delete(matricula);
		return ResponseEntity.noContent().build();
	}

	@ApiOperation(value="Retorna uma Matricula específica")
	@GetMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_MATRICULA') and #oauth2.hasScope('read')")
	public ResponseEntity<Matricula> buscarPeloId(@PathVariable Long id) {
		Matricula matricula = matriculaRepository.getOne(id);
		return matricula != null ? ResponseEntity.ok(matricula) : ResponseEntity.notFound().build();
	}

	@ApiOperation(value="Retorna uma lista de Matriculas")
	@GetMapping
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_MATRICULA') and #oauth2.hasScope('read')")
	public Page<Matricula> pesquisar(MatriculaFilter matriculaFilter, Pageable pageable) {
		return matriculaRepository.filtrar(matriculaFilter, pageable);
	}

}
