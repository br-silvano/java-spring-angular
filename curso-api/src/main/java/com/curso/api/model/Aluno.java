package com.curso.api.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "aluno")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Aluno {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	private String cpf;

	@NotNull
	private String nome;

	@NotNull
	@Column(name = "data_nascimento")
	private LocalDate dataNascimento;

	private String email;

	@NotNull
	private String cep;

	@NotNull
	private String logradouro;

	@NotNull
	private String numero;

	@NotNull
	private String bairro;

	private String complemento;

	@NotNull
	private String cidade;

	@NotNull
	private String uf;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "id_usuario_criacao")
	private Usuario usuarioCriacao;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "id_usuario_alteracao")
	private Usuario usuarioAlteracao;

	@JsonIgnore
	@Column(name = "data_hora_criacao")
	private LocalDateTime dataHoraCriacao;

	@JsonIgnore
	@Column(name = "data_hora_alteracao")
	private LocalDateTime dataHoraAlteracao;

	private Boolean ativo;

	@OneToMany(fetch = FetchType.LAZY, targetEntity = AlunoTelefone.class, mappedBy = "aluno")
	private List<AlunoTelefone> telefones;

	@OneToMany(fetch = FetchType.LAZY, targetEntity = Responsavel.class, mappedBy = "aluno")
	private List<Responsavel> responsaveis;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public LocalDate getDataNascimento() {
		return dataNascimento;
	}

	public void setDataNascimento(LocalDate dataNascimento) {
		this.dataNascimento = dataNascimento;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCep() {
		return cep;
	}

	public void setCep(String cep) {
		this.cep = cep;
	}

	public String getLogradouro() {
		return logradouro;
	}

	public void setLogradouro(String logradouro) {
		this.logradouro = logradouro;
	}

	public String getNumero() {
		return numero;
	}

	public void setNumero(String numero) {
		this.numero = numero;
	}

	public String getBairro() {
		return bairro;
	}

	public void setBairro(String bairro) {
		this.bairro = bairro;
	}

	public String getComplemento() {
		return complemento;
	}

	public void setComplemento(String complemento) {
		this.complemento = complemento;
	}

	public String getCidade() {
		return cidade;
	}

	public void setCidade(String cidade) {
		this.cidade = cidade;
	}

	public String getUf() {
		return uf;
	}

	public void setUf(String uf) {
		this.uf = uf;
	}

	public Usuario getUsuarioCriacao() {
		return usuarioCriacao;
	}

	public void setUsuarioCriacao(Usuario usuarioCriacao) {
		this.usuarioCriacao = usuarioCriacao;
	}

	public Usuario getUsuarioAlteracao() {
		return usuarioAlteracao;
	}

	public void setUsuarioAlteracao(Usuario usuarioAlteracao) {
		this.usuarioAlteracao = usuarioAlteracao;
	}

	public LocalDateTime getDataHoraCriacao() {
		return dataHoraCriacao;
	}

	public void setDataHoraCriacao(LocalDateTime dataHoraCriacao) {
		this.dataHoraCriacao = dataHoraCriacao;
	}

	public LocalDateTime getDataHoraAlteracao() {
		return dataHoraAlteracao;
	}

	public void setDataHoraAlteracao(LocalDateTime dataHoraAlteracao) {
		this.dataHoraAlteracao = dataHoraAlteracao;
	}

	public Boolean getAtivo() {
		return ativo;
	}

	public void setAtivo(Boolean ativo) {
		this.ativo = ativo;
	}

	public List<AlunoTelefone> getTelefones() {
		return telefones;
	}

	public void setTelefones(List<AlunoTelefone> telefones) {
		this.telefones = telefones;
		telefones.forEach(a -> a.setAluno(this));
	}

	public List<Responsavel> getResponsaveis() {
		return responsaveis;
	}

	public void setResponsaveis(List<Responsavel> responsaveis) {
		this.responsaveis = responsaveis;
		responsaveis.forEach(a -> a.setAluno(this));
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Aluno other = (Aluno) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

}
