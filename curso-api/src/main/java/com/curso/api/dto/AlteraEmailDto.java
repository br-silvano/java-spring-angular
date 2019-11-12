package com.curso.api.dto;

import java.util.Objects;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class AlteraEmailDto {

	@NotNull
	@NotBlank
	private String senha;

	@NotNull
	@NotBlank
	private String novoEmail;

	@NotNull
	@NotBlank
	private String confirmaNovoEmail;

	public AlteraEmailDto() {
	}

	public AlteraEmailDto(String senha, String novoEmail, String confirmaNovoEmail) {
		this.senha = senha;
		this.novoEmail = novoEmail;
		this.confirmaNovoEmail = confirmaNovoEmail;
	}

	public String getSenha() {
		return this.senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public String getNovoEmail() {
		return this.novoEmail;
	}

	public void setNovoEmail(String novoEmail) {
		this.novoEmail = novoEmail;
	}

	public String getConfirmaNovoEmail() {
		return this.confirmaNovoEmail;
	}

	public void setConfirmaNovoEmail(String confirmaNovoEmail) {
		this.confirmaNovoEmail = confirmaNovoEmail;
	}

	public AlteraEmailDto senha(String senha) {
		this.senha = senha;
		return this;
	}

	public AlteraEmailDto novoEmail(String novoEmail) {
		this.novoEmail = novoEmail;
		return this;
	}

	public AlteraEmailDto confirmaNovoEmail(String confirmaNovoEmail) {
		this.confirmaNovoEmail = confirmaNovoEmail;
		return this;
	}

	@Override
	public boolean equals(Object o) {
		if (o == this)
			return true;
		if (!(o instanceof AlteraEmailDto)) {
			return false;
		}
		AlteraEmailDto alteraEmailDto = (AlteraEmailDto) o;
		return Objects.equals(senha, alteraEmailDto.senha) && Objects.equals(novoEmail, alteraEmailDto.novoEmail) && Objects.equals(confirmaNovoEmail, alteraEmailDto.confirmaNovoEmail);
	}

	@Override
	public int hashCode() {
		return Objects.hash(senha, novoEmail, confirmaNovoEmail);
	}

	@Override
	public String toString() {
		return "{" +
			" senha='" + getSenha() + "'" +
			", novoEmail='" + getNovoEmail() + "'" +
			", confirmaNovoEmail='" + getConfirmaNovoEmail() + "'" +
			"}";
	}

}
