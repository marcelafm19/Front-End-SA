import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Despesa } from '../../models/despesa';
import { DespesaService } from '../../services/despesa.service';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-despesa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-despesa.component.html',
  styleUrls: ['./add-despesa.component.css']
})
export class AddDespesaComponent {

  formGroup: FormGroup;
  listaCategorias: Categoria[] = [];
  listaUsuarios: Usuario[] = [];
  despesa!: Despesa;

  constructor(private formBuilder: FormBuilder, private despesaService: DespesaService, private route: ActivatedRoute, private router: Router, private categoriaService: CategoriaService, private usuarioService: UsuarioService
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      descricao: ['', Validators.required],
      dataVencimento: ['', Validators.required],
      dataPagamento: ['', Validators.required],
      situacao: ['', Validators.required],
      valor: [null, Validators.required],
      categoria: [null, Validators.required],
      usuario: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarListaCategoria();
    this.carregarListaUsuario();

    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.despesa = new Despesa();

    if (id) {
      this.despesaService.buscarPorId(id).subscribe(retorno => {
        this.despesa = retorno;
        let categoriaSelecionada = this.listaCategorias.find(temp => temp.id === retorno.categoria!.id);
        let usuarioSelecionado = this.listaUsuarios.find(temp => temp.id === retorno.usuario!.id);
        this.formGroup.patchValue({
          descricao: this.despesa.descricao,
          dataVencimento: this.despesa.dataVencimento,
          dataPagamento: this.despesa.dataPagamento,
          situacao: this.despesa.situacao,
          valor: this.despesa.valor,
          categoria: categoriaSelecionada,
          usuario: usuarioSelecionado
        });
      });
    }
  }

  onSubmit(): void {
    if (this.formGroup.valid) {

      this.despesa.descricao = this.formGroup.value.descricao;
      this.despesa.dataVencimento = this.formGroup.value.dataVencimento;
      this.despesa.dataPagamento = this.formGroup.value.dataPagamento;
      this.despesa.situacao = this.formGroup.value.situacao;
      this.despesa.valor = this.formGroup.value.valor;
      this.despesa.categoria = this.formGroup.value.categoria;
      this.despesa.usuario = this.formGroup.value.usuario;
      this.despesaService.salvar(this.despesa).subscribe({
        next: () => {
          alert('Registro salvo com sucesso!');
          this.formGroup.reset();
          this.router.navigate(['/despesas']);
        },
        error: () => {
          alert('Erro ao salvar o registro. Tente novamente.');
        }
      });
    }
  }

  carregarListaCategoria(): void {
    this.categoriaService.listar().subscribe({
      next: (retorno) => {
        this.listaCategorias = retorno;
      },
      error: () => {
        alert('Erro ao carregar a lista de categorias.');
      }
    });
  }

  carregarListaUsuario(): void {
    this.usuarioService.listar().subscribe({
      next: (retorno) => {
        this.listaUsuarios = retorno;
      },
      error: () => {
        alert('Erro ao carregar a lista de categorias.');
      }
    });
  }
}
