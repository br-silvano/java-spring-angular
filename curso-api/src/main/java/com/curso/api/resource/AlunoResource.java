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
import com.curso.api.model.Aluno;
import com.curso.api.repository.AlunoRepository;
import com.curso.api.repository.filter.AlunoFilter;
import com.curso.api.service.AlunoService;
import com.curso.api.service.exception.CpfInvalidoException;
import com.curso.api.service.exception.CpfJaExisteException;
import com.curso.api.service.exception.DadosInvalidosException;
import com.curso.api.service.exception.TelefoneDuplicadoException;
import com.curso.api.service.exception.TelefoneInvalidoException;

@RestController
@RequestMapping("/alunos")
public class AlunoResource {

	@Autowired
	private AlunoRepository alunoRepository;

	@Autowired
	private AlunoService alunoService;

	@Autowired
	private ApplicationEventPublisher publisher;

	@Autowired
	private MessageSource messageSource;

	@ApiOperation(value="Insere um Aluno")
	@PostMapping
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_ALUNO') and #oauth2.hasScope('write')")
	public ResponseEntity<Aluno> criar(@Valid @RequestBody Aluno aluno, HttpServletResponse response) {
		Aluno alunoSalvo = alunoService.criar(aluno);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, alunoSalvo.getId()));
		return ResponseEntity.status(HttpStatus.CREATED).body(alunoSalvo);
	}

	@ApiOperation(value="Altera um Aluno")
	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_ALUNO') and #oauth2.hasScope('write')")
	public ResponseEntity<Aluno> atualizar(@PathVariable Long id, @Valid @RequestBody Aluno aluno) {
		try {
			Aluno alunoSalvo = alunoService.atualizar(id, aluno);
			return ResponseEntity.ok(alunoSalvo);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@ApiOperation(value="Ativa ou Inativa um Aluno")
	@PutMapping("/{id}/ativo")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_ALUNO') and #oauth2.hasScope('write')")
	public void atualizarPropriedadeAtivo(@PathVariable Long id, @RequestBody Boolean ativo) {
		alunoService.atualizarPropriedadeAtivo(id, ativo);
	}

	@ApiOperation(value="Remove um Aluno")
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('ROLE_REMOVER_ALUNO') and #oauth2.hasScope('write')")
	public void remover(@PathVariable Long id) {
		Aluno aluno = alunoRepository.getOne(id);
		alunoRepository.delete(aluno);
	}

	@ApiOperation(value="Retorna um Aluno específica")
	@GetMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_ALUNO') and #oauth2.hasScope('read')")
	public ResponseEntity<Aluno> buscarPeloId(@PathVariable Long id) {
		Aluno aluno = alunoRepository.getOne(id);
		return aluno != null ? ResponseEntity.ok(aluno) : ResponseEntity.notFound().build();
	}

	@ApiOperation(value="Retorna uma lista de Alunos")
	@GetMapping
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_ALUNO') and #oauth2.hasScope('read')")
	public Page<Aluno> pesquisar(AlunoFilter alunoFilter, Pageable pageable) {
		return alunoRepository.filtrar(alunoFilter, pageable);
	}

	@ExceptionHandler({ DadosInvalidosException.class })
	public ResponseEntity<Object> handleDadosInvalidosException(DadosInvalidosException ex) {
		String mensagemUsuario = messageSource.getMessage("dados-invalidos", null, LocaleContextHolder.getLocale());
		String mensagemDesenvolvedor = ex.toString();
		List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
		return ResponseEntity.badRequest().body(erros);
	}

	@ExceptionHandler({ CpfInvalidoException.class })
	public ResponseEntity<Object> handleCpfInvalidoException(CpfInvalidoException ex) {
		String mensagemUsuario = messageSource.getMessage("cpf-invalido", null, LocaleContextHolder.getLocale());
		String mensagemDesenvolvedor = ex.toString();
		List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
		return ResponseEntity.badRequest().body(erros);
	}

	@ExceptionHandler({ CpfJaExisteException.class })
	public ResponseEntity<Object> handleCpfJaExisteException(CpfJaExisteException ex) {
		String mensagemUsuario = messageSource.getMessage("cpf-ja-existe", null, LocaleContextHolder.getLocale());
		String mensagemDesenvolvedor = ex.toString();
		List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
		return ResponseEntity.badRequest().body(erros);
	}

	@ExceptionHandler({ TelefoneDuplicadoException.class })
	public ResponseEntity<Object> handleTelefoneDuplicadoException(TelefoneDuplicadoException ex) {
		String mensagemUsuario = messageSource.getMessage("telefone-duplicado", null, LocaleContextHolder.getLocale());
		String mensagemDesenvolvedor = ex.toString();
		List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
		return ResponseEntity.badRequest().body(erros);
	}

	@ExceptionHandler({ TelefoneInvalidoException.class })
	public ResponseEntity<Object> handleTelefoneInvalidoException(TelefoneInvalidoException ex) {
		String mensagemUsuario = messageSource.getMessage("telefone-invalido", null, LocaleContextHolder.getLocale());
		String mensagemDesenvolvedor = ex.toString();
		List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
		return ResponseEntity.badRequest().body(erros);
	}

}
