import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// On définit des types pour nos données pour un code plus propre
type SocialLink = { name: string; icon: string; url: string };
type FooterColumn = { title: string; links: { text: string; url: string }[] };

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
    { name: 'YouTube', icon: 'youtube', url: '#' },
    { name: 'X', icon: 'twitter', url: '#' },
    { name: 'Facebook', icon: 'facebook', url: '#' },
    { name: 'LinkedIn', icon: 'linkedin', url: '#' },
    { name: 'TikTok', icon: 'tiktok', url: '#' },
  ]);

  readonly columns = signal<FooterColumn[]>([
    {
      title: 'Produits Chrome',
      links: [
        { text: 'Autres plates-formes', url: '#' },
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
        { text: 'Version bêta de Chrome', url: '#' },
        { text: 'Chrome pour les développeurs', url: '#' },
        { text: 'Chrome Canary', url: '#' },
      ],
    },
    {
      title: 'Assistance',
      links: [
        { text: 'Aide Chrome', url: '#' },
        { text: 'Mettre à jour Chrome', url: '#' },
      ],
    },
  ]);
}
