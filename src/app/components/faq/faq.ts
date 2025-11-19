import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// On définit un type pour nos questions/réponses
type FaqItem = {
  question: string;
  answer: string;
};

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './faq.html',
  styleUrls: ['./faq.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Faq {
  readonly openIndex = signal<number | null>(null);

  // --- Les données de la FAQ ---
  readonly faqItems = signal<FaqItem[]>([
    {
      question: 'Comment définir Google Chrome comme navigateur Web par défaut ?',
      answer:
        'Vous pouvez configurer Chrome comme votre navigateur par défaut sur les systèmes d\'exploitation Windows et Mac, mais aussi sur vos appareils iPhone, iPad ou Android. Dans ce cas, les liens sur lesquels vous cliquez s\'ouvrent automatiquement dans Chrome. Pour connaître les instructions spécifiques de votre appareil, <a href="#">consultez cette page</a>.',
    },
    {
      question: 'Comment personnaliser Chrome ?',
      answer:
        'Vous pouvez tester différents thèmes, couleurs et paramètres en temps réel en ouvrant simplement un nouvel onglet dans Chrome, puis en cliquant sur l\'icône "Personnaliser Chrome" en bas à droite. Un nouveau panneau latéral s\'ouvre alors, avec toutes les fonctionnalités de personnalisation disponibles. <a href="#">En savoir plus sur la personnalisation dans Chrome</a>',
    },
    {
      question: "Les paramètres de sécurité Chrome, qu'est-ce que c'est ?",
      answer:
        'Fort d\'un système et de fonctionnalités de sécurité de pointe, Chrome vous permet de gérer votre sécurité. Utilisez le contrôle de sécurité pour détecter instantanément les mots de passe compromis, connaître l\'état de la navigation sécurisée et accéder aux mises à jour Chrome disponibles. <a href="#">En savoir plus sur la sécurité avec Chrome</a>',
    },
    {
      question: "Le Gestionnaire de mots de passe Chrome, qu'est-ce que c'est ?",
      answer:
        'Avec le Gestionnaire de mots de passe de Google, Chrome vous permet d\'enregistrer, de gérer et de protéger vos mots de passe en ligne en toute simplicité. Il vous offre également la possibilité de créer des mots de passe uniques et sécurisés pour chaque compte que vous utilisez. <a href="#">En savoir plus sur le Gestionnaire de mots de passe de Google</a>',
    },
    {
      question: 'Comment ajouter une extension de navigateur à Chrome ?',
      answer:
        'Rien de plus facile que d\'ajouter des extensions à Chrome pour ordinateur. Accédez tout simplement au Chrome Web Store, recherchez et sélectionnez l\'extension qui vous intéresse, puis cliquez sur "Ajouter à Chrome". Certaines extensions peuvent nécessiter des autorisations supplémentaires. Pour utiliser l\'extension, cliquez sur son icône à droite de la barre d\'adresse. <a href="#">En savoir plus sur les extensions</a>',
    },
    {
      question: 'Comment mettre à jour Chrome ?',
      answer:
        "Les mises à jour de Chrome s'installent en arrière-plan, lorsque vous fermez votre navigateur, puis que vous le rouvrez. Si vous ne l'avez pas fermé depuis un certain temps, il est possible qu'une mise à jour soit disponible. <a href=\"#\">En savoir plus sur les mises à jour de Chrome</a>",
    },
  ]);

  // Méthode pour ouvrir/fermer un item
  toggleItem(index: number): void {
    // Si on clique sur l'item déjà ouvert, on le ferme. Sinon, on ouvre le nouvel item.
    this.openIndex.set(this.openIndex() === index ? null : index);
  }
}
