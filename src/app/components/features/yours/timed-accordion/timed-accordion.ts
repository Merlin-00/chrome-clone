import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  ElementRef,
  NgZone,
  inject,
  signal,
  computed,
  effect,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type AccordionItem = {
  id: string;
  title: string;
  description: string;
  cta?: string;
  image: string;
  imageMobile: string;
};

@Component({
  selector: 'app-timed-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timed-accordion.html',
  styleUrls: ['./timed-accordion.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimedAccordion implements OnDestroy {
  private elementRef = inject(ElementRef);
  private ngZone = inject(NgZone);

  readonly items = signal<AccordionItem[]>([
    {
      id: 'customize',
      title: 'Personnalisez Chrome',
      description:
        "Personnalisez votre navigateur Web grâce à des thèmes, au mode sombre ainsi qu'à d'autres options conçues juste pour vous.",
      cta: 'Découvrir les thèmes',
      image: 'assets/sections-images/yours/image1.webp',
      imageMobile: 'assets/sections-images/yours/image1-mobile.png',
    },
    {
      id: 'devices',
      title: 'Naviguez sur tous les appareils',
      description:
        "Connectez-vous à Chrome sur l'appareil de votre choix pour accéder à vos favoris, mots de passe enregistrés et bien plus encore.",
      image: 'assets/sections-images/yours/image2.webp',
      imageMobile: 'assets/sections-images/yours/image2-mobile.png',
    },
    {
      id: 'autofill',
      title: 'Gagnez du temps avec la saisie automatique',
      description:
        'Enregistrez des adresses, des mots de passe et bien plus dans Chrome pour la saisie automatique de vos informations.',
      image: 'assets/sections-images/yours/image3.png',
      imageMobile: 'assets/sections-images/yours/image3-mobile.webp',
    },
  ]);

  readonly activeIndex = signal(0);
  readonly isPaused = signal(false);
  readonly isMobile = signal(false);
  readonly activeId = computed(() => this.items()[this.activeIndex()]?.id || '');

  @HostBinding('class.is-paused') get pausedClass() {
    return this.isPaused();
  }

  private timer: any;
  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private intervalMs = 5000;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isMobile.set(window.matchMedia('(max-width: 768px)').matches);
    }

    effect(() => {
      if (this.isMobile()) {
        this.stopTimer();
        return;
      }
      if (this.isPaused()) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    });

    this.ngZone.runOutsideAngular(() => {
      if (typeof IntersectionObserver !== 'undefined') {
        this.intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            this.ngZone.run(() => this.isPaused.set(!entry.isIntersecting));
          },
          { threshold: 0.2 }
        );
        this.intersectionObserver.observe(this.elementRef.nativeElement);
      }

      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => {
          this.ngZone.run(() => this.isMobile.set(window.matchMedia('(max-width: 768px)').matches));
        });
        this.resizeObserver.observe(document.body);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }

  private startTimer(): void {
    this.stopTimer();
    try {
      (this.elementRef.nativeElement as HTMLElement).style.setProperty(
        '--progress-duration',
        `${this.intervalMs / 1000}s`
      );
    } catch (e) {}

    this.timer = setInterval(() => this.next(), this.intervalMs);
    this.restartProgressAnimation();
  }

  private stopTimer(): void {
    clearInterval(this.timer);
  }

  private next(): void {
    this.activeIndex.update((current) => (current + 1) % this.items().length);
    Promise.resolve().then(() => this.restartProgressAnimation());
  }

  selectItem(index: number): void {
    if (this.isMobile()) return;

    if (index === this.activeIndex()) {
      this.isPaused.update((paused) => !paused);
    } else {
      this.activeIndex.set(index);
      this.isPaused.set(false);
      this.startTimer();
    }
  }

  private restartProgressAnimation(): void {
    try {
      const root = this.elementRef.nativeElement as HTMLElement;
      const el = root.querySelector('.item.is-active .item-progress-fill') as HTMLElement | null;
      if (!el) return;
      el.style.animation = 'none';
      el.offsetWidth;
      el.style.animation = '';
    } catch (e) {
      // ignore DOM errors
    }
  }
}
