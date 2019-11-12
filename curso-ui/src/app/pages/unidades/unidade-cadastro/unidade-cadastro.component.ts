import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { UnidadeService } from '../../../core/services/unidade.service';
import { CepService } from '../../../core/services/cep.service';
import { Unidade, BuscaCep } from '../../../core/types/model';
import { CepPattern } from './../../../core/validators/cep';

@Component({
  selector: 'app-unidade-cadastro',
  templateUrl: './unidade-cadastro.component.html'
})
export class UnidadeCadastroComponent implements OnInit {

  public loading = false;

  unidade = new Unidade();
  unidadeForm: FormGroup;
  dadosAlterados = false;

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private unidadeService: UnidadeService,
    private cepService: CepService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Nova Unidade'));

    this.unidadeForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      cep: ['', [Validators.required]],
      logradouro: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      numero: ['', [Validators.required, Validators.maxLength(20)]],
      bairro: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      complemento: ['', [Validators.minLength(5), Validators.maxLength(50)]],
      cidade: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      uf: ['', [Validators.required]]
    });

    const idUnidade = this.route.snapshot.params['id'];

    if (idUnidade) {
      this.title.setTitle(this.conteudo.titulo('Edição de Unidade'));
      this.carregarUnidade(idUnidade);
    }

    this.onChanges();
  }

  get editando() {
    return Boolean(this.unidade.id)
  }

  carregarUnidade(id: number) {
    setTimeout(() => {
      this.loading = true;
    });
    this.unidadeService.buscarPorId(id)
      .subscribe(unidade => {
        setTimeout(() => {
          this.loading = false;
        });
        this.unidade = unidade;
        this.unidadeForm.patchValue({
          codigo: unidade.codigo,
          nome: unidade.nome,
          cep: unidade.cep,
          logradouro: unidade.logradouro,
          numero: unidade.numero,
          bairro: unidade.bairro,
          complemento: unidade.complemento,
          cidade: unidade.cidade,
          uf: unidade.uf
        }, { onlySelf: true, emitEvent: true });
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  salvar() {
    const unidade = this.unidadeForm.value as Unidade;
    if (this.editando) {
      this.atualizarUnidade(unidade);
    } else {
      this.adicionarUnidade(unidade);
    }
  }

  adicionarUnidade(unidade: Unidade) {
    setTimeout(() => {
      this.loading = true;
    });
    this.unidadeService.adicionar(unidade)
      .subscribe(unidadeAdicionada => {
        setTimeout(() => {
          this.loading = false;
        });
        this.unidade = unidadeAdicionada;
        this.toasty.Success('Unidade adicionada com sucesso!');
        this.dadosAlterados = false;
        this.router.navigate(['/unidades']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  atualizarUnidade(unidade: Unidade) {
    setTimeout(() => {
      this.loading = true;
    });
    unidade.id = this.unidade.id;
    this.unidadeService.atualizar(unidade)
      .subscribe(unidadeAlterada => {
        setTimeout(() => {
          this.loading = false;
        });
        this.unidade = unidadeAlterada;
        this.toasty.Success('Unidade alterada com sucesso!');
        this.dadosAlterados = false;
        this.router.navigate(['/unidades']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  onChanges(): void {
    this.unidadeForm.valueChanges.subscribe(() => {
      this.dadosAlterados = this.unidadeForm.dirty;
    });
  }

  temPermissao(permissao: string) {
    return this.auth.temPermissao(permissao);
  }

  buscarCep() {
    const unidade = this.unidadeForm.value as Unidade;
    if (CepPattern().test(unidade.cep)) {
      setTimeout(() => {
        this.loading = true;
      });
      const cep = unidade.cep.replace(/[^0-9]/g, '');
      this.cepService.buscar(cep)
        .subscribe((res: BuscaCep) => {
          setTimeout(() => {
            this.loading = false;
          });
          this.unidadeForm.get('logradouro').setValue(res.logradouro);
          this.unidadeForm.get('bairro').setValue(res.bairro);
          this.unidadeForm.get('complemento').setValue(res.complemento);
          this.unidadeForm.get('cidade').setValue(res.localidade);
          this.unidadeForm.get('uf').setValue(res.uf);
        }, erro => {
          setTimeout(() => {
            this.loading = false;
          });
          this.errorHandler.handle(erro);
        });
    }
  }

}
