CREATE TABLE status_turma (
	id int NOT NULL AUTO_INCREMENT,
	codigo varchar(30) NOT NULL,
	descricao varchar(50) NOT NULL,
	data_hora_criacao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data_hora_alteracao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ativo bool NOT NULL DEFAULT true,
	PRIMARY KEY (id),
	UNIQUE (codigo)
);

CREATE TABLE status_matricula (
	id int NOT NULL AUTO_INCREMENT,
	codigo varchar(30) NOT NULL,
	descricao varchar(50) NOT NULL,
	data_hora_criacao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data_hora_alteracao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ativo bool NOT NULL DEFAULT true,
	PRIMARY KEY (id),
	UNIQUE (codigo)
);

CREATE TABLE status_pagamento (
	id int NOT NULL AUTO_INCREMENT,
	codigo varchar(30) NOT NULL,
	descricao varchar(50) NOT NULL,
	data_hora_criacao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data_hora_alteracao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ativo bool NOT NULL DEFAULT true,
	PRIMARY KEY (id),
	UNIQUE (codigo)
);

CREATE TABLE turma (
	id int NOT NULL AUTO_INCREMENT,
	id_unidade int NOT NULL,
	codigo varchar(10) NOT NULL,
	nome varchar(50) NOT NULL,
	id_curso int NOT NULL,
	id_turno int NOT NULL,
	hora_inicio time NOT NULL,
	hora_termino time NOT NULL,
	id_usuario_criacao int NOT NULL,
	id_usuario_alteracao int NOT NULL,
	data_hora_criacao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data_hora_alteracao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	id_status_turma int NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (id_unidade, codigo),
	FOREIGN KEY (id_unidade) REFERENCES unidade(id),
	FOREIGN KEY (id_curso) REFERENCES curso(id),
	FOREIGN KEY (id_turno) REFERENCES turno(id),
	FOREIGN KEY (id_usuario_criacao) REFERENCES usuario(id),
	FOREIGN KEY (id_usuario_alteracao) REFERENCES usuario(id),
	FOREIGN KEY (id_status_turma) REFERENCES status_turma(id)
);

CREATE TABLE matricula (
	id int NOT NULL AUTO_INCREMENT,
	id_turma int NOT NULL,
	id_aluno int NOT NULL,
	valor_mensalidade decimal(20,2) NOT NULL,
	percentual_desconto decimal(20,2) NOT NULL,
	valor_desconto decimal(20,2) NOT NULL,
	dia_pagamento smallint NOT NULL,
	id_usuario_criacao int NOT NULL,
	id_usuario_alteracao int NOT NULL,
	data_hora_criacao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data_hora_alteracao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	id_status_matricula int NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (id_turma) REFERENCES turma(id),
	FOREIGN KEY (id_aluno) REFERENCES aluno(id),
	FOREIGN KEY (id_usuario_criacao) REFERENCES usuario(id),
	FOREIGN KEY (id_usuario_alteracao) REFERENCES usuario(id),
	FOREIGN KEY (id_status_matricula) REFERENCES status_matricula(id)
);

CREATE TABLE mensalidade (
	id int NOT NULL AUTO_INCREMENT,
	id_matricula int NOT NULL,
	valor_mensalidade decimal(20,2) NOT NULL,
	percentual_desconto decimal(20,2) NOT NULL,
	valor_desconto decimal(20,2) NOT NULL,
	data_vencimento date NOT NULL,
	data_pagamento date NULL,
	valor_pagamento decimal(20,2) NULL,
	observacao varchar(500) NULL,
	id_usuario_criacao int NOT NULL,
	id_usuario_alteracao int NOT NULL,
	data_hora_criacao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data_hora_alteracao timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	id_status_pagamento int NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (id_matricula) REFERENCES matricula(id),
	FOREIGN KEY (id_usuario_criacao) REFERENCES usuario(id),
	FOREIGN KEY (id_usuario_alteracao) REFERENCES usuario(id),
	FOREIGN KEY (id_status_pagamento) REFERENCES status_pagamento(id)
);

INSERT INTO status_turma (codigo, descricao) VALUES
('MONTANDO', 'Montando'),
('EM_CURSO', 'Em Curso'),
('ENCERRADA', 'Encerrada'),
('CENCELADA', 'Cancelada');

INSERT INTO status_matricula (codigo, descricao) VALUES
('VIGENTE', 'Vigente'),
('ENCERRADA', 'Encerrada'),
('CENCELADA', 'Cancelada');

INSERT INTO status_pagamento (codigo, descricao) VALUES
('PENDENTE', 'Pendente'),
('PAGO', 'Pago'),
('CANCELADO', 'Cancelado');
