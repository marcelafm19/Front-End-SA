import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receita } from '../models/receita';
import { appSettings } from '../app.config';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ReceitaService {
  
  private apiUrl = `${appSettings.apiBaseUrl}/receitas`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  listar(): Observable<Receita[]> {
    return this.http.get<Receita[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  }

  salvar(receita: Receita): Observable<Receita> {
    if (receita.id) {
      return this.http.put<Receita>(`${this.apiUrl}/${receita.id}`, receita, this.loginService.gerarCabecalhoHTTP());
    } else {
      return this.http.post<Receita>(this.apiUrl, receita, this.loginService.gerarCabecalhoHTTP());
    }
  }

  buscarPorId(id: number): Observable<Receita> {
    return this.http.get<Receita>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }
}