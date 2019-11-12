package com.curso.api.dto;

import java.util.Objects;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class AlteraSenhaDto {

	private String senha;

	@NotNull
	@NotEmpty
	private String novaSenha;

	@NotNull
	@NotEmpty
	private String confirmaNovaSenha;

	public AlteraSenhaDto() {
	}

	public AlteraSenhaDto(String senha, String novaSenha, String confirmaNovaSenha) {
		this.senha = senha;
		this.novaSenha = novaSenha;
		this.confirmaNovaSenha = confirmaNovaSenha;
	}

	public String getSenha() {
		return this.senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public String getNovaSenha() {
		return this.novaSenha;
	}

	public void setNovaSenha(String novaSenha) {
		this.novaSenha = novaSenha;
	}

	public String getConfirmaNovaSenha() {
		return this.confirmaNovaSenha;
	}

	public void setConfirmaNovaSenha(String confirmaNovaSenha) {
		this.confirmaNovaSenha = confirmaNovaSenha;
	}

	public AlteraSenhaDto senha(String senha) {
		this.senha = senha;
		return this;
	}

	public AlteraSenhaDto novaSenha(String novaSenha) {
		this.novaSenha = novaSenha;
		return this;
	}

	public AlteraSenhaDto confirmaNovaSenha(String confirmaNovaSenha) {
		this.confirmaNovaSenha = confirmaNovaSenha;
		return this;
	}

	@Override
	public boolean equals(Object o) {
		if (o == this)
			return true;
		if (!(o instanceof AlteraSenhaDto)) {
			return false;
		}
		AlteraSenhaDto alteraSenha = (AlteraSenhaDto) o;
		return Objects.equals(senha, alteraSenha.senha) && Objects.equals(novaSenha, alteraSenha.novaSenha) && Objects.equals(confirmaNovaSenha, alteraSenha.confirmaNovaSenha);
	}

	@Override
	public int hashCode() {
		return Objects.hash(senha, novaSenha, confirmaNovaSenha);
	}

	@Override
	public String toString() {
		return "{" +
			" senha='" + getSenha() + "'" +
			", novaSenha='" + getNovaSenha() + "'" +
			", confirmaNovaSenha='" + getConfirmaNovaSenha() + "'" +
			"}";
	}

}
