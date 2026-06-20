import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Receita } from '../../models/receita';
import { ReceitaService } from '../../services/receita.service';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-receita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-receita.component.html',
  styleUrls: ['./add-receita.component.css']
})
export class AddReceitaComponent {

  formGroup: FormGroup;
  listaCategorias: Categoria[] = [];
  listaUsuarios: Usuario[] = [];
  receita!: Receita;

  constructor(private formBuilder: FormBuilder, private receitaService: ReceitaService, private route: ActivatedRoute, private router: Router, private categoriaService: CategoriaService, private usuarioService: UsuarioService
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      dataEntrada: ['', Validators.required],
      valor: [null, Validators.required],
      categoria: [null, Validators.required],
      usuario: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarListaCategoria();
    this.carregarListaUsuario();

    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.receita = new Receita();

    if (id) {
      this.receitaService.buscarPorId(id).subscribe(retorno => {
        this.receita = retorno;
        let categoriaSelecionada = this.listaCategorias.find(temp => temp.id === retorno.categoria!.id);
        let usuarioSelecionado = this.listaUsuarios.find(temp => temp.id === retorno.usuario!.id);
        this.formGroup.patchValue({
          dataEntrada: this.receita.dataEntrada,
          valor: this.receita.valor,
          categoria: categoriaSelecionada,
          usuario: usuarioSelecionado
        });
      });
    }
  }

  onSubmit(): void {
    if (this.formGroup.valid) {

      this.receita.dataEntrada = this.formGroup.value.dataEntrada;
      this.receita.valor = this.formGroup.value.valor;
      this.receita.categoria = this.formGroup.value.categoria;
      this.receita.usuario = this.formGroup.value.usuario;
      this.receitaService.salvar(this.receita).subscribe({
        next: () => {
          alert('Registro salvo com sucesso!');
          this.formGroup.reset();
          this.router.navigate(['/receitas']);
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
