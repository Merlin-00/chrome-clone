import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// On définit des types pour nos données pour un code plus propre
type SocialLink = { name: string; icon: string; url: string };
type FooterColumn = { title: string; links: { text: string; url: string; arrow?: boolean }[] };

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  // --- Données du Footer ---
  readonly socialLinks = signal<SocialLink[]>([
    { name: 'YouTube', icon: 'assets/icons/youtube.svg', url: '#' },
    { name: 'X', icon: 'assets/icons/x.svg', url: '#' },
    { name: 'Facebook', icon: 'assets/icons/facebook.svg', url: '#' },
    { name: 'LinkedIn', icon: 'assets/icons/linkedin.svg', url: '#' },
    { name: 'TikTok', icon: 'assets/icons/tiktok.svg', url: '#' },
  ]);

  readonly columns = signal<FooterColumn[]>([
    {
      title: 'Produits Chrome',
      links: [
        { text: 'Autres plates-formes', url: '#', arrow: false },
        { text: 'Chromebooks', url: '#' },
        { text: 'Chromecast', url: 'https://www.google.com/intl/fr_fr/chrome/devices/chromecast/' },
        { text: 'Chrome Web Store', url: '#' },
      ],
    },
    {
      title: 'Entreprise',
      links: [
        { text: 'Download Chrome Browser', url: '#' },
        { text: 'Chrome Browser for Enterprise', url: '#' },
        { text: 'Appareils Chrome', url: '#' },
        { text: 'ChromeOS', url: '#' },
        { text: 'Google Cloud', url: '#' },
        { text: 'Google Workspace', url: '#' },
      ],
    },
    {
      title: 'Éducation',
      links: [
        { text: 'Navigateur Google Chrome', url: '#' },
        { text: 'Appareils', url: '#' },
      ],
    },
    {
      title: 'Développeurs et partenaires',
      links: [
        { text: 'Chromium', url: '#' },
        { text: 'ChromeOS', url: '#' },
        { text: 'Chrome Web Store', url: '#' },
        { text: 'Chrome Experiments', url: '#' },
        { text: 'Version bêta de Chrome', url: '#', arrow: false },
        { text: 'Chrome pour les développeurs', url: '#', arrow: false },
        { text: 'Chrome Canary', url: '#', arrow: false },
      ],
    },
    {
      title: 'Assistance',
      links: [
        { text: 'Aide Chrome', url: '#' },
        { text: 'Mettre à jour Chrome', url: '#' },
        { text: 'Astuces Chrome', url: '#', arrow: false },
        { text: 'Blog Google Chrome', url: '#' },
      ],
    },
  ]);

  // Which column is expanded on medium / small screens.
  expandedColumn = signal<number | null>(0);

  toggleColumn(index: number) {
    this.expandedColumn.set(this.expandedColumn() === index ? null : index);
  }
}
