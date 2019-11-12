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
import com.curso.api.model.Curso;
import com.curso.api.repository.CursoRepository;
import com.curso.api.repository.filter.CursoFilter;
import com.curso.api.service.CursoService;
import com.curso.api.service.exception.CodigoJaExisteException;

@RestController
@RequestMapping("/cursos")
public class CursoResource {

	@Autowired
	private CursoRepository cursoRepository;

	@Autowired
	private CursoService cursoService;

	@Autowired
	private ApplicationEventPublisher publisher;

	@Autowired
	private MessageSource messageSource;

	@ApiOperation(value="Insere um Curso")
	@PostMapping
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_CURSO') and #oauth2.hasScope('write')")
	public ResponseEntity<Curso> criar(@Valid @RequestBody Curso curso, HttpServletResponse response) {
		Curso cursoSalvo = cursoService.criar(curso);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, cursoSalvo.getId()));
		return ResponseEntity.status(HttpStatus.CREATED).body(cursoSalvo);
	}

	@ApiOperation(value="Altera um Curso")
	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_CURSO') and #oauth2.hasScope('write')")
	public ResponseEntity<Curso> atualizar(@PathVariable Long id, @Valid @RequestBody Curso curso) {
		try {
			Curso cursoSalvo = cursoService.atualizar(id, curso);
			return ResponseEntity.ok(cursoSalvo);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@ApiOperation(value="Ativa ou Inativa um Curso")
	@PutMapping("/{id}/ativo")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_CURSO') and #oauth2.hasScope('write')")
	public void atualizarPropriedadeAtivo(@PathVariable Long id, @RequestBody Boolean ativo) {
		cursoService.atualizarPropriedadeAtivo(id, ativo);
	}

	@ApiOperation(value="Remove um Curso")
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('ROLE_REMOVER_CURSO') and #oauth2.hasScope('write')")
	public void remover(@PathVariable Long id) {
		Curso curso = cursoRepository.getOne(id);
		cursoRepository.delete(curso);
	}

	@ApiOperation(value="Retorna um Curso específico")
	@GetMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_CURSO') and #oauth2.hasScope('read')")
	public ResponseEntity<Curso> buscarPeloId(@PathVariable Long id) {
		Curso curso = cursoRepository.getOne(id);
		return curso != null ? ResponseEntity.ok(curso) : ResponseEntity.notFound().build();
	}

	@ApiOperation(value="Retorna uma lista de Cursos")
	@GetMapping
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_CURSO') and #oauth2.hasScope('read')")
	public Page<Curso> pesquisar(CursoFilter cursoFilter, Pageable pageable) {
		return cursoRepository.filtrar(cursoFilter, pageable);
	}

	@ExceptionHandler({ CodigoJaExisteException.class })
	public ResponseEntity<Object> handleCodigoJaExisteException(CodigoJaExisteException ex) {
		String mensagemUsuario = messageSource.getMessage("codigo-ja-existe", null, LocaleContextHolder.getLocale());
		String mensagemDesenvolvedor = ex.toString();
		List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
		return ResponseEntity.badRequest().body(erros);
	}

}
