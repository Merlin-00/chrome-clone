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
    },
    {
      id: 'devices',
      title: 'Naviguez sur tous les appareils',
      description:
        "Connectez-vous à Chrome sur l'appareil de votre choix pour accéder à vos favoris, mots de passe enregistrés et bien plus encore.",
    },
    {
      id: 'autofill',
      title: 'Gagnez du temps avec la saisie automatique',
      description:
        'Enregistrez des adresses, des mots de passe et bien plus dans Chrome pour la saisie automatique de vos informations.',
    },
  ]);

  readonly activeIndex = signal(0);
  readonly isPaused = signal(false);
  readonly isMobile = signal(window.matchMedia('(max-width: 768px)').matches);
  readonly activeId = computed(() => this.items()[this.activeIndex()]?.id || '');

  @HostBinding('class.is-paused') get pausedClass() {
    return this.isPaused();
  }

  private timer: any;
  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;

  constructor() {
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
      this.intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          this.ngZone.run(() => this.isPaused.set(!entry.isIntersecting));
        },
        { threshold: 0.2 }
      );
      this.intersectionObserver.observe(this.elementRef.nativeElement);

      this.resizeObserver = new ResizeObserver(() => {
        this.ngZone.run(() => this.isMobile.set(window.matchMedia('(max-width: 768px)').matches));
      });
      this.resizeObserver.observe(document.body);
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }

  private startTimer(): void {
    this.stopTimer();
    this.timer = setInterval(() => this.next(), 7000);
  }

  private stopTimer(): void {
    clearInterval(this.timer);
  }

  private next(): void {
    this.activeIndex.update((current) => (current + 1) % this.items().length);
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
}
