import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginModule' },
  { path: 'unidades', loadChildren: './pages/unidades/unidades.module#UnidadesModule' },
  { path: 'usuarios', loadChildren: './pages/usuarios/usuarios.module#UsuariosModule' },
  { path: 'perfil', loadChildren: './pages/perfil/perfil.module#PerfilModule' },
  { path: 'cursos', loadChildren: './pages/cursos/cursos.module#CursosModule' },
  { path: 'turnos', loadChildren: './pages/turnos/turnos.module#TurnosModule' },
  { path: 'alunos', loadChildren: './pages/alunos/alunos.module#AlunosModule' },
  { path: 'turmas', loadChildren: './pages/turmas/turmas.module#TurmasModule' },
  { path: 'matriculas', loadChildren: './pages/matriculas/matriculas.module#MatriculasModule' },
  { path: 'nao-autorizado', loadChildren: './pages/not-authorized/not-authorized.module#NotAuthorizedModule' },
  { path: 'pagina-nao-encontrada', loadChildren: './pages/not-found/not-found.module#NotFoundModule' },
  { path: '**', redirectTo: 'pagina-nao-encontrada' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
