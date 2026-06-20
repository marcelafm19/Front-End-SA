import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceitaService } from '../../services/receita.service';
import { Receita } from '../../models/receita';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-receita',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './receita.component.html',
  styleUrl: './receita.component.css'
})
export class ReceitaComponent {
  lista: Receita[] = [];

  constructor(private service: ReceitaService, private router: Router) {}

  ngOnInit(): void {
    this.carregarLista();
  }

  carregarLista(): void {
    this.service.listar().subscribe({
      next: (retornoJson) => { 
        this.lista = retornoJson;
      },
      error: () => {
        alert('Erro ao carregar a lista.');
      }
    });
  }

  excluir(id: number): void {
    if (confirm('Tem certeza que deseja excluir o registro?')) {
      this.service.excluir(id).subscribe({
        next: () => {
          this.carregarLista();
        },
        error: () => {
          alert('Erro ao excluir o registro. Tente novamente.');
        }
      });
    }
  }

  editar(id: number): void {    
    this.router.navigate(['/add-receita', id]);    
  }
}