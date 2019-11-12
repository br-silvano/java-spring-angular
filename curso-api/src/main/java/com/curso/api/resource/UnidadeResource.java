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
import com.curso.api.model.Unidade;
import com.curso.api.repository.UnidadeRepository;
import com.curso.api.repository.filter.UnidadeFilter;
import com.curso.api.service.UnidadeService;
import com.curso.api.service.exception.CodigoJaExisteException;

@RestController
@RequestMapping("/unidades")
public class UnidadeResource {

	@Autowired
	private UnidadeRepository unidadeRepository;

	@Autowired
	private UnidadeService unidadeService;

	@Autowired
	private ApplicationEventPublisher publisher;

	@Autowired
	private MessageSource messageSource;

	@ApiOperation(value="Insere uma Unidade")
	@PostMapping
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_UNIDADE') and #oauth2.hasScope('write')")
	public ResponseEntity<Unidade> criar(@Valid @RequestBody Unidade unidade, HttpServletResponse response) {
		Unidade unidadeSalva = unidadeService.criar(unidade);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, unidadeSalva.getId()));
		return ResponseEntity.status(HttpStatus.CREATED).body(unidadeSalva);
	}

	@ApiOperation(value="Altera uma Unidade")
	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_UNIDADE') and #oauth2.hasScope('write')")
	public ResponseEntity<Unidade> atualizar(@PathVariable Long id, @Valid @RequestBody Unidade unidade) {
		try {
			Unidade unidadeSalva = unidadeService.atualizar(id, unidade);
			return ResponseEntity.ok(unidadeSalva);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@ApiOperation(value="Ativa ou Inativa uma Unidade")
	@PutMapping("/{id}/ativo")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_UNIDADE') and #oauth2.hasScope('write')")
	public void atualizarPropriedadeAtivo(@PathVariable Long id, @RequestBody Boolean ativo) {
		unidadeService.atualizarPropriedadeAtivo(id, ativo);
	}

	@ApiOperation(value="Remove uma Unidade")
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('ROLE_REMOVER_UNIDADE') and #oauth2.hasScope('write')")
	public void remover(@PathVariable Long id) {
		Unidade unidade = unidadeRepository.getOne(id);
		unidadeRepository.delete(unidade);
	}

	@ApiOperation(value="Retorna uma Unidade específica")
	@GetMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_UNIDADE') and #oauth2.hasScope('read')")
	public ResponseEntity<Unidade> buscarPeloId(@PathVariable Long id) {
		Unidade unidade = unidadeRepository.getOne(id);
		return unidade != null ? ResponseEntity.ok(unidade) : ResponseEntity.notFound().build();
	}

	@ApiOperation(value="Retorna uma lista de Unidades")
	@GetMapping
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_UNIDADE') and #oauth2.hasScope('read')")
	public Page<Unidade> pesquisar(UnidadeFilter unidadeFilter, Pageable pageable) {
		return unidadeRepository.filtrar(unidadeFilter, pageable);
	}

	@ApiOperation(value="Retorna uma lista de Todas Unidades")
	@GetMapping(params = "todas")
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_UNIDADE') and #oauth2.hasScope('read')")
	public List<Unidade> pesquisar() {
		return unidadeRepository.findAll();
	}

	@ExceptionHandler({ CodigoJaExisteException.class })
	public ResponseEntity<Object> handleCodigoJaExisteException(CodigoJaExisteException ex) {
		String mensagemUsuario = messageSource.getMessage("codigo-ja-existe", null, LocaleContextHolder.getLocale());
		String mensagemDesenvolvedor = ex.toString();
		List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
		return ResponseEntity.badRequest().body(erros);
	}

}
