import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './components/header/header';
import { Sidenav } from './components/sidenav/sidenav';
import { Hero } from './components/hero/hero';
import { Features } from './components/features/features';
import { Faq } from './components/faq/faq';
import { ClosingBanner } from './components/closing-banner/closing-banner';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Sidenav, // ✅ On importe le composant standalone ici
    Hero,
    Features,
    Faq,
    ClosingBanner,
    Footer,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
