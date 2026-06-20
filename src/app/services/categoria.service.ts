import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria';
import { appSettings } from '../app.config';
import { LoginService } from './login.service';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = `${appSettings.apiBaseUrl}/categorias`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  }

  salvar(categoria: Categoria): Observable<Categoria> {
    if (categoria.id) {
      return this.http.put<Categoria>(`${this.apiUrl}/${categoria.id}`, categoria, this.loginService.gerarCabecalhoHTTP() );
    } else {
      return this.http.post<Categoria>(this.apiUrl, categoria, this.loginService.gerarCabecalhoHTTP());
    }
  }

  buscarPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

}
