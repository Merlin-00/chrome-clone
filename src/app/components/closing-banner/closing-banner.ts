import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-closing-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './closing-banner.html',
  styleUrls: ['./closing-banner.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClosingBanner {}
