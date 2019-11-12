CREATE TABLE unidade (
	id int NOT NULL AUTO_INCREMENT,
	codigo varchar(10) NOT NULL,
	nome varchar(50) NOT NULL,
	cep char(9) NOT NULL,
	logradouro varchar(50) NOT NULL,
	numero varchar(20) NOT NULL,
	bairro varchar(50) NOT NULL,
	complemento varchar(50) NULL,
	cidade varchar(50) NOT NULL,
	uf char(2) NOT NULL,
	id_usuario_criacao int NOT NULL,
	id_usuario_alteracao int NOT NULL,
	data_hora_criacao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data_hora_alteracao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ativo bool NOT NULL DEFAULT true,
	PRIMARY KEY (id),
	UNIQUE (codigo),
	FOREIGN KEY (id_usuario_criacao) REFERENCES usuario(id),
	FOREIGN KEY (id_usuario_alteracao) REFERENCES usuario(id)
);

CREATE TABLE usuario_unidade (
	id_usuario int NOT NULL,
	id_unidade int NOT NULL,
	PRIMARY KEY (id_usuario, id_unidade),
	FOREIGN KEY (id_usuario) REFERENCES usuario(id),
	FOREIGN KEY (id_unidade) REFERENCES unidade(id)
);

CREATE TABLE curso (
	id int NOT NULL AUTO_INCREMENT,
	codigo varchar(10) NOT NULL,
	descricao varchar(50) NOT NULL,
	valor_mensalidade decimal(20,2) NOT NULL,
	id_usuario_criacao int NOT NULL,
	id_usuario_alteracao int NOT NULL,
	data_hora_criacao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data_hora_alteracao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ativo bool NOT NULL DEFAULT true,
	PRIMARY KEY (id),
	UNIQUE (codigo),
	FOREIGN KEY (id_usuario_criacao) REFERENCES usuario(id),
	FOREIGN KEY (id_usuario_alteracao) REFERENCES usuario(id)
);

CREATE TABLE turno (
	id int NOT NULL AUTO_INCREMENT,
	codigo varchar(10) NOT NULL,
	descricao varchar(50) NOT NULL,
	id_usuario_criacao int NOT NULL,
	id_usuario_alteracao int NOT NULL,
	data_hora_criacao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data_hora_alteracao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ativo bool NOT NULL DEFAULT true,
	PRIMARY KEY (id),
	UNIQUE (codigo),
	FOREIGN KEY (id_usuario_criacao) REFERENCES usuario(id),
	FOREIGN KEY (id_usuario_alteracao) REFERENCES usuario(id)
);

CREATE TABLE aluno (
	id int NOT NULL AUTO_INCREMENT,
	cpf varchar(14) NOT NULL,
	nome varchar(50) NOT NULL,
	data_nascimento date NOT NULL,
	email varchar(50) NULL,
	cep char(9) NOT NULL,
	logradouro varchar(50) NOT NULL,
	numero varchar(20) NOT NULL,
	bairro varchar(50) NOT NULL,
	complemento varchar(50) NULL,
	cidade varchar(50) NOT NULL,
	uf char(2) NOT NULL,
	id_usuario_criacao int NOT NULL,
	id_usuario_alteracao int NOT NULL,
	data_hora_criacao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data_hora_alteracao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ativo bool NOT NULL DEFAULT true,
	PRIMARY KEY (id),
	UNIQUE (cpf),
	FOREIGN KEY (id_usuario_criacao) REFERENCES usuario(id),
	FOREIGN KEY (id_usuario_alteracao) REFERENCES usuario(id)
);

CREATE TABLE aluno_telefone (
	id int NOT NULL AUTO_INCREMENT,
	id_aluno int NOT NULL,
	numero varchar(15) NOT NULL,
	observacao varchar(50) NULL,
	PRIMARY KEY (id),
	UNIQUE (id_aluno, numero),
	FOREIGN KEY (id_aluno) REFERENCES aluno(id)
);

CREATE TABLE responsavel (
	id int NOT NULL AUTO_INCREMENT,
	id_aluno int NOT NULL,
	tipo varchar(20) NOT NULL,
	cpf varchar(14) NULL,
	nome varchar(50) NOT NULL,
	data_nascimento date NULL,
	email varchar(50) NULL,
	cep char(9) NOT NULL,
	logradouro varchar(50) NOT NULL,
	numero varchar(20) NOT NULL,
	bairro varchar(50) NOT NULL,
	complemento varchar(50) NULL,
	cidade varchar(50) NOT NULL,
	uf char(2) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (id_aluno, tipo),
	FOREIGN KEY (id_aluno) REFERENCES aluno(id)
);

CREATE TABLE responsavel_telefone (
	id int NOT NULL AUTO_INCREMENT,
	id_responsavel int NOT NULL,
	numero varchar(15) NOT NULL,
	observacao varchar(50) NULL,
	PRIMARY KEY (id),
	UNIQUE (id_responsavel, numero),
	FOREIGN KEY (id_responsavel) REFERENCES responsavel(id)
);
