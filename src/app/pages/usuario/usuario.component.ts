import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  lista: Usuario[] = [];
  mensagemDados = false;

  constructor(private service: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.carregarLista();
  }

  carregarLista(): void {
    this.mensagemDados = true;
    this.service.listar().subscribe({
      next: (retornoJson) => {
        this.lista = retornoJson;
      },
      error: () => {
        alert('Erro ao carregar a lista.');
      },
      complete: () => {
        this.mensagemDados = false;
      }
    });
  }

  editar(id: number): void {
    this.router.navigate(['/add-usuario', id]);
  }

  excluir(id: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.service.excluir(id).subscribe({
        next: () => {
          this.carregarLista(); 
        },
        error: () => {
          alert('Erro ao excluir. O usuário pode ter transações vinculadas!');
        }
      });
    }
  }
}