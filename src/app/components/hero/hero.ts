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
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { MatCheckbox } from '@angular/material/checkbox';
import { IS_MEDIUM } from '../../app.constants';
import { WindowsObserver } from '../../services/windows-observer';
import { State } from '../../services/state';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCheckbox, NgOptimizedImage],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLElement>;
  @ViewChild('mosaic', { static: true }) mosaicRef!: ElementRef<HTMLElement>;
  @ViewChild('track', { static: true }) trackRef!: ElementRef<HTMLElement>;
  @ViewChild('hS', { static: true }) hSTextRef!: ElementRef<HTMLElement>;
  @ViewChild('headline', { static: true }) headlineRef!: ElementRef<HTMLElement>;

  private windows = inject(WindowsObserver);
  width = this.windows.width;
  medium = IS_MEDIUM;
  state = inject(State);
  toggleQr() {
    this.state.qrExpanded.update((v) => !v);
  }

  private ctx?: gsap.Context;
  private elementRef = inject(ElementRef);
  private shortBarST?: ScrollTrigger;
  private shortBarFallbackST?: ScrollTrigger;
  private hideHeaderST?: ScrollTrigger;
  private hideHeaderFallbackST?: ScrollTrigger;

  constructor(private ngZone: NgZone) {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    afterNextRender(() => {
      this.ngZone.runOutsideAngular(() => {
        this.ctx = gsap.context(() => {
          this.setupAnimations();
        }, this.containerRef.nativeElement);
      });
    });
  }

  ngAfterViewInit(): void {
    this.waitForImages();
  }

  ngOnDestroy(): void {
    if (this.ctx) this.ctx.revert();
    if (this.shortBarST) this.shortBarST.kill();
    if (this.shortBarFallbackST) this.shortBarFallbackST.kill();
    if (this.hideHeaderST) this.hideHeaderST.kill();
    if (this.hideHeaderFallbackST) this.hideHeaderFallbackST.kill();
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
            gsap.set(firstCard, { x: '15vw' });
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
      // ScrollTrigger to toggle short-bar visibility when users reach the hero note/h-s element
      if (this.hSTextRef) {
        // Short-bar should appear when we reach a little before center
        this.shortBarST = ScrollTrigger.create({
          scroller: scroller,
          trigger: this.hSTextRef.nativeElement,
          start: 'top 65%',
          end: 'bottom top',
          onEnter: () => this.state.showShortBar.set(true),
          onLeaveBack: () => this.state.showShortBar.set(false),
        });

        // Hide header slightly before the short-bar appears to create the desired visual effect
        this.hideHeaderST = ScrollTrigger.create({
          scroller: scroller,
          trigger: this.hSTextRef.nativeElement,
          start:
            (typeof this.width === 'function' ? this.width() : this.width) >= this.medium
              ? 'top 65%'
              : 'top 55%',
          end: 'bottom top',
          onEnter: () => this.state.hideHeader.set(true),
          onLeaveBack: () => this.state.hideHeader.set(false),
        });
      } else if (this.headlineRef) {
        // Fallback: use the headline to toggle short-bar when the hero note isn't present (e.g., mobile)
        this.shortBarFallbackST = ScrollTrigger.create({
          scroller: scroller,
          trigger: this.headlineRef.nativeElement,
          start: 'top 75%',
          end: 'bottom top',
          onEnter: () => this.state.showShortBar.set(true),
          onLeaveBack: () => this.state.showShortBar.set(false),
        });

        // Hide header slightly before the short-bar appears on fallback as well
        this.hideHeaderFallbackST = ScrollTrigger.create({
          scroller: scroller,
          trigger: this.headlineRef.nativeElement,
          start: 'top 70%',
          end: 'bottom top',
          onEnter: () => this.state.hideHeader.set(true),
          onLeaveBack: () => this.state.hideHeader.set(false),
        });
      }
    }, this.containerRef.nativeElement);
  }
}
