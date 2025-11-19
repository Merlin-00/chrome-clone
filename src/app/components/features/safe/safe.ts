import {
  Component,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
  AfterViewInit,
  ElementRef,
  ViewChild,
  inject,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

type SafeCard = {
  id: string;
  gridArea: string;
  variant: 'white' | 'light-blue' | 'blue' | 'dark-blue';
  front: { title: string; content: string; icon?: string };
  back: { title: string; content: string; cta: string };
};

@Component({
  selector: 'app-safe',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './safe.html',
  styleUrls: ['./safe.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Safe implements AfterViewInit, OnDestroy {
  @ViewChild('pill', { static: true }) pillRef!: ElementRef<HTMLElement>;
  @ViewChild('section', { static: true }) sectionRef!: ElementRef<HTMLElement>;

  private ngZone = inject(NgZone);
  private ctx?: gsap.Context;

  readonly pillText = 'sécurisé'.split('');

  readonly cards = signal<SafeCard[]>([
    {
      id: 'password-manager',
      gridArea: 'password',
      variant: 'white',
      front: {
        title: 'Gestionnaire de mots de passe sécurisés sur tous les sites.',
        content: 'elisa.beckett',
      },
      back: {
        title: 'Enregistrer le mot de passe?',
        content:
          'Avec le Gestionnaire de mots de passe de Google intégré à Chrome, vous pouvez facilement créer, enregistrer et renseigner vos mots de passe.',
        cta: 'En savoir plus',
      },
    },
    {
      id: 'safety-check',
      gridArea: 'check',
      variant: 'light-blue',
      front: {
        title: 'En un clic, vérifiez votre niveau de sécurité en temps réel.',
        content: '',
        icon: 'add_circle',
      },
      back: {
        title: 'Contrôle de sécurité effectué. Il y a peu.',
        content:
          'La confidentialité de votre expérience de navigation sur Internet, y compris des mots de passe, des extensions et des paramètres.',
        cta: 'En savoir plus',
      },
    },
    {
      id: 'privacy-guide',
      gridArea: 'guide',
      variant: 'dark-blue',
      front: {
        title: 'Guide sur la confidentialité',
        content:
          'Gardez le contrôle de votre confidentialité grâce à des paramètres faciles à utiliser.',
      },
      back: {
        title: 'Consulter le Guide sur la confidentialité',
        content:
          'Avec Chrome, vous savez exactement ce que vous partagez en ligne et avec qui. Consultez le Guide sur la confidentialité pour découvrir pas à pas vos paramètres de confidentialité.',
        cta: 'En savoir plus',
      },
    },
    {
      id: 'safe-browsing',
      gridArea: 'browsing',
      variant: 'white',
      front: {
        title: 'Navigation sécurisée avec protection renforcée',
        content: 'Naviguez en toute confiance, avec une meilleure protection en ligne.',
        icon: 'add_circle',
      },
      back: {
        title: 'Le site que vous allez ouvrir contient des logiciels malveillants',
        content:
          "La navigation sécurisée de Chrome vous avertit en cas d'attaque par un logiciel malveillant ou par hameçonnage.",
        cta: 'En savoir plus',
      },
    },
  ]);

  readonly flippedStates = new Map<string, WritableSignal<boolean>>();

  constructor() {
    this.cards().forEach((card) => {
      this.flippedStates.set(card.id, signal(false));
    });
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
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

  flipCard(cardId: string): void {
    const cardState = this.flippedStates.get(cardId);
    if (cardState) {
      cardState.update((value) => !value);
    }
  }

  isFlipped(cardId: string): boolean {
    return this.flippedStates.get(cardId)?.() || false;
  }
}
