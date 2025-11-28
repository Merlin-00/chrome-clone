import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  signal,
  effect,
  inject,
} from '@angular/core';
import { State } from '../../services/state';
import { CommonModule } from '@angular/common';
import { Updates } from './updates/updates';
import { Yours } from './yours/yours';
import { Safe } from './safe/safe';
import { Fast } from './fast/fast';
import { ByGoogle } from './by-google/by-google';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, Updates, Yours, Safe, Fast, ByGoogle],
  templateUrl: './features.html',
  styleUrls: ['./features.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Features implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) rootRef!: ElementRef<HTMLElement>;

  activeAnchor = signal<string>('updates');

  private io?: IntersectionObserver;
  private sections: HTMLElement[] = [];
  private ctx?: gsap.Context;
  private state = inject(State);

  constructor(private ngZone: NgZone) {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    // Keep the local `activeAnchor` synchronized with global state
    effect(() => {
      const active = this.state.activeSection();
      if (active) this.activeAnchor.set(active);
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const host = this.rootRef.nativeElement;
      this.ctx = gsap.context(() => {
        this.sections = Array.from(host.querySelectorAll<HTMLElement>('.feature-section-wrapper'));

        this.setupIntersectionObserver();
      }, host);
    });
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
    this.ctx?.revert();
  }

  private setupIntersectionObserver(): void {
    const scroller = this.rootRef.nativeElement.closest('.main-scroll-container');

    this.io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id') || '';
            this.ngZone.run(() => {
              this.activeAnchor.set(id);
              this.state.activeSection.set(id);
              // Ensure short-bar shows up once features are visible, and hide header
              console.debug('[ShortBar] featuresIntersection -> set showShortBar true for', id);
              this.state.showShortBar.set(true);
              this.state.hideHeader.set(true);
            });
          }
        });
      },
      {
        root: scroller,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      }
    );
    this.sections.forEach((s) => this.io!.observe(s));
  }

  // sticky behavior has been moved to the short-bar

  private updateGliderPosition(activeId: string): void {
    // glider is no longer managed here — short-bar handles active link highlighting
  }

  isActive(id: string): boolean {
    return this.activeAnchor() === id;
  }
}
