import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WindowsObserver {
  width = signal(window.innerWidth);

  constructor() {
    const obs = new ResizeObserver((entries) => {
      const bboxSize = entries[0].borderBoxSize;
      this.width.set(bboxSize[0].inlineSize);
    }).observe(document.body);
  }
}
