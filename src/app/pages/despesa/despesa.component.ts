import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DespesaService } from '../../services/despesa.service';
import { Despesa } from '../../models/despesa';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-despesa',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './despesa.component.html',
  styleUrl: './despesa.component.css'
})
export class DespesaComponent {
  lista: Despesa[] = [];
  mostrarResumo = false;

  constructor(private service: DespesaService, private router: Router) {}

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
    this.router.navigate(['/add-despesa', id]);    
  }

  alternarResumo(): void {
    this.mostrarResumo = !this.mostrarResumo;
  }
}