import {
  Component,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { IS_MEDIUM } from '../../../app.constants';
import { WindowsObserver } from '../../../services/windows-observer';

type GoogleCard = {
  id: string;
  gridArea: string;
  variant: 'yellow' | 'white' | 'beige';
  front: { eyebrow: string; title: string };
  back: { content: string; cta: string };
  frontImage?: string;
  backImage?: string;
  linkExist?: boolean;
};

@Component({
  selector: 'app-by-google',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: './by-google.html',
  styleUrls: ['./by-google.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByGoogle implements AfterViewInit, OnDestroy {
  private windows = inject(WindowsObserver);
  width = this.windows.width;
  medium = IS_MEDIUM;
  @ViewChild('section', { static: true }) sectionRef!: ElementRef<HTMLElement>;
  @ViewChild('pill', { static: true }) pillRef!: ElementRef<HTMLElement>;

  private ngZone = inject(NgZone);
  private ctx?: gsap.Context;

  readonly pillText = 'conçu'.split('');

  readonly cards = signal<GoogleCard[]>([
    {
      id: 'search',
      gridArea: 'a',
      variant: 'yellow',
      front: {
        eyebrow: 'MOTEUR DE RECHERCHE GOOGLE',
        title: 'Une barre de recherche à votre image, directement intégrée.',
      },
      back: {
        content:
          "Tout un univers de connaissances, à portée de main. Consultez la météo, résolvez des équations mathématiques et profitez de résultats de recherche instantanés, le tout depuis la barre d'adresse de votre navigateur.",
        cta: 'Découvrir la recherche intégrée',
      },
      frontImage: '/assets/sections-images/for-google/image3.png',
      backImage: '/assets/sections-images/for-google/image2.png',
    },
    {
      id: 'workspace',
      gridArea: 'b',
      variant: 'white',
      front: { eyebrow: 'GOOGLE WORKSPACE', title: 'Travaillez, avec ou sans Wi-Fi.' },
      back: {
        content:
          'Utilisez Gmail, Google Docs, Google Slides, Google Sheets, Google Traduction et Google Drive même sans connexion Internet.',
        cta: 'Découvrez comment travailler hors connexion',
      },
      frontImage: '/assets/sections-images/for-google/image5.png',
      backImage: '/assets/sections-images/for-google/image4.png',
      linkExist: true,
    },
  ]);

  readonly flippedStates = new Map<string, WritableSignal<boolean>>();

  constructor() {
    this.cards().forEach((card) => {
      this.flippedStates.set(card.id, signal(false));
    });
    // ensure mobile pages can be flipped as well
    this.pages().forEach((page) => {
      if (!this.flippedStates.has(page.id)) {
        this.flippedStates.set(page.id, signal(false));
      }
    });
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  currentIndex = 0;
  // how many card items visible on small screens
  readonly pageSize = 2;

  nextCard() {
    const pageCount = this.pageCount;
    if (this.currentIndex < pageCount - 1) {
      this.currentIndex++;
    }
  }

  prevCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  get pageCount(): number {
    // When we're on smaller screens, the component uses a paginated `pages()`
    // collection for the mobile carousel; use the pages() length for the
    // mobile track width and navigation. For grid/card views the pages and
    // cards may match but returning pages().length is safe for mobile logic.
    return this.pages().length;
  }

  readonly pages = signal<GoogleCard[]>([
    {
      id: 'ia',
      gridArea: 'a',
      variant: 'beige',
      front: {
        eyebrow: 'IA GOOGLE',
        title: "Accédez aux superpouvoirs de l'IA pendant votre navigation.",
      },
      back: {
        content:
          "Google intègre l'IA à ses produits pour les rendre pus utiles. Nous utilisons l'IA pour des fonctionnalités telles que la Recherche, Google Traduction et bien d'autres. De plus, nous concevons nos innovations technologiques de façon responsable.",
        cta: "Découvré l'IA Google",
      },
      frontImage: '/assets/sections-images/for-google/image6.webp',
      backImage: '/assets/sections-images/for-google/image7.webp',
      linkExist: true,
    },
    {
      id: 'search',
      gridArea: 'b',
      variant: 'yellow',
      front: {
        eyebrow: 'MOTEUR DE RECHERCHE GOOGLE',
        title: 'La barre de recherche que vous aimez, directement intégrée.',
      },
      back: {
        content:
          "Tout un univers de connaissances, à portée de main. Consultez la météo, résolvez des équations mathématiques et profitez de résultats de recherche instantanés, le tout depuis la barre d'adresse de votre navigateur.",
        cta: '',
      },
      frontImage: '/assets/sections-images/for-google/image8.webp',
      backImage: '/assets/sections-images/for-google/image2.png',
    },
  ]);

  getTransform() {
    // For the mobile carousel we'll translate by viewport percentage (page-based)
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const scroller = this.sectionRef.nativeElement.closest('.main-scroll-container');
        if (!scroller) return;

        const pill = this.pillRef.nativeElement;
        ScrollTrigger.create({
          trigger: pill,
          scroller: scroller,
          start: 'top 85%',
          once: true,
          onEnter: () => pill.classList.add('is-animated'),
        });
      }, this.sectionRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  toggleCard(cardId: string): void {
    const cardState = this.flippedStates.get(cardId);
    if (cardState) {
      cardState.update((value) => !value);
    }
  }

  isFlipped(cardId: string): boolean {
    return this.flippedStates.get(cardId)?.() || false;
  }
}
