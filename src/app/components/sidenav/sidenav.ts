import { Component, ElementRef, ChangeDetectionStrategy, effect, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SidenavService } from '../../services/sidenav';
import gsap from 'gsap';
import { MatNavList } from '@angular/material/list';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatNavList, NgOptimizedImage],
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav {
  private sidenav = inject(SidenavService);
  private el = inject(ElementRef);

  constructor() {
    effect(() => {
      const open = this.sidenav.isOpen();
      this.animate(open);
    });
  }

  close() {
    this.sidenav.close();
  }

  private animate(open: boolean): void {
    const sidenav = this.el.nativeElement.querySelector('.sidenav');
    const backdrop = this.el.nativeElement.querySelector('.sidenav__backdrop');
    const closeBtn = this.el.nativeElement.querySelector('.close-btn');

    gsap.to(sidenav, {
      x: open ? 0 : '-100%',
      duration: 0.4,
      ease: 'power3.out',
    });

    gsap.to(backdrop, {
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      duration: 0.3,
      ease: 'power2.out',
    });

    // animate close button visibility so it doesn't remain visible when drawer is closed
    if (closeBtn) {
      gsap.to(closeBtn, {
        opacity: open ? 1 : 0,
        x: open ? 0 : -16,
        duration: 0.25,
        ease: 'power2.out',
      });
      // pointer-events can't be animated smoothly, set immediately
      closeBtn.style.pointerEvents = open ? 'auto' : 'none';
    }
  }
}
