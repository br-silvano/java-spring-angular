CREATE TABLE usuario (
	id int NOT NULL AUTO_INCREMENT,
	nome varchar(50) NOT NULL,
	email varchar(50) NOT NULL,
	senha varchar(150) NOT NULL,
	data_hora_criacao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data_hora_alteracao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ativo bool NOT NULL DEFAULT true,
	UNIQUE (email),
	PRIMARY KEY (id)
);

CREATE TABLE permissao (
	id int NOT NULL AUTO_INCREMENT,
	nome varchar(50) NOT NULL,
	descricao varchar(50) NOT NULL,
	data_hora_criacao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data_hora_alteracao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ativo bool NOT NULL DEFAULT true,
	UNIQUE (nome),
	PRIMARY KEY (id)
);

CREATE TABLE usuario_permissao (
	id_usuario int NOT NULL,
	id_permissao int NOT NULL,
	PRIMARY KEY (id_usuario, id_permissao),
	FOREIGN KEY (id_permissao) REFERENCES permissao(id),
	FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

INSERT INTO usuario (nome, email, senha) VALUES
('Teste', 'teste@teste.com.br', '{bcrypt}$2a$10$4Orn9nHzwlmrpQNUtgtV8.aB8Ql6moxkBJjv2LXhWuMooENx25wAC');

INSERT INTO permissao (nome, descricao) VALUES
('ROLE_CADASTRAR_USUARIO', 'Cadastrar Usuário'),
('ROLE_PESQUISAR_USUARIO', 'Pesquisar Usuário'),
('ROLE_CADASTRAR_UNIDADE', 'Cadastrar Unidade'),
('ROLE_PESQUISAR_UNIDADE', 'Pesquisar Unidade'),
('ROLE_CADASTRAR_CURSO', 'Cadastrar Curso'),
('ROLE_PESQUISAR_CURSO', 'Pesquisar Curso'),
('ROLE_CADASTRAR_TURNO', 'Cadastrar Turno'),
('ROLE_PESQUISAR_TURNO', 'Pesquisar Turno'),
('ROLE_CADASTRAR_ALUNO', 'Cadastrar Aluno'),
('ROLE_PESQUISAR_ALUNO', 'Pesquisar Aluno'),
('ROLE_CADASTRAR_TURMA', 'Cadastrar Turma'),
('ROLE_PESQUISAR_TURMA', 'Pesquisar Turma'),
('ROLE_REALIZAR_MATRICULA', 'Realizar Matrícula'),
('ROLE_PESQUISAR_MATRICULA', 'Pesquisar Matrícula');

INSERT INTO usuario_permissao (id_usuario, id_permissao)
SELECT 1, id FROM permissao;
