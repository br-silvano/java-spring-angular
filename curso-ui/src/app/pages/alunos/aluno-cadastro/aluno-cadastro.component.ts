import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, AbstractControl } from '@angular/forms';

import { ConfirmationService } from 'primeng/components/common/api';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { CalendarService } from '../../../core/services/calendar.service';
import { AlunoService } from '../../../core/services/aluno.service';
import { CepService } from '../../../core/services/cep.service';

import { Aluno, BuscaCep } from '../../../core/types/model';
import { Telefone } from '../../../core/types/model';
import { Responsavel } from '../../../core/types/model';
import { CpfPattern, ValidaCPF } from './../../../core/validators/cpf';
import { EmailPattern } from './../../../core/validators/email';
import { TelefonePattern } from './../../../core/validators/telefone';
import { CepPattern } from './../../../core/validators/cep';

@Component({
  selector: 'app-aluno-cadastro',
  templateUrl: './aluno-cadastro.component.html'
})
export class AlunoCadastroComponent implements OnInit {

  public loading = false;

  tipos = [
    { label: 'Pai', value: 'PAI' },
    { label: 'Mãe', value: 'MAE' },
    { label: 'Padrasto', value: 'PADRASTO' },
    { label: 'Madrasta', value: 'MADRASTA' },
    { label: 'Financeiro', value: 'FINANCEIRO' }
  ];

  aluno: Aluno = new Aluno();
  alunoForm: FormGroup;
  dadosAlterados = false;
  calendarLocale: any;

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private alunoService: AlunoService,
    private cepService: CepService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private calendar: CalendarService,
    private route: ActivatedRoute,
    private router: Router,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  static equalsAlunoTo(group: AbstractControl): {[key: string]: boolean} {
    const cpf = group.get('cpf');
    if (!cpf) {
      return undefined;
    }
    if (cpf.value !== '') {
      if (CpfPattern().test(cpf.value)) {
        const cpfValue = cpf.value.replace(/[^0-9]/g, '');
        if (!ValidaCPF(cpfValue)) {
          return {alunoNotMatch: true};
        }
      } else {
        return {alunoNotMatch: true};
      }
    }
    return undefined;
  }

  static equalsResponsavelTo(group: AbstractControl): {[key: string]: boolean} {
    const tipo = group.get('tipo');
    const cpf = group.get('cpf');
    const dataNascimento = group.get('dataNascimento');
    if (!tipo || !cpf || !dataNascimento) {
      return undefined;
    }
    if (tipo.value === 'FINANCEIRO' && (cpf.value === '' || dataNascimento.value === null)) {
      return {responsavelNotMatch: true};
    }
    if (cpf.value !== '') {
      if (CpfPattern().test(cpf.value)) {
        const cpfValue = cpf.value.replace(/[^0-9]/g, '');
        if (!ValidaCPF(cpfValue)) {
          return {responsavelNotMatch: true};
        }
      } else {
        return {responsavelNotMatch: true};
      }
    }
    return undefined;
  }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Novo Aluno'));

    this.alunoForm = this.formBuilder.group({
      cpf: ['', [Validators.required, Validators.pattern(CpfPattern())]],
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      dataNascimento: ['', [Validators.required]],
      email: ['', [Validators.pattern(EmailPattern()), Validators.minLength(5), Validators.maxLength(50)]],
      cep: ['', [Validators.required]],
      logradouro: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      numero: ['', [Validators.required, Validators.maxLength(20)]],
      bairro: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      complemento: ['', [Validators.minLength(5), Validators.maxLength(50)]],
      cidade: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      uf: ['', [Validators.required]],
      telefones: this.formBuilder.array([
        this.inicializaTelefone()
      ]),
      responsaveis: this.formBuilder.array([
        this.inicializaResponsavel()
      ])
    }, { validator: AlunoCadastroComponent.equalsAlunoTo });

    this.calendarLocale = this.calendar.locale();
    const idAluno = this.route.snapshot.params['id'];

