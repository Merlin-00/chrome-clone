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
import { MatIconModule } from '@angular/material/icon';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Skeleton } from '../../../skeleton/skeleton';

@Component({
  selector: 'app-keyframe-animation',
  standalone: true,
  imports: [CommonModule, MatIconModule, Skeleton],
  templateUrl: './keyframe-animation.html',
  styleUrls: ['./keyframe-animation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyframeAnimation implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLElement>;
  @ViewChildren('layer') layers!: QueryList<ElementRef<HTMLElement>>;

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
        if (!scroller) return;

        const layerElements = this.layers.map((elRef) => elRef.nativeElement);
        const [browserEl, ...iconEls] = layerElements;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: this.containerRef.nativeElement,
            scroller: scroller,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 1.5,
          },
        });

        tl.from(browserEl, {
          scale: 0.8,
          autoAlpha: 0,
          ease: 'power2.out',
          duration: 0.5,
        });

        const startPositions = [
          { x: '-50vw', y: '-10vh' },
          { x: '50vw', y: '-10vh' },
          { x: '50vw', y: '10vh' },
          { x: '-50vw', y: '10vh' },
        ];

        tl.fromTo(
          iconEls,
          {
            x: (i) => startPositions[i].x,
            y: (i) => startPositions[i].y,
            scale: 0,
            autoAlpha: 0,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            autoAlpha: 1,
            stagger: 0.1,
            ease: 'power2.out',
            duration: 0.8,
          },
          0.2
        );
      }, this.containerRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
