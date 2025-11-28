import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './components/header/header';
import { ShortBar } from './components/short-bar/short-bar';
import { State } from './services/state';
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
    ShortBar,
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
export class App {
  private state = inject(State);
  showShortBar = this.state.showShortBar;
  hideHeader = this.state.hideHeader;
}
