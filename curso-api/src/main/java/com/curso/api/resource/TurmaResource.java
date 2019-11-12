package com.curso.api.resource;

import io.swagger.annotations.ApiOperation;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.curso.api.event.RecursoCriadoEvent;
import com.curso.api.exceptionhandler.CursoExceptionHandler.Erro;
import com.curso.api.model.Turma;
import com.curso.api.repository.TurmaRepository;
import com.curso.api.repository.filter.TurmaFilter;
import com.curso.api.service.TurmaService;
import com.curso.api.service.exception.CodigoJaExisteException;

@RestController
@RequestMapping("/turmas")
public class TurmaResource {

	@Autowired
	private TurmaRepository turmaRepository;

	@Autowired
	private TurmaService turmaService;

	@Autowired
	private ApplicationEventPublisher publisher;

	@Autowired
	private MessageSource messageSource;

	@ApiOperation(value="Insere uma Turma")
	@PostMapping
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_TURMA') and #oauth2.hasScope('write')")
	public ResponseEntity<Turma> criar(@Valid @RequestBody Turma turma, HttpServletResponse response) {
		Turma turmaSalva = turmaService.criar(turma);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, turmaSalva.getId()));
		return ResponseEntity.status(HttpStatus.CREATED).body(turmaSalva);
	}

	@ApiOperation(value="Altera uma Turma")
	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_TURMA') and #oauth2.hasScope('write')")
	public ResponseEntity<Turma> atualizar(@PathVariable Long id, @Valid @RequestBody Turma turma) {
		try {
			Turma turmaSalva = turmaService.atualizar(id, turma);
			return ResponseEntity.ok(turmaSalva);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@ApiOperation(value="Remove uma Turma")
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('ROLE_REMOVER_TURMA') and #oauth2.hasScope('write')")
	public void remover(@PathVariable Long id) {
		Turma turma = turmaRepository.getOne(id);
		turmaRepository.delete(turma);
	}

	@ApiOperation(value="Retorna uma Turma específica")
	@GetMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_TURMA') and #oauth2.hasScope('read')")
	public ResponseEntity<Turma> buscarPeloId(@PathVariable Long id) {
		Turma turma = turmaRepository.getOne(id);
		return turma != null ? ResponseEntity.ok(turma) : ResponseEntity.notFound().build();
	}

	@ApiOperation(value="Retorna uma lista de Turmas")
	@GetMapping
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_TURMA') and #oauth2.hasScope('read')")
	public Page<Turma> pesquisar(TurmaFilter turmaFilter, Pageable pageable) {
		return turmaRepository.filtrar(turmaFilter, pageable);
	}

	@ExceptionHandler({ CodigoJaExisteException.class })
	public ResponseEntity<Object> handleCodigoJaExisteException(CodigoJaExisteException ex) {
		String mensagemUsuario = messageSource.getMessage("codigo-ja-existe", null, LocaleContextHolder.getLocale());
		String mensagemDesenvolvedor = ex.toString();
		List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
		return ResponseEntity.badRequest().body(erros);
	}

}
