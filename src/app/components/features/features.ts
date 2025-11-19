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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
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
  imports: [CommonModule, Updates, Yours, Safe, Fast, ByGoogle, MatIcon],
  templateUrl: './features.html',
  styleUrls: ['./features.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Features implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) rootRef!: ElementRef<HTMLElement>;
  @ViewChild('navContainer', { static: true }) navContainerRef!: ElementRef<HTMLElement>;
  @ViewChild('navList', { static: true }) navListRef!: ElementRef<HTMLUListElement>;
  @ViewChild('glider', { static: true }) gliderRef!: ElementRef<HTMLElement>;

  activeAnchor = signal<string>('updates');
  isMobileMenuOpen = signal<boolean>(false);

  private io?: IntersectionObserver;
  private sections: HTMLElement[] = [];
  private st?: ScrollTrigger;
  private ctx?: gsap.Context;

  constructor(private ngZone: NgZone) {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    effect(() => {
      this.updateGliderPosition(this.activeAnchor());
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const host = this.rootRef.nativeElement;
      this.ctx = gsap.context(() => {
        this.sections = Array.from(host.querySelectorAll<HTMLElement>('.feature-section-wrapper'));

        this.setupIntersectionObserver();
        this.setupStickyBehavior();
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
            this.ngZone.run(() => this.activeAnchor.set(id));
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

  private setupStickyBehavior(): void {
    const scroller = this.rootRef.nativeElement.closest('.main-scroll-container');
    const nav = this.navContainerRef.nativeElement;

    this.st = ScrollTrigger.create({
      scroller: scroller,
      trigger: this.rootRef.nativeElement,
      start: 'top top-=-64px',
      end: 'bottom bottom',
      toggleClass: {
        targets: nav,
        className: 'is-sticky',
      },
      onUpdate: (self) => {
        if (window.innerWidth <= 600) {
          nav.classList.toggle('is-hidden', self.direction === 1);
        }
      },
    });
  }

  private updateGliderPosition(activeId: string): void {
    if (this.isMobileMenuOpen()) return;

    const navList = this.navListRef.nativeElement;
    const activeLink = navList.querySelector(`a[href="#${activeId}"]`) as HTMLElement;
    const glider = this.gliderRef.nativeElement;

    if (activeLink) {
      gsap.to(glider, {
        x: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  }

  isActive(id: string): boolean {
    return this.activeAnchor() === id;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
