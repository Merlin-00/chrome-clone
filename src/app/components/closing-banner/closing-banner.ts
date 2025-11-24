import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { IS_MEDIUM } from '../../app.constants';
import { WindowsObserver } from '../../services/windows-observer';

@Component({
  selector: 'app-closing-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule],
  templateUrl: './closing-banner.html',
  styleUrls: ['./closing-banner.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClosingBanner {
  private windows = inject(WindowsObserver);
  width = this.windows.width;
  medium = IS_MEDIUM;
}
