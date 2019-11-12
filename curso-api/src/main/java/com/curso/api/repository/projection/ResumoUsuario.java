package com.curso.api.repository.projection;

public class ResumoUsuario {

	private Long id;
	private String nome;
	private String email;
	private Boolean ativo;
	
	public ResumoUsuario(Long id, String nome, String email, Boolean ativo) {
		this.id = id;
		this.nome = nome;
		this.email = email;
		this.ativo = ativo;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Boolean getAtivo() {
		return ativo;
	}

	public void setAtivo(Boolean ativo) {
		this.ativo = ativo;
	}

}
