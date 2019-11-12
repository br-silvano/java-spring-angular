export class Login {
  usuario: string;
  senha: string;
}

export class Permissao {
  id: number;
  nome: string;
  descricao: string;
  ativo = true;
}

export class Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  ativo = true;
  permissoes: Permissao[] = [];
  unidades: Unidade[] = [];
}

export class Unidade {
  id: number;
  codigo: string;
  nome: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  uf: string;
  ativo = true;
}

export class Curso {
  id: number;
  codigo: string;
  descricao: string;
  valorMensalidade = 0;
  ativo = true;
}

export class Turno {
  id: number;
  codigo: string;
  descricao: string;
  ativo = true;
}

export class Telefone {
  id: number;
  numero: string;
  observacao: string;
}

export class Responsavel {
  id: number;
  tipo = 'FINANCEIRO';
  cpf: string;
  nome: string;
  dataNascimento: Date;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  uf: string;
  ativo = true;
  telefones: Telefone[] = [];
}

export class Aluno {
  id: number;
  cpf: string;
  nome: string;
  dataNascimento: Date;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  uf: string;
  ativo = true;
  telefones: Telefone[] = [];
  responsaveis: Responsavel[] = [];
}

export class StatusTurma {
  id: number;
  codigo: string;
  descricao: string;
}

export class Turma {
  id: number;
  unidade: Unidade = new Unidade();
  codigo: string;
  nome: string;
  curso: Curso = new Curso();
  turno: Turno = new Turno();
  horaInicio: string;
  horaTermino: string;
  statusTurma: StatusTurma = new StatusTurma();
}

export class StatusMatricula {
  id: number;
  codigo: string;
  descricao: string;
}

export class Matricula {
  id: number;
  turma: Turma = new Turma();
  aluno: Aluno = new Aluno();
  valorMensalidade = 0;
  percentualDesconto = 0;
  valorDesconto = 0;
  diaPagamento = 0;
  statusMatricula: StatusMatricula = new StatusMatricula();
}

export class AlteraSenha {
  senha: string;
  novaSenha: string;
  confirmaNovaSenha: string;
}

export class AlteraEmail {
  senha: string;
  novoEmail: string;
  confirmaNovoEmail: string;
}

export interface BuscaCep {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}
