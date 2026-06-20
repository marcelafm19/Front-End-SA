import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { ImagemService } from '../../services/imagem.service';
import { Imagem } from '../../models/imagem';
import { Usuario } from '../../models/usuario';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-usuario.component.html',
  styleUrl: './add-usuario.component.css'
})
export class AddUsuarioComponent {

  formGroup: FormGroup;
  mensagemErroLogin: string;

  imagemSelecionada: File | null = null;
  imagemUsuario: string | ArrayBuffer | null = null;

  constructor(private formBuilder: FormBuilder, private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router, private imagemService: ImagemService) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      email: ['', Validators.required],
      login: ['', Validators.required],
      senha: ['', Validators.required],
      nivelAcesso: ['', Validators.required]
    });

    this.mensagemErroLogin = "";
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      if (this.imagemSelecionada) {
        this.imagemService.upload(this.imagemSelecionada).subscribe({
          next: (imagem) => {
             // salva os dados do usuário com a imagem incluída
            this.salvarUsuario(imagem);
          },
          error: () => {
            alert('Erro ao enviar a imagem.');
          }
        });
      } else {
        this.salvarUsuario(); // salva sem imagem
      }
    }
  }


 salvarUsuario(imagem?: Imagem): void {
  let usuario = new Usuario()
  usuario.nome = this.formGroup.get('nome')?.value,
  usuario.email = this.formGroup.get('email')?.value,
  usuario.login = this.formGroup.get('login')?.value,
  usuario.senha = this.formGroup.get('senha')?.value,
  usuario.nivelAcesso = this.formGroup.get('nivelAcesso')?.value,
  usuario.urlImagem = imagem?.urlImagem;

  this.usuarioService.salvar(usuario).subscribe({
    next: () => {
      alert('Registro salvo com sucesso!');
      this.formGroup.reset();
      this.imagemUsuario = null;
      this.imagemSelecionada = null;
      this.router.navigate(['/usuarios']);
    },
    error: () => {
      alert('Erro ao salvar o registro. Tente novamente.');
    }
  });
}




  verificarLogin() {
    const login = this.formGroup.get('login')?.value;
    this.mensagemErroLogin = "";

    this.usuarioService.verificarLogin(login).subscribe({
      next: (existe: boolean) => {
        if (existe) {
          this.mensagemErroLogin = "Login já cadastrado.";
          this.formGroup.get('login')?.setErrors({ loginDuplicado: true });
        } else {
          this.mensagemErroLogin = "";
          // Limpa o erro de loginDuplicado, se existir
          this.formGroup.get('login')?.setErrors(null);
        }
      },
      error: err => {
        this.mensagemErroLogin = "Erro ao validar o login";
      }
    });
  }

  abrirInputImagem(): void {
    const inputImagem = document.getElementById('inputImagem') as HTMLInputElement;
    inputImagem.click();
  }

  carregarImagem(event: any): void {
    const arquivoSelecionado = event.target.files[0];

    if (arquivoSelecionado) {
      
      this.imagemSelecionada = arquivoSelecionado;

      const leitor = new FileReader();

      leitor.onload = () => {
        this.imagemUsuario = leitor.result;
      };

      leitor.readAsDataURL(arquivoSelecionado);
    }
  }

}