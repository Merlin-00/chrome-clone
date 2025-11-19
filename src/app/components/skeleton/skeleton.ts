import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.html',
  styleUrls: ['./skeleton.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skeleton {
  /** Type du skeleton à afficher */
  @Input() type: 'login-ui' | 'search-ui' | 'dark-mode-ui' = 'login-ui';
}
