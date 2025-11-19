import {
  Component,
  ChangeDetectionStrategy,
  signal,
  ElementRef,
  NgZone,
  inject,
  afterNextRender,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

type UpdateCard = {
  id: string;
  title: string;
  subtitle?: string;
  body: string;
  bg: string;
  cta?: string;
  href?: string;
};

@Component({
  selector: 'app-updates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './updates.html',
  styleUrls: ['./updates.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Updates implements OnDestroy {
  private elementRef = inject(ElementRef<HTMLElement>);
  private ngZone = inject(NgZone);
  private ctx?: gsap.Context;

  readonly pillText = signal('mises à jour'.split(''));

  constructor() {
    this.ngZone.runOutsideAngular(() => {
      gsap.registerPlugin(ScrollTrigger);
      afterNextRender(() => {
        this.setupAnimations();
      });
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  private setupAnimations(): void {
    const host = this.elementRef.nativeElement;
    const scroller = host.closest('.main-scroll-container') as Element | null;
    if (!scroller) return;

    this.ctx = gsap.context(() => {
      const header = host.querySelector('.updates-header');
      if (header) {
        gsap.from(header, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: header, scroller: scroller, start: 'top 90%', once: true },
        });
      }

      const pillWrapper = host.querySelector('.pill-wrapper');
      if (pillWrapper) {
        ScrollTrigger.create({
          trigger: pillWrapper,
          scroller: scroller,
          start: 'top 85%',
          once: true,
          onEnter: () => pillWrapper.classList.add('is-animated'),
        });
      }

      const cards = gsap.utils.toArray<HTMLElement>(host.querySelectorAll('.update-card'));
      if (cards.length) {
        gsap.from(cards, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: host.querySelector('.updates-grid'),
            scroller: scroller,
            start: 'top 85%',
            once: true,
          },
        });
      }
    }, host);
  }

  readonly cards = signal<UpdateCard[]>([
    {
      id: 'auto',
      title: 'Mises à jour automatiques',
      body: 'Toutes les quatre semaines, une nouvelle mise à jour de Chrome est publiée. Ainsi, vous bénéficiez des dernières fonctionnalités, ainsi que d’un navigateur Web plus sûr et plus rapide.',
      bg: 'rgb(232, 240, 254)',
      cta: 'En savoir plus sur les mises à jour automatiques',
      href: '#',
    },
    {
      id: 'news',
      title: 'Nouveautés de Chrome',
      body: 'De nouveaux outils et fonctionnalités sont régulièrement ajoutés à Chrome pour améliorer votre expérience.',
      bg: 'rgb(254, 247, 224)',
      cta: 'Découvrez les nouveautés de Chrome',
      href: '#',
    },
  ]);
}
