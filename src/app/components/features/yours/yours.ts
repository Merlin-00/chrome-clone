import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  NgZone,
  inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { TimedAccordion } from './timed-accordion/timed-accordion';
import { KeyframeAnimation } from './keyframe-animation/keyframe-animation';
import { Skeleton } from '../../skeleton/skeleton';

@Component({
  selector: 'app-yours',
  standalone: true,
  imports: [CommonModule, TimedAccordion, KeyframeAnimation, Skeleton],
  templateUrl: './yours.html',
  styleUrls: ['./yours.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Yours implements AfterViewInit, OnDestroy {
  @ViewChild('section', { static: true }) sectionRef!: ElementRef<HTMLElement>;
  @ViewChild('pill', { static: true }) pillRef!: ElementRef<HTMLElement>;
  @ViewChild('stickyContainer', { static: true }) stickyContainerRef!: ElementRef<HTMLElement>;

  private elementRef = inject(ElementRef);
  private ngZone = inject(NgZone);
  private ctx?: gsap.Context;

  readonly pillText = 'Personnalisez-le'.split('');

  constructor() {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ctx = gsap.context(() => {
          const scroller = this.elementRef.nativeElement.closest('.main-scroll-container');
          if (!scroller) {
            console.error('Scroller .main-scroll-container non trouvé.');
            return;
          }

          this.initPillAnimation(scroller);

          gsap.matchMedia().add('(min-width: 769px)', () => {
            this.initTakeOverAnimation(scroller);
          });

          ScrollTrigger.refresh();
        }, this.sectionRef.nativeElement);
      }, 50);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  private initPillAnimation(scroller: Element): void {
    const pill = this.pillRef.nativeElement;
    ScrollTrigger.create({
      trigger: pill,
      scroller: scroller,
      start: 'top 85%',
      once: true,
      onEnter: () => pill.classList.add('is-animated'),
    });
  }

  private initTakeOverAnimation(scroller: Element): void {
    const hostElement = this.sectionRef.nativeElement;
    const stickyContainer = this.stickyContainerRef.nativeElement;
    const target = hostElement;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stickyContainer,
        scroller: scroller,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(
      target,
      {
        '--title-translate-y': '20vh',
        '--title-opacity': 0,
        '--title-z-index': 1,
        duration: 0.2,
        ease: 'power2.in',
      },
      0
    ).to(
      target,
      {
        '--viewport-width': '90vw',
        '--viewport-max-width': '1200px',
        '--viewport-radius': '24px',
        '--bg-image-scale': 1,
        duration: 0.4,
        ease: 'power2.inOut',
      },
      0
    );

    tl.to(
      target,
      {
        '--curtain-clip': '100%',
        duration: 0.3,
        ease: 'power2.inOut',
      },
      '+=0.05'
    );

    tl.to(
      target,
      {
        '--second-image-clip': '0%',
        duration: 0.4,
        ease: 'power2.inOut',
      },
      '+=0.1'
    );
  }
}
