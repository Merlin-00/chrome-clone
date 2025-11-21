import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  NgZone,
  inject,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-keyframe-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keyframe-animation.html',
  styleUrls: ['./keyframe-animation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyframeAnimation implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLElement>;
  @ViewChildren('floatingItem') floatingItems!: QueryList<ElementRef<HTMLElement>>;

  private ngZone = inject(NgZone);
  private ctx?: gsap.Context;

  constructor() {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const scroller = this.containerRef.nativeElement.closest('.main-scroll-container');
        const actualScroller = scroller || window;

        const items = this.floatingItems.map((el) => el.nativeElement);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: this.containerRef.nativeElement,
            scroller: actualScroller,
            start: 'top 60%', // Début de l'anim d'entrée
            end: 'bottom 40%', // Fin de l'anim de sortie
            scrub: 1, // Synchronisé au scroll
          },
        });

        // Offsets pour le positionnement relatif (micro-mouvements)
        const offsets = [
          { x: -20, y: -20 }, // Panier
          { x: -20, y: 20 }, // Accessibilité
          { x: 0, y: 30 }, // Pinceau
          { x: 20, y: 20 }, // Movie
          { x: 20, y: -10 }, // Extension
        ];
        tl.from(items, {
          autoAlpha: 0,
          x: (i) => (offsets[i]?.x || 0) * 5,
          y: (i) => (offsets[i]?.y || 0) * 5,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        });

        // 2. PAUSE (Gap visuel pour qu'ils restent affichés un moment)
        tl.addLabel('pause', '+=0.5');

        // 3. SORTIE (Disparition / Dispersion — translation vers l'extérieur + fade)
        tl.to(
          items,
          {
            autoAlpha: 0,
            x: (i) => (offsets[i]?.x || 0) * 5,
            y: (i) => (offsets[i]?.y || 0) * 5,
            duration: 0.9,
            stagger: 0.05,
            ease: 'power2.in',
          },
          'pause'
        );
      }, this.containerRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
