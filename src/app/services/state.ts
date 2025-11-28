import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class State {
  qrExpanded = signal<boolean>(false);
  showShortBar = signal<boolean>(false);
  // header is visible by default, hide it only when user scrolls past hero span
  hideHeader = signal<boolean>(false);
  activeSection = signal<string | null>(null);
  constructor() {}
}