    if (idAluno) {
      this.title.setTitle(this.conteudo.titulo(`Edição de Aluno`));
      this.carregarAluno(idAluno);
    }

    this.onChanges();
  }

  inicializaTelefone() {
    return this.formBuilder.group({
      id: [''],
      numero: ['', [Validators.required, Validators.pattern(TelefonePattern())]],
      observacao: ['', [Validators.minLength(5), Validators.maxLength(50)]]
    });
  }

  inicializaResponsavel() {
    return this.formBuilder.group({
      id: [''],
      tipo: ['FINANCEIRO', [Validators.required]],
      cpf: [''],
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      dataNascimento: [''],
      email: ['', [Validators.pattern(EmailPattern()), Validators.minLength(5), Validators.maxLength(50)]],
      cep: ['', [Validators.required]],
      logradouro: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      numero: ['', [Validators.required, Validators.maxLength(20)]],
      bairro: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      complemento: ['', [Validators.minLength(5), Validators.maxLength(50)]],
      cidade: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      uf: ['', [Validators.required]],
      telefones: this.formBuilder.array([
        this.inicializaTelefone()
      ])
    }, { validator: AlunoCadastroComponent.equalsResponsavelTo }
    );
  }

  get editando() {
    return Boolean(this.aluno.id);
  }

  carregarAluno(id: number) {
    setTimeout(() => {
      this.loading = true;
    });
    this.alunoService.buscarPorId(id)
      .subscribe(aluno => {
        setTimeout(() => {
          this.loading = false;
        });
        this.aluno = aluno;
        aluno.telefones.forEach((telefone: Telefone, tel) => {
          if (tel > 0) {
            this.adicionaTelefoneAluno();
          }
        });
        aluno.responsaveis.forEach((responsavel: Responsavel, resp) => {
          if (resp > 0) {
            this.adicionaResponsavel();
          }
          responsavel.telefones.forEach((telefone: Telefone, tel) => {
            if (tel > 0) {
              this.adicionaTelefoneResponsavel(resp);
            }
          });
        });
        this.alunoForm.patchValue({
          cpf: aluno.cpf,
          nome: aluno.nome,
          dataNascimento: aluno.dataNascimento,
          email: aluno.email,
          cep: aluno.cep,
          logradouro: aluno.logradouro,
          numero: aluno.numero,
          bairro: aluno.bairro,
          complemento: aluno.complemento,
          cidade: aluno.cidade,
          uf: aluno.uf,
          telefones : aluno.telefones.map(telefone => ({
            id: telefone.id,
            numero: telefone.numero,
            observacao: telefone.observacao
          })),
          responsaveis : aluno.responsaveis.map(responsavel => ({
            id: responsavel.id,
            tipo: responsavel.tipo,
            cpf: responsavel.cpf,
            nome: responsavel.nome,
            dataNascimento: responsavel.dataNascimento,
            email: responsavel.email,
            cep: responsavel.cep,
            logradouro: responsavel.logradouro,
            numero: responsavel.numero,
            bairro: responsavel.bairro,
            complemento: responsavel.complemento,
            cidade: responsavel.cidade,
            uf: responsavel.uf,
            telefones : responsavel.telefones.map(telefone => ({
              id: telefone.id,
              numero: telefone.numero,
              observacao: telefone.observacao
            }))
          }))
        }, { onlySelf: true, emitEvent: true });
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  salvar() {
    const aluno = this.alunoForm.value as Aluno;
    if (this.editando) {
      this.atualizarAluno(aluno);
    } else {
      this.adicionarAluno(aluno);
    }
  }

  adicionarAluno(aluno: Aluno) {
    setTimeout(() => {
      this.loading = true;
    });
    this.alunoService.adicionar(aluno)
      .subscribe((alunoAdicionado: Aluno) => {
        setTimeout(() => {
          this.loading = false;
        });
        this.aluno = alunoAdicionado;
        this.toasty.Success('Aluno adicionado com sucesso!');
        this.dadosAlterados = false;
        this.router.navigate(['/alunos']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  atualizarAluno(aluno: Aluno) {
    setTimeout(() => {
      this.loading = true;
    });
    aluno.id = this.aluno.id;
    this.alunoService.atualizar(aluno)
      .subscribe((alunoAtualizado: Aluno) => {
        setTimeout(() => {
          this.loading = false;
        });
        this.aluno = alunoAtualizado;
        this.toasty.Success('Aluno alterado com sucesso!');
        this.dadosAlterados = false;
        this.router.navigate(['/alunos']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  adicionaTelefoneAluno() {
    const telefones = this.alunoForm.get('telefones') as FormArray;
    telefones.push(this.inicializaTelefone());
  }

  removeTelefoneAluno(tel: number) {
    if (this.editando) {
      this.confirmation.confirm({
        message: 'Tem certeza que deseja excluir o telefone do aluno?',
        accept: () => {
          this.removerTelefoneAluno(tel);
        }
      });
    } else {
      this.removerTelefoneAluno(tel);
    }
  }

  removerTelefoneAluno(tel: number) {
    const telefones = this.alunoForm.get('telefones') as FormArray;
    telefones.removeAt(tel);
  }

  adicionaResponsavel() {
    const responsaveis = this.alunoForm.get('responsaveis') as FormArray;
    responsaveis.push(this.inicializaResponsavel());
  }

  removeResponsavel(resp: number) {
    if (this.editando) {
      this.confirmation.confirm({
        message: 'Tem certeza que deseja excluir o responsável?',
        accept: () => {
          this.removerResponsavel(resp);
        }
      });
    } else {
      this.removerResponsavel(resp);
    }
  }

  removerResponsavel(resp: number) {
    const responsaveis = this.alunoForm.get('responsaveis') as FormArray;
    responsaveis.removeAt(resp);
  }

  adicionaTelefoneResponsavel(resp: number) {
    const responsaveis = this.alunoForm.get('responsaveis') as FormArray;
    const telefones = responsaveis.controls[resp].get('telefones') as FormArray;
    telefones.push(this.inicializaTelefone());
  }

  removeTelefoneResponsavel(resp: number, tel: number) {
    if (this.editando) {
      this.confirmation.confirm({
        message: 'Tem certeza que deseja excluir o telefone do responsável?',
        accept: () => {
          this.removerTelefoneResponsavel(resp, tel);
        }
      });
    } else {
      this.removerTelefoneResponsavel(resp, tel);
    }
  }

  removerTelefoneResponsavel(resp: number, tel: number) {
    const responsaveis = this.alunoForm.get('responsaveis') as FormArray;
    const telefones = responsaveis.controls[resp].get('telefones') as FormArray;
    telefones.removeAt(tel);
  }

  copiaDadosAluno(resp: number) {
    if (this.editando) {
      this.confirmation.confirm({
        message: 'Tem certeza que deseja copiar os dados do aluno?',
        accept: () => {
          this.copiarDadosAluno(resp);
        }
      });
    } else {
      this.copiarDadosAluno(resp);
    }
  }

  copiarDadosAluno(resp: number) {
    const aluno = this.alunoForm.value as Aluno;

    const responsaveis = this.alunoForm.get('responsaveis') as FormArray;
    responsaveis.controls[resp].get('cpf').setValue(aluno.cpf);
    responsaveis.controls[resp].get('nome').setValue(aluno.nome);
    responsaveis.controls[resp].get('dataNascimento').setValue(aluno.dataNascimento);
    responsaveis.controls[resp].get('email').setValue(aluno.email);
    responsaveis.controls[resp].get('cep').setValue(aluno.cep);
    responsaveis.controls[resp].get('logradouro').setValue(aluno.logradouro);
    responsaveis.controls[resp].get('numero').setValue(aluno.numero);
    responsaveis.controls[resp].get('bairro').setValue(aluno.bairro);
    responsaveis.controls[resp].get('complemento').setValue(aluno.complemento);
    responsaveis.controls[resp].get('cidade').setValue(aluno.cidade);
    responsaveis.controls[resp].get('uf').setValue(aluno.uf);

    const telefones = responsaveis.controls[resp].get('telefones') as FormArray;
    aluno.telefones.forEach((telefone, tel) => {
      if (telefones.controls[tel] == null) {
        telefones.push(this.inicializaTelefone());
      }
      telefones.controls[tel].get('numero').setValue(telefone.numero);
      telefones.controls[tel].get('observacao').setValue(telefone.observacao);
    });
  }

  onChanges(): void {
    this.alunoForm.valueChanges.subscribe(() => {
      this.dadosAlterados = this.alunoForm.dirty;
    });
  }

  getTelefonesAluno() {
    const telefones = this.alunoForm.get('telefones') as FormArray;
    return telefones.controls;
  }

  getTelefoneAluno(tel: number) {
    const telefones = this.alunoForm.get('telefones') as FormArray;
    return telefones.controls[tel];
  }

  getResponsaveisAluno() {
    const responsaveis = this.alunoForm.get('responsaveis') as FormArray;
    return responsaveis.controls;
  }

  getResponsavelAluno(resp: number) {
    const responsaveis = this.alunoForm.get('responsaveis') as FormArray;
    return responsaveis.controls[resp];
  }

  getTelefonesResponsavelAluno(resp: number) {
    const responsaveis = this.alunoForm.get('responsaveis') as FormArray;
    const telefones = responsaveis.controls[resp].get('telefones') as FormArray;
    return telefones.controls;
  }

  getTelefoneResponsavelAluno(resp: number, tel: number) {
    const responsaveis = this.alunoForm.get('responsaveis') as FormArray;
    const telefones = responsaveis.controls[resp].get('telefones') as FormArray;
    return telefones.controls[tel];
  }

  temPermissao(permissao: string) {
    return this.auth.temPermissao(permissao);
  }

  buscarCepAluno() {
    const aluno = this.alunoForm.value as Aluno;
    if (CepPattern().test(aluno.cep)) {
      setTimeout(() => {
        this.loading = true;
      });
      const cep = aluno.cep.replace(/[^0-9]/g, '');
      this.cepService.buscar(cep)
        .subscribe((res: BuscaCep) => {
          setTimeout(() => {
            this.loading = false;
          });
          this.alunoForm.get('logradouro').setValue(res.logradouro);
          this.alunoForm.get('bairro').setValue(res.bairro);
          this.alunoForm.get('complemento').setValue(res.complemento);
          this.alunoForm.get('cidade').setValue(res.localidade);
          this.alunoForm.get('uf').setValue(res.uf);
        }, erro => {
          setTimeout(() => {
            this.loading = false;
          });
          this.errorHandler.handle(erro);
        });
    }
  }

  buscarCepResponsavel(resp: number) {
    const responsaveis = this.alunoForm.get('responsaveis') as FormArray;
    const responsavel = responsaveis.controls[resp].value as Responsavel;
    if (CepPattern().test(responsavel.cep)) {
      setTimeout(() => {
        this.loading = true;
      });
      const cep = responsavel.cep.replace(/[^0-9]/g, '');
      this.cepService.buscar(cep)
        .subscribe((res: BuscaCep) => {
          setTimeout(() => {
            this.loading = false;
          });
          responsaveis.controls[resp].get('logradouro').setValue(res.logradouro);
          responsaveis.controls[resp].get('bairro').setValue(res.bairro);
          responsaveis.controls[resp].get('complemento').setValue(res.complemento);
          responsaveis.controls[resp].get('cidade').setValue(res.localidade);
          responsaveis.controls[resp].get('uf').setValue(res.uf);
        }, erro => {
          setTimeout(() => {
            this.loading = false;
          });
          this.errorHandler.handle(erro);
        });
    }
  }

}
