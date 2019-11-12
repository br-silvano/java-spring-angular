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
import com.curso.api.model.Turno;
import com.curso.api.repository.TurnoRepository;
import com.curso.api.repository.filter.TurnoFilter;
import com.curso.api.service.TurnoService;
import com.curso.api.service.exception.CodigoJaExisteException;

@RestController
@RequestMapping("/turnos")
public class TurnoResource {

	@Autowired
	private TurnoRepository turnoRepository;

	@Autowired
	private TurnoService turnoService;

	@Autowired
	private ApplicationEventPublisher publisher;

	@Autowired
	private MessageSource messageSource;

	@ApiOperation(value="Insere um Turno")
	@PostMapping
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_TURNO') and #oauth2.hasScope('write')")
	public ResponseEntity<Turno> criar(@Valid @RequestBody Turno turno, HttpServletResponse response) {
		Turno turnoSalvo = turnoService.criar(turno);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, turnoSalvo.getId()));
		return ResponseEntity.status(HttpStatus.CREATED).body(turnoSalvo);
	}

	@ApiOperation(value="Altera um Turno")
	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_TURNO') and #oauth2.hasScope('write')")
	public ResponseEntity<Turno> atualizar(@PathVariable Long id, @Valid @RequestBody Turno turno) {
		try {
			Turno turnoSalvo = turnoService.atualizar(id, turno);
			return ResponseEntity.ok(turnoSalvo);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@ApiOperation(value="Ativa ou Inativa um Turno")
	@PutMapping("/{id}/ativo")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_TURNO') and #oauth2.hasScope('write')")
	public void atualizarPropriedadeAtivo(@PathVariable Long id, @RequestBody Boolean ativo) {
		turnoService.atualizarPropriedadeAtivo(id, ativo);
	}

	@ApiOperation(value="Remove um Turno")
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('ROLE_REMOVER_TURNO') and #oauth2.hasScope('write')")
	public void remover(@PathVariable Long id) {
		Turno turno = turnoRepository.getOne(id);
		turnoRepository.delete(turno);
	}

	@ApiOperation(value="Retorna um Turno específico")
	@GetMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_TURNO') and #oauth2.hasScope('read')")
	public ResponseEntity<Turno> buscarPeloId(@PathVariable Long id) {
		Turno turno = turnoRepository.getOne(id);
		return turno != null ? ResponseEntity.ok(turno) : ResponseEntity.notFound().build();
	}

	@ApiOperation(value="Retorna uma lista de Turnos")
	@GetMapping
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_TURNO') and #oauth2.hasScope('read')")
	public Page<Turno> pesquisar(TurnoFilter turnoFilter, Pageable pageable) {
		return turnoRepository.filtrar(turnoFilter, pageable);
	}

	@ExceptionHandler({ CodigoJaExisteException.class })
	public ResponseEntity<Object> handleCodigoJaExisteException(CodigoJaExisteException ex) {
		String mensagemUsuario = messageSource.getMessage("codigo-ja-existe", null, LocaleContextHolder.getLocale());
		String mensagemDesenvolvedor = ex.toString();
		List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
		return ResponseEntity.badRequest().body(erros);
	}

}
