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

import com.curso.api.dto.AlteraEmailDto;
import com.curso.api.dto.AlteraSenhaDto;
import com.curso.api.event.RecursoCriadoEvent;
import com.curso.api.exceptionhandler.CursoExceptionHandler.Erro;
import com.curso.api.model.Usuario;
import com.curso.api.repository.UsuarioRepository;
import com.curso.api.repository.filter.UsuarioFilter;
import com.curso.api.repository.projection.ResumoUsuario;
import com.curso.api.service.UsuarioService;
import com.curso.api.service.exception.DadosInvalidosException;
import com.curso.api.service.exception.EmailInvalidoException;
import com.curso.api.service.exception.EmailJaExisteException;
import com.curso.api.service.exception.SenhaInvalidaException;

@RestController
@RequestMapping("/usuarios")
public class UsuarioResource {

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private UsuarioService usuarioService;

	@Autowired
	private ApplicationEventPublisher publisher;

	@Autowired
	private MessageSource messageSource;

	@ApiOperation(value="Insere um Usuário")
	@PostMapping
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_USUARIO') and #oauth2.hasScope('write')")
	public ResponseEntity<Usuario> criar(@Valid @RequestBody Usuario usuario, HttpServletResponse response) {
		Usuario usuarioSalvo = usuarioService.criar(usuario);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, usuarioSalvo.getId()));
		return ResponseEntity.status(HttpStatus.CREATED).body(usuarioSalvo);
	}

	@ApiOperation(value="Altera um Usuário")
	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_USUARIO') and #oauth2.hasScope('write')")
	public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @Valid @RequestBody Usuario usuario) {
		try {
			Usuario usuarioSalvo = usuarioService.atualizar(id, usuario);
			return ResponseEntity.ok(usuarioSalvo);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@ApiOperation(value="Ativa ou Inativa um Usuário")
	@PutMapping("/{id}/ativo")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_USUARIO') and #oauth2.hasScope('write')")
	public void atualizarPropriedadeAtivo(@PathVariable Long id, @RequestBody Boolean ativo) {
		usuarioService.atualizarPropriedadeAtivo(id, ativo);
	}

	@ApiOperation(value="Remove um Usuário")
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('ROLE_REMOVER_USUARIO') and #oauth2.hasScope('write')")
	public void remover(@PathVariable Long id) {
		Usuario usuario = usuarioRepository.getOne(id);
		usuarioRepository.delete(usuario);
	}

	@ApiOperation(value="Retorna um Usuário específico")
	@GetMapping("/{id}")
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_USUARIO') and #oauth2.hasScope('read')")
	public ResponseEntity<Usuario> buscarPeloId(@PathVariable Long id) {
		Usuario usuario = usuarioRepository.getOne(id);
		return usuario != null ? ResponseEntity.ok(usuario) : ResponseEntity.notFound().build();
	}

	@ApiOperation(value="Retorna uma lista de Usuários")
	@GetMapping
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_USUARIO') and #oauth2.hasScope('read')")
	public Page<Usuario> pesquisar(UsuarioFilter usuarioFilter, Pageable pageable) {
		return usuarioRepository.filtrar(usuarioFilter, pageable);
	}

	@ApiOperation(value="Retorna uma lista resumida de Usuários")
	@GetMapping(params = "resumo")
	@PreAuthorize("hasAuthority('ROLE_PESQUISAR_USUARIO') and #oauth2.hasScope('read')")
	public Page<ResumoUsuario> resumir(UsuarioFilter usuarioFilter, Pageable pageable) {
		return usuarioRepository.resumir(usuarioFilter, pageable);
	}

	@ApiOperation(value="Altera a senha de um Usuário")
	@PutMapping("/{id:[\\d]+}/alterar-senha")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAuthority('ROLE_CADASTRAR_USUARIO') and #oauth2.hasScope('write')")
	public void alterarSenha(@PathVariable Long id, @Valid @RequestBody AlteraSenhaDto alteraSenha) {
		usuarioService.alterarSenha(id, alteraSenha);
	}

	@ApiOperation(value="Usuário logado altera sua própria senha")
	@PutMapping("/alterar-senha")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("#oauth2.hasScope('read') or #oauth2.hasScope('write')")
	public void alterarSenha(@Valid @RequestBody AlteraSenhaDto alteraSenha) {
		usuarioService.alterarSenha(alteraSenha);
	}

	@ApiOperation(value="Usuário logado altera seu próprio e-mail")
	@PutMapping("/alterar-email")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("#oauth2.hasScope('read') or #oauth2.hasScope('write')")
	public void alterarEmail(@Valid @RequestBody AlteraEmailDto alteraEmail) {
		usuarioService.alterarEmail(alteraEmail);
	}

	@ExceptionHandler({ DadosInvalidosException.class })
	public ResponseEntity<Object> handleDadosInvalidosException(DadosInvalidosException ex) {
		String mensagemUsuario = messageSource.getMessage("dados-invalidos", null, LocaleContextHolder.getLocale());
		String mensagemDesenvolvedor = ex.toString();
		List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
		return ResponseEntity.badRequest().body(erros);
	}

	@ExceptionHandler({ EmailInvalidoException.class })
	public ResponseEntity<Object> handleEmailInvalidoException(EmailInvalidoException ex) {
		String mensagemUsuario = messageSource.getMessage("email-invalido", null, LocaleContextHolder.getLocale());
		String mensagemDesenvolvedor = ex.toString();
		List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
		return ResponseEntity.badRequest().body(erros);
	}

	@ExceptionHandler({ SenhaInvalidaException.class })
	public ResponseEntity<Object> handleSenhaInvalidaException(SenhaInvalidaException ex) {
		String mensagemUsuario = messageSource.getMessage("senha-invalida", null, LocaleContextHolder.getLocale());
		String mensagemDesenvolvedor = ex.toString();
		List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
		return ResponseEntity.badRequest().body(erros);
	}

	@ExceptionHandler({ EmailJaExisteException.class })
	public ResponseEntity<Object> handleEmailJaExisteException(EmailJaExisteException ex) {
		String mensagemUsuario = messageSource.getMessage("email-ja-existe", null, LocaleContextHolder.getLocale());
		String mensagemDesenvolvedor = ex.toString();
		List<Erro> erros = Arrays.asList(new Erro(mensagemUsuario, mensagemDesenvolvedor));
		return ResponseEntity.badRequest().body(erros);
	}

}
