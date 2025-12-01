import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { isPlatformBrowser } from '@angular/common';
import { IS_MEDIUM } from '../../app.constants';
import { State } from '../../services/state';
import { WindowsObserver } from '../../services/windows-observer';

@Component({
  selector: 'app-short-bar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSelectModule],
  template: `
    @if (showShortBar()) {
    <mat-toolbar class="shortbar" role="navigation">
      @if (width() >= medium) {
      <!-- Version bureau -->
      <div class="links">
        @for (section of sectionsNav; track $index) {
        <a
          href="#{{ section.hash }}"
          class="{{ activeSection() === section.hash ? 'active' : '' }}"
          (click)="onClick($event, section.hash)"
        >
          {{ section.label }}
        </a>
        }
      </div>
      <button class="btn" mat-flat-button>
        <mat-icon>download</mat-icon>
        Télécharger
      </button>
      } @else {
      <!-- Version mobile -->
      <mat-select
        class="mobile-select"
        placeholder="Explorer"
        [value]="activeSection()"
        (selectionChange)="onSelect($event.value)"
      >
        @for (section of sectionsNavMobile; track $index) {
        <mat-option [value]="section.hash">{{ section.label }}</mat-option>
        }
      </mat-select>

      <button class="btn" style="font-size: 14px; width: 80%;" mat-flat-button>
        Télécharger Chrome
      </button>
      }
    </mat-toolbar>
    }
  `,
  styles: `
    .shortbar {
      position: fixed;
      top: 5%;
      right: 50%;
      transform: translateX(50%);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background-color: white;
      border: 1px solid #dadce0;
      box-shadow: 0 6px 18px rgba(32, 33, 36, 0.08);
      border-radius: 35px;
      z-index: 1201;
      max-width: max-content;
      height: fit-content;
          .btn {
            background-color: #1a73e8;
            color: #fff;
            border-radius: 999px;
            font-size: 12px;
            padding: 1.5rem;
            padding-top: 0;
            padding-bottom: 0;
            transition: background-color 0.2s;
          }

          .btn:hover {
            background-color: #0f5fc9ff;
          }

    }

    .links {
      display: flex;
      gap: 1.5rem;
      padding: 0;
    }

    .links a {    
      padding: 0.3rem 0.8rem;
      border-radius: 999px;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .links a.active,
    .links a:hover {
      background-color: #eef0f1;
    }

    @keyframes shortbar-enter {
      from { opacity: 0; transform: translateY(-8px) scale(.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    
      .mobile-select {
        width: 50%;
        margin-right: 2rem;
        color: #1a73e8;
      }


    /* --- Version mobile --- */
    @media (max-width: 1022px) {
      .shortbar {
        position: fixed;
        right: 0;
        bottom: 0;
        top: auto;
        justify-content: space-between;
        border-radius: 0;
        border-top: 1px solid #dadce0;
        box-shadow: 0 -4px 18px rgba(32, 33, 36, 0.08);
        animation: shortbar-enter 360ms cubic-bezier(.2,.8,.2,1) both;
        padding: 0.75rem 1rem;
        max-width: 100%;
        height: 10%;
      }
    }
  `,
})
export class ShortBar {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    console.debug('[ShortBar] instantiated');
  }
  private windows = inject(WindowsObserver);
  width = this.windows.width;
  medium = IS_MEDIUM;

  sectionsNav = [
    { label: 'Mises à jour', hash: 'updates' },
    { label: 'À vous', hash: 'yours' },
    { label: 'Sécurisé', hash: 'safe' },
    { label: 'Rapide', hash: 'fast' },
    { label: 'Par Google', hash: 'by-google' },
  ];
  sectionsNavMobile = [
    { label: 'Rapide', hash: 'fast' },
    { label: 'Sécurisé', hash: 'safe' },
    { label: 'À vous', hash: 'yours' },
    { label: 'Par Google', hash: 'by-google' },
  ];

  private state = inject(State);
  showShortBar = this.state.showShortBar;
  activeSection = this.state.activeSection;

  onClick(e: Event, hash: string) {
    e.preventDefault();
    this.navigateTo(hash);
  }

  onSelect(hash: string) {
    this.navigateTo(hash);
  }

  private navigateTo(hash: string) {
    this.activeSection.set(hash);
    if (isPlatformBrowser(this.platformId)) {
      window.location.hash = hash;
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
