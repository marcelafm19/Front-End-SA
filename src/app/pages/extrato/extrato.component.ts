import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Despesa } from '../../models/despesa';
import { Receita } from '../../models/receita';
import { Categoria } from '../../models/categoria';
import { Usuario } from '../../models/usuario';

import { DespesaService } from '../../services/despesa.service';
import { ReceitaService } from '../../services/receita.service';
import { CategoriaService } from '../../services/categoria.service';
import { UsuarioService } from '../../services/usuario.service';

interface ITransacao {
  id: number;
  data: string; 
  valor: number;
  tipo: 'Crédito' | 'Débito'; 
  tipoOperacao: 'Receita' | 'Despesa'; 
  descricaoDetalhada: string; 
  categoria?: string; 
  usuario?: string; 
  categoriaTipo?: string; 
}

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, CurrencyPipe],
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.css']
})
export class ExtratoComponent implements OnInit {

  totalDespesas: number = 0;
  totalReceitas: number = 0;
  balanco: number = 0;

  listaTransacoes: ITransacao[] = []; 
  mostrarResumo = false;
  
  balancoPorCategoria: { [key: string]: number } = {};
  balancoPorUsuario: { [key: string]: number } = {};

  quantidadeDespesas: number = 0;
  quantidadeReceitas: number = 0;
  quantidadeCategorias: number = 0;
  quantidadeUsuarios: number = 0;

  constructor(
    private despesaService: DespesaService,
    private receitaService: ReceitaService,
    private categoriaService: CategoriaService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.carregarDadosExtrato();
  }

  carregarDadosExtrato(): void {
    let despesasCarregadas: Despesa[] = [];
    let receitasCarregadas: Receita[] = [];

    this.despesaService.listar().subscribe({
      next: (despesas: Despesa[]) => {
        despesasCarregadas = despesas;
        this.totalDespesas = despesas.reduce((sum, d) => sum + (d.valor || 0), 0);
        this.quantidadeDespesas = despesas.length;
        this.combinarEOrdenarTransacoes(despesasCarregadas, receitasCarregadas);
      },
      error: (err) => {
        console.error('Erro ao carregar despesas:', err);
        alert('Erro ao carregar o total de despesas.');
      }
    });

    this.receitaService.listar().subscribe({
      next: (receitas: Receita[]) => {
        receitasCarregadas = receitas;
        this.totalReceitas = receitas.reduce((sum, r) => sum + (r.valor || 0), 0);
        this.quantidadeReceitas = receitas.length;
        this.combinarEOrdenarTransacoes(despesasCarregadas, receitasCarregadas);
      },
      error: (err) => {
        console.error('Erro ao carregar receitas:', err);
        alert('Erro ao carregar o total de receitas.');
      }
    });

    this.categoriaService.listar().subscribe({
      next: (categorias: Categoria[]) => {
        this.quantidadeCategorias = categorias.length;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias para resumo:', err);
      }
    });

    this.usuarioService.listar().subscribe({
      next: (usuarios: Usuario[]) => {
        this.quantidadeUsuarios = usuarios.length;
      },
      error: (err) => {
        console.error('Erro ao carregar usuários para resumo:', err);
      }
    });
  }

  private combinarEOrdenarTransacoes(despesas: Despesa[], receitas: Receita[]): void {
    const transacoes: ITransacao[] = [];

    despesas.forEach(d => {
      transacoes.push({
        id: d.id,
        data: d.dataPagamento?.toString() || d.dataVencimento?.toString() || '',
        valor: d.valor || 0,
        tipo: 'Débito', 
        tipoOperacao: 'Despesa', 
        descricaoDetalhada: d.descricao ?? '', 
        categoria: d.categoria?.descricao,
        usuario: d.usuario?.nome,
        categoriaTipo: d.categoria?.tipo
      });
    });

    receitas.forEach(r => {
      transacoes.push({
        id: r.id,
        data: r.dataEntrada?.toString() || '',
        valor: r.valor || 0,
        tipo: 'Crédito',
        tipoOperacao: 'Receita', 
        descricaoDetalhada: r.categoria?.descricao ?? '', 
        categoria: r.categoria?.descricao,
        usuario: r.usuario?.nome,
        categoriaTipo: r.categoria?.tipo
      });
    });

    this.listaTransacoes = transacoes.sort((a, b) => {
      if (a.data < b.data) return 1;
      if (a.data > b.data) return -1;
      return 0;
    });

    this.calcularBalanco();
    this.calcularBalancoDetalhado();
  }

  calcularBalanco(): void {
    this.balanco = this.totalReceitas - this.totalDespesas;
  }

  calcularBalancoDetalhado(): void {
    this.balancoPorCategoria = {};
    this.balancoPorUsuario = {};

    this.listaTransacoes.forEach(transacao => {
      const valor = transacao.tipo === 'Crédito' ? transacao.valor : -transacao.valor;

      if (transacao.categoria) {
        if (!this.balancoPorCategoria[transacao.categoria]) {
          this.balancoPorCategoria[transacao.categoria] = 0;
        }
        this.balancoPorCategoria[transacao.categoria] += valor;
      }

      if (transacao.usuario) {
        if (!this.balancoPorUsuario[transacao.usuario]) {
          this.balancoPorUsuario[transacao.usuario] = 0;
        }
        this.balancoPorUsuario[transacao.usuario] += valor;
      }
    });
  }

  alternarResumo(): void {
    this.mostrarResumo = !this.mostrarResumo;
  }
}