import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
  afterNextRender,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Skeleton } from '../skeleton/skeleton';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, Skeleton, MatIconModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLElement>;
  @ViewChild('mosaic', { static: true }) mosaicRef!: ElementRef<HTMLElement>;
  @ViewChild('track', { static: true }) trackRef!: ElementRef<HTMLElement>;

  private ctx?: gsap.Context;
  private elementRef = inject(ElementRef);

  constructor(private ngZone: NgZone) {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    this.setupViewportListener();
    afterNextRender(() => {
      this.ngZone.runOutsideAngular(() => {
        this.ctx = gsap.context(() => {
          this.setupAnimations();
        }, this.containerRef.nativeElement);
      });
    });
  }

  // Signal to track whether viewport is large enough to show the QR widget
  isLarge = signal(false);

  // Signal to track whether QR block is expanded (shows QR + text) or collapsed (tablet icon)
  qrExpanded = signal(true);

  private mql?: MediaQueryList;
  private mqlListener?: (e?: MediaQueryListEvent) => void;

  private setupViewportListener(): void {
    if (typeof window === 'undefined') return;
    this.mql = window.matchMedia('(min-width: 1025px)');
    const update = () => this.isLarge.set(this.mql?.matches ?? false);
    this.mqlListener = () => update();
    update();
    // listen for changes
    if (this.mql.addEventListener && this.mqlListener) {
      this.mql.addEventListener('change', this.mqlListener);
    } else if ((this.mql as any).addListener && this.mqlListener) {
      // fallback for older browsers
      (this.mql as any).addListener(this.mqlListener);
    }
  }

  toggleQr(): void {
    this.qrExpanded.update((v) => !v);
    // animate the newly rendered block after the next render
    afterNextRender(() => {
      const selector = this.qrExpanded() ? '.footer-qr-code' : '.item2';
      const el = this.elementRef.nativeElement.querySelector(selector) as HTMLElement | null;
      if (el) {
        gsap.fromTo(
          el,
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
        );
      }
    });
  }

  ngAfterViewInit(): void {
    this.waitForImages();
  }

  ngOnDestroy(): void {
    if (this.ctx) this.ctx.revert();
    if (this.mql && this.mqlListener) {
      if (this.mql.removeEventListener) {
        this.mql.removeEventListener('change', this.mqlListener);
      } else if ((this.mql as any).removeListener) {
        (this.mql as any).removeListener(this.mqlListener);
      }
    }
  }

  private waitForImages(): void {
    const trackEl = this.trackRef.nativeElement as HTMLElement;
    const imgs = Array.from(trackEl.querySelectorAll('img')) as HTMLImageElement[];
    if (imgs.length === 0) {
      ScrollTrigger.refresh();
      return;
    }
    let pending = imgs.length;
    const markLoaded = () => {
      pending--;
      if (pending <= 0) {
        this.ngZone.runOutsideAngular(() => ScrollTrigger.refresh());
      }
    };
    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth !== 0) {
        pending--;
      } else {
        img.addEventListener('load', markLoaded, { once: true });
        img.addEventListener('error', markLoaded, { once: true });
      }
    });
    if (pending === 0) {
      this.ngZone.runOutsideAngular(() => ScrollTrigger.refresh());
    }
  }

  // Dans hero.ts

  private setupAnimations(): void {
    const scroller = this.elementRef.nativeElement.closest('.main-scroll-container');
    if (!scroller) return;

    const mosaic = this.mosaicRef.nativeElement;
    const track = this.trackRef.nativeElement;

    this.ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(track.querySelectorAll('.mosaic__card'));
      const firstCard = cards[0];
      const secondCard = cards[1];
      const otherCards = cards.slice(2);
      const initialVisibleCards = [firstCard, ...otherCards];

      const computeMaxTranslate = () =>
        track.scrollWidth - mosaic.clientWidth + window.innerWidth * 0.15;

      gsap.matchMedia().add(
        {
          isDesktop: '(min-width: 1025px)',
          isTabletOrMobile: '(max-width: 1024px)',
        },
        (context) => {
          const { isDesktop } = context.conditions as any;

          if (isDesktop) {
            mosaic.style.display = 'flex';

            gsap.set(initialVisibleCards, { y: (i) => (i % 2 === 0 ? -60 : 60) });
            gsap.set(firstCard, { x: '20vw' });
            gsap.set(secondCard, { y: '100vh' });

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: mosaic,
                scroller: scroller,
                scrub: 1.2,
                start: 'top 80%',
                end: 'bottom 20%',
                invalidateOnRefresh: true,
              },
            });

            tl.to(initialVisibleCards, { y: 0, ease: 'power2.inOut' }, 0);
            tl.to(firstCard, { x: 0, ease: 'power2.inOut' }, 0);
            tl.to(
              secondCard,
              {
                y: 0,
                ease: 'power2.out',
                onStart: () => {
                  gsap.set(secondCard, { visibility: 'visible' });
                },
              },
              0
            ).to(
              secondCard,
              {
                '--card-opacity': 1,
                duration: 0.4,
                ease: 'power1.in',
              },
              0.1
            );
            tl.to(track, { x: () => -computeMaxTranslate(), ease: 'none' }, '>-0.5');
          } else {
            mosaic.style.display = 'flex';
          }
        }
      );
    }, this.containerRef.nativeElement);
  }
}
