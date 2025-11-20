import { Component, ElementRef, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { SidenavService } from '../../services/sidenav';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatToolbarModule, MatDividerModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private sidenav = inject(SidenavService);
  private el = inject(ElementRef);

  toggleMenu(): void {
    this.sidenav.toggle();
  }
}
