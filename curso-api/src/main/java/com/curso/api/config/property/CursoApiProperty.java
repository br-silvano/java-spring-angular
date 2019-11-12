package com.curso.api.config.property;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("curso")
public class CursoApiProperty {

	private String originPermitida;

	private final Seguranca seguranca = new Seguranca();
	
	public Seguranca getSeguranca() {
		return seguranca;
	}
	
	public String getOriginPermitida() {
		return originPermitida;
	}

	public void setOriginPermitida(String originPermitida) {
		this.originPermitida = originPermitida;
	}

	public static class Seguranca {

		private String signingKey;
		
		private Integer accessTokenValiditySeconds;

		private Integer refreshTokenValiditySeconds;
		
		private boolean enableHttps;

		public String getSigningKey() {
			return signingKey;
		}

		public void setSigningKey(String signingKey) {
			this.signingKey = signingKey;
		}

		public Integer getAccessTokenValiditySeconds() {
			return accessTokenValiditySeconds;
		}

		public void setAccessTokenValiditySeconds(Integer accessTokenValiditySeconds) {
			this.accessTokenValiditySeconds = accessTokenValiditySeconds;
		}

		public Integer getRefreshTokenValiditySeconds() {
			return refreshTokenValiditySeconds;
		}

		public void setRefreshTokenValiditySeconds(Integer refreshTokenValiditySeconds) {
			this.refreshTokenValiditySeconds = refreshTokenValiditySeconds;
		}

		public boolean isEnableHttps() {
			return enableHttps;
		}

		public void setEnableHttps(boolean enableHttps) {
			this.enableHttps = enableHttps;
		}

	}

}
