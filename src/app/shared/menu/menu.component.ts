import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common'; // Import DOCUMENT for DOM manipulation
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'] 
})
export class MenuComponent implements OnInit, OnDestroy {

  menu = [
    { descricao: 'Categorias', rota: '/tipos', niveis: ['NIVEL1','NIVEL2','NIVEL3']},
    { descricao: 'Despesas', rota: '/despesas', niveis: ['NIVEL1', 'NIVEL2']},
    { descricao: 'Receitas', rota: '/receitas', niveis: ['NIVEL1', 'NIVEL2', 'NIVEL3']},
    { descricao: 'Usuarios', rota: '/usuarios', niveis: ['NIVEL1', 'NIVEL2', 'NIVEL3']},
    { descricao: 'Extrato', rota: '/extrato', niveis: ['NIVEL1', 'NIVEL2', 'NIVEL3']}
  ];

  private subscription!: Subscription;
  menuUsuario: { descricao: string, rota: string, niveis: string[] }[] = [];
  nivelUsuario!: string;
  nomeUsuario!: string;
  
  private fontSizeMultiplier: number = 1.0;
  private readonly zoomStep: number = 0.1;
  private readonly maxZoom: number = 1.5;
  private readonly minZoom: number = 1.0;

  isLowVisionModeActive: boolean = false;


  constructor(
    private loginService: LoginService, 
    private router: Router,
    @Inject(DOCUMENT) private document: Document 
  ) { 
      this.nivelUsuario = '';
      this.nomeUsuario = '';
      this.menuUsuario = [];
  }

  ngOnInit(): void {    
    this.initializeAccessibilitySettings();

    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.atualizarMenu();
      }
    });

    this.atualizarMenu(); 
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); 
  }

  private initializeAccessibilitySettings(): void {
    const savedZoom = localStorage.getItem('appFontSizeMultiplier');
    if (savedZoom) {
      this.fontSizeMultiplier = parseFloat(savedZoom);
      this.aplicarZoom();
    }

    const savedLowVisionMode = localStorage.getItem('isLowVisionModeActive');
    this.isLowVisionModeActive = savedLowVisionMode === 'true';
    this.aplicarLowVisionMode(this.isLowVisionModeActive);
  }

  private atualizarMenu(): void {
    const dadosToken = this.loginService.extrairDadosToken();

    if (dadosToken && dadosToken.roles) {
      this.nivelUsuario = dadosToken.roles.replace(/^ROLE_/, '');
      this.nomeUsuario = dadosToken.sub;
      this.menuUsuario = this.menu.filter(item => item.niveis.includes(this.nivelUsuario));
    } else {
      this.nivelUsuario = '';
      this.nomeUsuario = '';
      this.menuUsuario = [];
    }
  }

  sair(): void {
    this.loginService.limparToken();
    this.atualizarMenu();    
  }

  private aplicarZoom(): void {
    this.document.documentElement.style.fontSize = `${this.fontSizeMultiplier * 100}%`;
    localStorage.setItem('appFontSizeMultiplier', this.fontSizeMultiplier.toString());
  }

  aumentarFonte(): void {
    if (this.fontSizeMultiplier < this.maxZoom) {
      this.fontSizeMultiplier = Math.round((this.fontSizeMultiplier + this.zoomStep) * 10) / 10;
      this.aplicarZoom();
    }
  }

  diminuirFonte(): void {
    if (this.fontSizeMultiplier > this.minZoom) {
      this.fontSizeMultiplier = Math.round((this.fontSizeMultiplier - this.zoomStep) * 10) / 10;
      this.aplicarZoom();
    }
  }

  private aplicarLowVisionMode(isActive: boolean): void {
    if (isActive) {
      this.document.body.classList.add('low-vision-mode');
    } else {
      this.document.body.classList.remove('low-vision-mode');
    }
    localStorage.setItem('isLowVisionModeActive', isActive.toString());
  }

  toggleLowVisionMode(): void {
    this.isLowVisionModeActive = !this.isLowVisionModeActive;
    this.aplicarLowVisionMode(this.isLowVisionModeActive);
  }
}