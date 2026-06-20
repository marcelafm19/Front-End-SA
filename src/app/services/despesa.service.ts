import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Despesa } from '../models/despesa';
import { appSettings } from '../app.config';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class DespesaService {
  
  private apiUrl = `${appSettings.apiBaseUrl}/despesas`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  listar(): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  }

  salvar(despesa: Despesa): Observable<Despesa> {
    if (despesa.id){
      return this.http.put<Despesa>(`${this.apiUrl}/${despesa.id}`, despesa, this.loginService.gerarCabecalhoHTTP());
    } else {
      return this.http.post<Despesa>(this.apiUrl, despesa, this.loginService.gerarCabecalhoHTTP());
    }
  }

  buscarPorId(id: number): Observable<Despesa>{
    return this.http.get<Despesa>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }
}
