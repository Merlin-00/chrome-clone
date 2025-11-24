import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class State {
  qrExpanded = signal<boolean>(false);
  showShortBar = signal<boolean>(false);
  constructor() {}
}
