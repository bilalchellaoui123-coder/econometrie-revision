export interface Flashcard {
  id: string;
  category: 'Statistique' | 'Modélisation' | 'Validation' | 'Tests' | 'Données';
  question: string;
  answer: string;
  tip?: string;
  formula?: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  context?: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  examTrapWarning?: string;
  slideRef: number;
}

export interface StudyPillar {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  badge: string;
  summary: string;
  keyConcepts: { term: string; definition: string; examNote?: string }[];
  detailedNotes: string[];
  formulas?: { name: string; latex: string; explanation: string }[];
  examTraps: string[];
}

export const COURSE_INFO = {
  university: 'Université Cadi Ayyad (UCA)',
  faculty: "Faculté d'Économie et de Gestion de Safi (FEG Safi)",
  track: 'Licence · Économie et techniques quantitatives',
  module: 'Économétrie 1',
  professor: 'Prof. S. Marso',
  chapter: 'Chapitre 0 : Introduction générale',
  session: 'Séance 2 : Données et tests d’hypothèse',
  overview:
    'Cette séance pose les fondations mathématiques et empiriques de tout le cours d’Économétrie 1 : typologie des données (coupe, série, panel), notion de distribution et loi normale, et méthodologie rigoureuse des tests d’hypothèse paramétriques (Student et Fisher).',
  roadmap: [
    { title: 'Ch. 0 : Introduction (S1 à S3)', current: true, description: 'Rappels statistiques, types de données, tests d’hypothèses (Student, Fisher) et lien entre variables.' },
    { title: 'Ch. 1 : Régression simple', current: false, description: 'Estimation MCO (Moindres Carrés Ordinaires) d’une variable explicative, test des coefficients par la p-valeur.' },
    { title: 'Ch. 2 : Modèle multiple', current: false, description: 'Modèle à plusieurs variables explicatives, significativité globale (test F) et individuelle (test t).' },
    { title: 'Ch. 3 : Applications avec Python', current: false, description: 'Mise en pratique économétrique sous environnement de programmation Python.' },
  ],
};

export const STUDY_PILLARS: StudyPillar[] = [
  {
    id: 'terminology',
    number: 1,
    title: 'Terminologie & Vocabulaire Fondamental',
    subtitle: 'Les mots du cours et le retour sur les devoirs',
    badge: 'Vocabulaire Clé',
    summary:
      'L’économétrie fait le pont entre la théorie économique, la modélisation mathématique et l’inférence statistique. Elle s’articule autour de 3 blocs de vocabulaire obligatoires pour l’examen.',
    keyConcepts: [
      {
        term: 'Population vs Échantillon',
        definition:
          'La population est l’ensemble exhaustif des individus étudiés (ex: tous les ménages de Safi). L’échantillon est un sous-ensemble fini observé (ex: 100 ménages), dont les statistiques permettent d’inférer les paramètres réels.',
        examNote: 'Ne confondez pas les notations : N (taille population) vs n (taille échantillon).',
      },
      {
        term: 'Variable endogène (dépendante)',
        definition:
          'La variable expliquée par le modèle, notée généralement Y (ex: niveau de consommation, note d’examen, nombre de nuitées d’hôtel).',
      },
      {
        term: 'Variable exogène (explicative)',
        definition:
          'La variable explicative ou indépendante, notée X, dont les variations déterminent ou influencent la variable endogène (ex: revenu, heures de travail, prix de la chambre).',
      },
      {
        term: 'Paramètre vs Estimateur',
        definition:
          'Le paramètre (ex: β, μ, σ) est la vraie valeur inconnue de la population. L’estimateur est la formule mathématique ou règle appliquée à l’échantillon pour approximer ce paramètre.',
        examNote: 'Un estimateur sans biais a une espérance mathématique égale à la vraie valeur du paramètre : E(θ̂) = θ.',
      },
      {
        term: 'Résidus (e)',
        definition:
          'La différence entre la valeur observée et la valeur ajustée/prédite par le modèle : e_i = y_i - ŷ_i. Ils reflètent la part non expliquée par les variables exogènes.',
      },
      {
        term: 'Modèle Économétrique vs Identité Comptable',
        definition:
          'Une identité comptable est une égalité mathématique exacte sans aucun paramètre à estimer (ex: Revenu = Consommation + Épargne). Un modèle économétrique comporte des paramètres inconnus à estimer et un terme d’erreur aléatoire.',
        examNote: 'Question de cours récurrente : Une identité n’a pas de paramètres ! Réponse : VRAI.',
      },
      {
        term: 'Dirhams Courants vs Dirhams Constants',
        definition:
          'Les valeurs en dirhams courants incluent l’inflation qui gonfle artificiellement les montants. En économétrie, on privilégie souvent les grandeurs en dirhams constants (déflatées par un indice de prix) pour mesurer l’évolution réelle du pouvoir d’achat ou de la production.',
      },
    ],
    detailedNotes: [
      'Construction du sens économique (Signes attendus) : Avant toute régression, il faut formuler le signe attendu de l’effet. Exemple : Prix des hôtels ↑ → Nuitées touristiques ↓ (signe négatif attendu par la loi de la demande). Heures de révision ↑ → Note à l’examen ↑ (signe positif attendu par la théorie du capital humain).',
      'Lecture des données et propension marginale : Si pour une hausse de revenu de +20 Dhs, la consommation s’accroît de +15 Dhs, alors la propension marginale à consommer (pente) vaut 15 / 20 = 0,75 Dhs. Pour chaque dirham supplémentaire gagné, 0,75 Dhs est consommé.',
      'Les trois composantes de la décomposition de variance : Variabilité totale (SST), Variabilité expliquée (SSE) et Variabilité résiduelle (SSR). Le coefficient R² = SSE / SST mesure la proportion de la variance expliquée par le modèle.',
    ],
    examTraps: [
      'Croire qu’il n’existe qu’un seul modèle possible pour un phénomène économique donné (FAUX : plusieurs spécifications sont possibles selon les hypothèses).',
      'Confondre variable dépendante (endogène) et variable explicative (exogène).',
      'Oublier que les valeurs nominales (courantes) subissent l’effet de l’inflation.',
    ],
  },
  {
    id: 'data-types',
    number: 2,
    title: 'Typologie des Données Économiques',
    subtitle: 'Coupe instantanée, Séries temporelles et Données de Panel',
    badge: 'Classifications Clés',
    summary:
      'Toute l’économétrie repose sur la structure dimensionnelle des tableaux de données : la dimension spatiale/individuelle (N) et la dimension temporelle (T). Tout dépend de ce qu’on lit : une colonne, une ligne ou l’intégralité de la matrice.',
    keyConcepts: [
      {
        term: 'Données en Coupe Instantanée (Cross-sectional)',
        definition:
          'Observations de plusieurs individus distincts (ménages, entreprises, régions, pays) recueillies au MÊME MOMENT (une date fixe). Aucune dimension temporelle.',
        examNote: 'Dans un tableau [Individus × Années], une colonne = une coupe instantanée.',
      },
      {
        term: 'Données en Séries Temporelles (Time series)',
        definition:
          'Observations d’UN SEUL individu (un pays, une région, une entreprise) mesurées à plusieurs dates successives (trimestres, mois, années). Les observations successives sont souvent autocorrélées / liées entre elles.',
        examNote: 'Dans un tableau [Individus × Années], une ligne = une série temporelle.',
      },
      {
        term: 'Données de Panel (Données longitudinales)',
        definition:
          'Observations de PLUSIEURS individus suivis sur PLUSIEURS périodes de temps successives. Combine les deux dimensions (Individus N × Temps T), offrant une richesse d’information maximale et permettant de contrôler l’hétérogénéité individuelle inobservable.',
        examNote: 'Dans un tableau [Individus × Années], l’intégralité de la matrice = données de panel.',
      },
    ],
    detailedNotes: [
      'Exemples concrets du cours de Safi pour la coupe instantanée : Le taux de chômage des 12 régions du Maroc en 2025 ; Le revenu et la consommation de 100 ménages de Safi en 2025 ; Le sondage auprès de 250 étudiants de la FEG de Safi réalisé ce mois-ci.',
      'Exemples concrets pour la série temporelle : Le PIB trimestriel du Maroc de 2010 à 2025 ; La température moyenne mensuelle à Safi de 2000 à 2023 ; Le trafic mensuel de phosphates et marchandises au Port de Safi de 2015 à 2025.',
      'Exemples concrets pour les données de panel : 100 ménages de Safi suivis chaque année de 2010 à 2025 ; Les indicateurs macroéconomiques de 30 pays observés pendant 20 ans ; Le chiffre d’affaires de 15 conserveries de poisson de Safi observé de 2020 à 2025.',
    ],
    examTraps: [
      'Piège classique : "Le chômage des 12 régions du Maroc en 2025" -> certains étudiants pensent à une série temporelle car il y a l’année 2025 ! C’est une coupe instantanée car il n’y a qu’UNE SEULE date (2025) et 12 individus distincts.',
      'Piège classique : "Trafic mensuel du port de Safi de 2015 à 2025" -> Un seul individu (le port) sur plusieurs périodes = Série temporelle, PAS du panel.',
      'Pour avoir du panel, il faut IMPÉRATIVEMENT les DEUX : plusieurs individus ET plusieurs dates.',
    ],
  },
  {
    id: 'distributions',
    number: 3,
    title: 'Distributions & Loi Normale',
    subtitle: 'La loi normale comme socle des tests paramétriques',
    badge: 'Fondation Statistique',
    summary:
      'La distribution d’une variable décrit comment ses valeurs se dispersent. L’histogramme des fréquences prend souvent une forme de cloche, résumée idéalement par deux scalaires : la moyenne (μ) et l’écart-type (σ).',
    keyConcepts: [
      {
        term: 'Distribution d’une variable',
        definition:
          'La fonction ou représentation statistique qui associe à chaque valeur ou intervalle de valeurs sa fréquence ou sa densité d’apparition dans l’échantillon.',
      },
      {
        term: 'Moyenne (μ) et Écart-type (σ)',
        definition:
          'La moyenne μ est le paramètre de position centrale (le centre de gravité de la cloche). L’écart-type σ est le paramètre d’échelle ou de dispersion (la largeur de la cloche).',
      },
      {
        term: 'Loi Normale (Gaussienne)',
        definition:
          'Distribution unimodale, continue, parfaitement symétrique par rapport à μ. La quasi-totalité des valeurs (95%) se situe dans l’intervalle [μ - 1,96σ ; μ + 1,96σ].',
        examNote: 'C’est la base incontournable des tests paramétriques (Student t, Fisher F).',
      },
      {
        term: 'Théorème Central Limite (TCL)',
        definition:
          'Propriété fondamentale stipulant que la moyenne d’un échantillon d’observations indépendantes et identiquement distribuées tend vers une loi normale lorsque la taille n augmente (généralement n ≥ 30), quelle que soit la loi de départ de la population.',
      },
    ],
    detailedNotes: [
      'Exemple des notes d’examen (38 étudiants, notes groupées par tranches de 2 points de 8 à 20) : La majorité des notes se concentre autour du centre (14-16), tandis que les notes extrêmes (8-10 ou 18-20) sont rares. L’histogramme présente une belle forme de cloche.',
      'Distribution normale vs non-normale : Une distribution bivariée ou bimodale (deux bosses) indique la coexistence de deux sous-populations distinctes (ex: deux groupes de niveau ou d’âge). Dans ce cas, les tests paramétriques standards ne s’appliquent pas sans précaution.',
    ],
    examTraps: [
      'Penser qu’une distribution à deux bosses (bimodale) peut être traitée directement par un test de Student classique.',
      'Oublier que les tests paramétriques exigent soit la normalité des erreurs/données, soit une taille d’échantillon suffisante (TCL).',
    ],
  },
  {
    id: 'hypothesis-tests',
    number: 4,
    title: 'Tests d’Hypothèse & Méthodologie Complète',
    subtitle: 'L’analogie du tribunal, Student, Fisher, seuils et p-valeur',
    badge: 'Cœur de l’Examen',
    summary:
      'Un test statistique est un protocole de décision rigoureux en 4 étapes permettant de rejeter ou non une hypothèse nulle H₀ en confrontant l’écart observé au hasard.',
    keyConcepts: [
      {
        term: 'L’Analogie du Tribunal (Cruciale pour l’Examen)',
        definition:
          'H₀ = Prévenu présumé innocent (pas d’effet, pas de différence, coefficient nul).\nH₁ = L’accusation (il y a un effet, une différence réelle).\nLes preuves = Les données d’échantillon.\nCondamnation = Rejet de H₀ si les preuves sont écrasantes (écart trop grand pour le hasard).\nAcquittement = Ne pas rejeter H₀ par manque de preuves.',
        examNote: 'Mémorisez : Acquitté ≠ Innocent prouvé. De même : Ne pas rejeter H₀ ≠ Prouver H₀ !',
      },
      {
        term: 'Seuil de signification (α)',
        definition:
          'Le risque maximal toléré de rejeter H₀ à tort alors qu’elle est vraie (erreur de première espèce). Il doit impérativement être fixé AVANT de regarder les données.',
        examNote: 'Valeurs usuelles : α = 5% (usage standard, confiance 95%) ; α = 10% (études exploratoires) ; α = 1% (quand une fausse décision est très coûteuse). Plus α est petit, plus la valeur critique est grande (exige un écart plus fort).',
      },
      {
        term: 'Statistique de Student (T)',
        definition:
          'Mesure l’écart observé entre deux moyennes rapporté à l’écart que le hasard seul produirait : T = (Effet observé) / (Bruit dû au hasard). Formule : t = (x̄₁ - x̄₂) / √( s₁²/n₁ + s₂²/n₂ ).',
        examNote: 'T (majuscule) est la variable aléatoire théorique avant l’échantillon. t (minuscule) est la valeur numérique calculée sur nos données.',
      },
      {
        term: 'Degrés de liberté (ddl)',
        definition:
          'Nombre d’informations indépendantes disponibles pour estimer les variances. Pour la comparaison de deux moyennes : ddl = n₁ + n₂ - 2.',
      },
      {
        term: 'La p-valeur (p-value)',
        definition:
          'p = P(|T| ≥ |t|) sous l’hypothèse H₀ vraie. C’est la probabilité d’observer, par pur hasard, un résultat au moins aussi extrême que celui obtenu si H₀ était vraie.',
        examNote: 'ATTENTION PIÈGE D’EXAMEN : La p-valeur n’est PAS la probabilité que H₀ soit vraie ! Elle mesure la surprise du résultat sous H₀.',
      },
      {
        term: 'Règle de décision Universelle',
        definition:
          'Si p-valeur < α (ou si |t_calculé| > t_critique) : On REJETTE H₀ (effet statistiquement significatif).\nSi p-valeur ≥ α (ou si |t_calculé| ≤ t_critique) : On NE REJETTE PAS H₀ (manque de preuve statistique).',
      },
      {
        term: 'Test de Fisher (F) pour les variances',
        definition:
          'Compare deux dispersions ou variances en calculant leur ratio : F = s_max² / s_min². Si F est proche de 1, les variances sont comparables. Si F dépasse la valeur critique, on rejette l’égalité des variances.',
      },
    ],
    detailedNotes: [
      'Étude de cas détaillée : Filles vs Garçons en Économétrie (Notes Safi)\n- Échantillon : n_F = 20, x̄_F = 16, s_F = 1,5 ; n_G = 18, x̄_G = 14, s_G = 2.\n- Hypothèses : H₀ : μ_F = μ_G vs H₁ : μ_F ≠ μ_G (test bilatéral).\n- Écart observé au numérateur : 16 - 14 = 2 points.\n- Écart type combiné au dénominateur : √( 1,5²/20 + 2²/18 ) = √( 0,1125 + 0,2222 ) = √0,3347 ≈ 0,5786.\n- Statistique t = 2 / 0,5786 ≈ 3,46.\n- Degrés de liberté : ddl = 20 + 18 - 2 = 36.\n- Table de Student à 36 ddl : pour α = 5%, t_crit = 2,028. Comme 3,46 > 2,028, t se situe en zone de rejet critique !\n- Encadrement de la p-valeur dans la table : 3,333 (colonne 0,002) < 3,46 < 3,582 (colonne 0,001) → 0,001 < p < 0,002.\n- Valeur exacte du logiciel : p ≈ 0,0014 < 0,05.\n- Conclusion formelle : On rejette H₀. L’écart de 2 points n’est pas imputable au hasard ; les filles ont une moyenne statistiquement supérieure.',
      'Test de Fisher sur la dispersion des notes (Filles vs Garçons)\n- Hypothèses : H₀ : σ²_F = σ²_G vs H₁ : σ²_F ≠ σ²_G.\n- Calcul : F = s²_G / s²_F = 2² / 1,5² = 4 / 2,25 ≈ 1,78.\n- Valeur critique à α = 5% : F_crit ≈ 2,57.\n- Comme F = 1,78 < 2,57 et p ≈ 0,23 > 0,05 : on ne rejette pas l’égalité des variances (l’hypothèse d’homogénéité des variances est vérifiée).',
      'Exercice de TD Groupe A vs Groupe B :\n- Groupe A (n=25, x̄=12, s=2), Groupe B (n=25, x̄=11, s=3,2).\n- t = (12 - 11) / √( 4/25 + 10,24/25 ) = 1 / √0,5696 ≈ 1 / 0,7547 ≈ 1,32.\n- ddl = 25 + 25 - 2 = 48.\n- Table ddl 48 : t_crit (5%) = 2,011. Comme 1,32 < 2,011 et 0,10 < p < 0,20 (p ≈ 0,19 > 0,05), on NE REJETTE PAS H₀.',
      'Grille de lecture des p-valeurs en économie (Slide 24) :\n• p = 0,0003 (< 0,01) : Preuve très forte. Rejet à 1% (ex: l’effet du revenu sur la consommation).\n• p = 0,03 (< 0,05 mais > 0,01) : Preuve forte. Rejet à 5% mais pas à 1% (ex: le prix de la sardine sur les ventes au port de Safi).\n• p = 0,07 (< 0,10 mais > 0,05) : Preuve faible / indice. Pas de rejet à 5% (ex: impact de la publicité sur les conserveries).\n• p = 0,45 (> 0,10) : Aucune preuve d’effet. Pas de rejet (ex: influence du mois de naissance sur le salaire).',
    ],
    examTraps: [
      'ERREUR FATALE : Écrire dans sa copie d’examen "On accepte H₀" ou "On a prouvé que le médicament ne marche pas". En statistique, on écrit TOUJOURS : "On ne rejette pas H₀ par manque de preuves".',
      'Définir la p-valeur comme la probabilité que H₀ soit vraie (c’est un contresens fréquent, la p-valeur est calculée sous la condition que H₀ EST supposée vraie).',
      'Choisir α après avoir calculé la p-valeur pour forcer un résultat significatif (violation méthodologique grave).',
    ],
    formulas: [
      {
        name: 'Statistique de Student (2 échantillons)',
        latex: 't = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}',
        explanation: 'Rapporte l’écart moyen observé à l’erreur type attribuable aux fluctuations aléatoires d’échantillonnage.',
      },
      {
        name: 'Degrés de liberté de Student',
        latex: 'ddl = n_1 + n_2 - 2',
        explanation: 'Chaque moyenne estimée (x̄₁ et x̄₂) consomme un degré de liberté sur le total (n₁ + n₂).',
      },
      {
        name: 'Statistique de Fisher (Variances)',
        latex: 'F = \\frac{s_{max}^2}{s_{min}^2}',
        explanation: 'Ratio de la plus grande variance d’échantillon sur la plus petite (ddl₁ = n₁ - 1, ddl₂ = n₂ - 1).',
      },
      {
        name: 'Définition de la p-valeur (test bilatéral)',
        latex: 'p = P(|T| \\ge |t|)',
        explanation: 'Probabilité que la statistique théorique T prenne en valeur absolue une valeur au moins aussi grande que t sous H₀.',
      },
    ],
  },
];

export const FLASHCARDS_DECK: Flashcard[] = [
  {
    id: 'fc-1',
    category: 'Données',
    question: 'Qu’est-ce qu’une donnée en coupe instantanée (cross-section) ? Donne un exemple marocain.',
    answer: 'C’est l’observation de plusieurs individus (ménages, entreprises, régions) au MÊME MOMENT (une seule date, aucune dimension temporelle).\nExemple : Le taux de chômage des 12 régions du Maroc en 2025.',
    tip: 'Dans une matrice individus × temps, la coupe instantanée correspond à UNE SEULE COLONNE.',
  },
  {
    id: 'fc-2',
    category: 'Données',
    question: 'Qu’est-ce qu’une série temporelle (time series) ? Donne un exemple marocain.',
    answer: 'C’est l’observation d’UN SEUL individu suivi sur plusieurs périodes de temps successives.\nExemple : Le PIB trimestriel du Maroc de 2010 à 2025 ou la température mensuelle à Safi de 2000 à 2023.',
    tip: 'Dans une matrice individus × temps, la série temporelle correspond à UNE SEULE LIGNE.',
  },
  {
    id: 'fc-3',
    category: 'Données',
    question: 'Qu’est-ce qu’une donnée de panel ?',
    answer: 'C’est l’observation de PLUSIEURS individus suivis sur PLUSIEURS périodes de temps successives (deux dimensions : spatiale N et temporelle T).\nExemple : 100 ménages de Safi suivis chaque année de 2010 à 2025.',
    tip: 'La donnée de panel mobilise TOUTE la matrice [Individus × Années].',
  },
  {
    id: 'fc-4',
    category: 'Validation',
    question: 'Quelle est la différence fondamentale entre H₀ et H₁ ?',
    answer: 'H₀ (hypothèse nulle) pose qu’il n’y a AUCUN effet, aucune différence (statut quo, présumé innocent).\nH₁ (hypothèse alternative) pose qu’il existe une différence ou un effet réel (l’accusation).',
    tip: 'On teste toujours formellement H₀, jamais H₁ directement.',
  },
  {
    id: 'fc-5',
    category: 'Validation',
    question: 'Pourquoi ne doit-on JAMAIS dire "On a prouvé H₀" quand p > α ?',
    answer: 'Parce que "Ne pas rejeter H₀ ≠ Prouver H₀" !\nComme au tribunal où "acquitté ne signifie pas innocent prouvé", ne pas rejeter signifie simplement que les données actuelles ne fournissent pas assez de preuves contre H₀.',
    tip: 'Formulation d’examen attendue : "On ne rejette pas H₀ par manque de preuve empirique suffisante".',
  },
  {
    id: 'fc-6',
    category: 'Validation',
    question: 'Qu’est-ce que le seuil de signification α et quand le choisit-on ?',
    answer: 'α est le risque consenti de rejeter H₀ alors qu’elle est en réalité vraie (erreur de type I). On le fixe impérativement AVANT de regarder les données empiriques (généralement 5%, parfois 1% ou 10%).',
    tip: 'Plus α est petit (ex: 1%), plus la valeur critique est grande (exige un écart plus fort pour rejeter).',
  },
  {
    id: 'fc-7',
    category: 'Tests',
    question: 'Quelle est la formule de la statistique de Student pour comparer 2 moyennes ?',
    answer: 't = (x̄₁ - x̄₂) / √( s₁²/n₁ + s₂²/n₂ )\nElle exprime le rapport : (Écart observé) / (Écart attribuable au hasard).',
    formula: 't = (x̄₁ - x̄₂) / √( s₁²/n₁ + s₂²/n₂ )',
    tip: 'Le nombre de degrés de liberté associé est ddl = n₁ + n₂ - 2.',
  },
  {
    id: 'fc-8',
    category: 'Tests',
    question: 'Quelle est la différence entre T (majuscule) et t (minuscule) ?',
    answer: 'T est la formule / variable aléatoire théorique (qui varierait d’un échantillon à un autre avant l’expérience).\nt est la valeur numérique fixe calculée sur les données réelles de l’échantillon observé.',
  },
  {
    id: 'fc-9',
    category: 'Validation',
    question: 'Donnez la définition exacte de la p-valeur (p-value).',
    answer: 'p = P(|T| ≥ |t|) sous l’hypothèse où H₀ est vraie.\nC’est la probabilité d’obtenir un écart au moins aussi grand que celui observé si le hasard seul agissait.',
    tip: 'Plus p est petit, plus le résultat observé est surprenant sous H₀, donc plus les preuves contre H₀ sont fortes.',
  },
  {
    id: 'fc-10',
    category: 'Tests',
    question: 'À quoi sert le test de Fisher (F) et comment est-il calculé ?',
    answer: 'Il sert à comparer deux variances ou dispersions d’échantillons : F = s_max² / s_min².\nSous H₀ (σ₁² = σ₂²), F suit une loi de Fisher-Snedecor avec (n₁ - 1) et (n₂ - 1) degrés de liberté.',
  },
  {
    id: 'fc-11',
    category: 'Modélisation',
    question: 'Quelle est la différence entre une identité comptable et un modèle économétrique ?',
    answer: 'Une identité comptable est une relation exacte sans paramètre à estimer (ex: Y = C + S).\nUn modèle économétrique comporte des paramètres inconnus (ex: pente β) et un aléa stochastique résiduel.',
  },
  {
    id: 'fc-12',
    category: 'Statistique',
    question: 'Quels sont les deux paramètres qui résument entièrement une loi normale ?',
    answer: 'La moyenne μ (paramètre de position centrale) et l’écart-type σ (paramètre de dispersion). Notée N(μ, σ²).',
  },
];

export const EXAM_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    title: 'Typologie des données',
    slideRef: 11,
    question: 'Le taux de chômage mesuré dans les 12 régions du Maroc au 1er trimestre 2025 relève de quel type de données ?',
    options: [
      { id: 'a', text: 'Coupe instantanée (Cross-sectional)', isCorrect: true },
      { id: 'b', text: 'Série temporelle (Time series)', isCorrect: false },
      { id: 'c', text: 'Données de panel', isCorrect: false },
      { id: 'd', text: 'Variable qualitative ordinale', isCorrect: false },
    ],
    explanation: 'Il s’agit de plusieurs individus (12 régions distinctes) observés à une seule date fixe (2025). Il n’y a aucune dimension temporelle suivie dans le temps.',
    examTrapWarning: 'Ne vous laissez pas piéger par la présence de l’année 2025 : une seule date = pas de série temporelle !',
  },
  {
    id: 'q-2',
    title: 'Typologie des données',
    slideRef: 11,
    question: 'Le suivi du chiffre d’affaires de 15 conserveries de poisson de Safi de 2020 à 2025 constitue :',
    options: [
      { id: 'a', text: 'Une série temporelle pure', isCorrect: false },
      { id: 'b', text: 'Des données de panel (longitudinales)', isCorrect: true },
      { id: 'c', text: 'Une coupe instantanée répétée', isCorrect: false },
      { id: 'd', text: 'Une variable aléatoire continue', isCorrect: false },
    ],
    explanation: 'Il combine la dimension individuelle (15 entreprises distinctes) et la dimension temporelle (6 années de 2020 à 2025). C’est la définition exacte du panel.',
  },
  {
    id: 'q-3',
    title: 'Fondements des tests',
    slideRef: 16,
    question: 'Dans la métaphore du tribunal présentée par le Professeur, à quoi correspond l’hypothèse nulle H₀ ?',
    options: [
      { id: 'a', text: 'Au verdict de culpabilité', isCorrect: false },
      { id: 'b', text: 'À la présomption d’innocence (aucun effet, pas de différence)', isCorrect: true },
      { id: 'c', text: 'Au réquisitoire de l’accusation (il y a un effet)', isCorrect: false },
      { id: 'd', text: 'À la peine maximale', isCorrect: false },
    ],
    explanation: 'H₀ est présumée vraie au départ (innocence). On ne la rejette que si les preuves fournies par les données de l’échantillon sont accablantes contre elle.',
  },
  {
    id: 'q-4',
    title: 'Interprétation rigoureuse',
    slideRef: 16,
    question: 'Si le test aboutit à une p-valeur de 0,42 avec α = 0,05, quelle est la conclusion rigoureuse à écrire sur sa copie ?',
    options: [
      { id: 'a', text: 'On a prouvé que H₀ est vraie.', isCorrect: false },
      { id: 'b', text: 'On accepte définitivement H₀ car il n’y a aucun effet.', isCorrect: false },
      { id: 'c', text: 'On ne rejette pas H₀ car l’échantillon ne fournit pas de preuves suffisantes.', isCorrect: true },
      { id: 'd', text: 'Le test est invalide.', isCorrect: false },
    ],
    explanation: 'Comme au tribunal où un prévenu acquitté n’est pas "prouvé innocent", ne pas rejeter H₀ signifie seulement qu’on manque de preuves pour affirmer un effet.',
    examTrapWarning: 'Tout terme comme "On prouve H₀" ou "On valide H₀ à 100%" est sanctionné par les correcteurs !',
  },
  {
    id: 'q-5',
    title: 'Calcul de la statistique de Student',
    slideRef: 25,
    context: 'Dans le cours : 20 filles (moyenne 16, écart-type 1,5) et 18 garçons (moyenne 14, écart-type 2).',
    question: 'Combien valent les degrés de liberté (ddl) et la statistique t calculée ?',
    options: [
      { id: 'a', text: 'ddl = 38 et t ≈ 2,00', isCorrect: false },
      { id: 'b', text: 'ddl = 36 et t ≈ 3,46', isCorrect: true },
      { id: 'c', text: 'ddl = 36 et t ≈ 1,74', isCorrect: false },
      { id: 'd', text: 'ddl = 40 et t ≈ 2,30', isCorrect: false },
    ],
    explanation: 'ddl = 20 + 18 - 2 = 36. L’écart type combiné vaut √(1,5²/20 + 2²/18) = √0,3347 ≈ 0,5786. t = (16 - 14) / 0,5786 ≈ 3,46.',
  },
  {
    id: 'q-6',
    title: 'Lecture des p-valeurs en économie',
    slideRef: 24,
    question: 'Une étude sur le port de Safi teste l’effet du prix de la sardine sur les ventes. Le logiciel affiche p = 0,03. Que conclut-on ?',
    options: [
      { id: 'a', text: 'On rejette H₀ à 5%, mais pas à 1% (effet statistiquement fort).', isCorrect: true },
      { id: 'b', text: 'On rejette H₀ à 1% et à 5%.', isCorrect: false },
      { id: 'c', text: 'On ne rejette pas H₀ à 5%.', isCorrect: false },
      { id: 'd', text: 'L’effet est nul.', isCorrect: false },
    ],
    explanation: '0,03 est inférieur à 0,05 (rejet au seuil de 5%), mais supérieur à 0,01 (pas de rejet au seuil plus exigeant de 1%).',
  },
  {
    id: 'q-7',
    title: 'Seuils de signification',
    slideRef: 20,
    question: 'Que se passe-t-il lorsque l’on diminue le seuil de risque α (par exemple de 5% à 1%) ?',
    options: [
      { id: 'a', text: 'La valeur critique diminue, facilitant le rejet de H₀.', isCorrect: false },
      { id: 'b', text: 'La valeur critique augmente, exigeant un écart plus grand pour rejeter H₀.', isCorrect: true },
      { id: 'c', text: 'La p-valeur de l’échantillon est divisée par 5.', isCorrect: false },
      { id: 'd', text: 'Les degrés de liberté augmentent.', isCorrect: false },
    ],
    explanation: 'À 36 ddl, pour α = 5%, la valeur critique est 2,028. Pour α = 1%, elle grimpe à 2,719. Pour rejeter avec 99% de confiance, il faut une preuve plus forte.',
  },
  {
    id: 'q-8',
    title: 'Test de Fisher des variances',
    slideRef: 28,
    context: 'Filles : s = 1,5 (s² = 2,25). Garçons : s = 2,0 (s² = 4). Valeur critique à 5% = 2,57.',
    question: 'Quelle est la valeur de la statistique F et quelle décision prend-on ?',
    options: [
      { id: 'a', text: 'F = 4 / 2,25 ≈ 1,78. Comme 1,78 < 2,57, on ne rejette pas l’égalité des variances.', isCorrect: true },
      { id: 'b', text: 'F = 2,25 / 4 = 0,56. On rejette l’égalité des variances.', isCorrect: false },
      { id: 'c', text: 'F = 1,78. Comme 1,78 > 1, on rejette H₀.', isCorrect: false },
      { id: 'd', text: 'Le test de Fisher est impossible avec des effectifs différents.', isCorrect: false },
    ],
    explanation: 'F = s²_G / s²_F = 4 / 2,25 = 1,78. Comme F calculé (1,78) est inférieur à la valeur critique (2,57), on reste dans la zone d’acceptation/non-rejet (p ≈ 0,23 > 0,05).',
  },
  {
    id: 'q-9',
    title: 'Devoir maison : Vrai ou Faux',
    slideRef: 2,
    question: 'Parmi ces propositions issues du retour sur devoir, laquelle est FAUSSE ?',
    options: [
      { id: 'a', text: 'Une identité comptable ne comporte aucun paramètre à estimer.', isCorrect: false },
      { id: 'b', text: 'L’inflation a pour effet de gonfler artificiellement les valeurs en dirhams courants.', isCorrect: false },
      { id: 'c', text: 'Il existe un modèle économétrique unique et universel pour chaque problème économique.', isCorrect: true },
      { id: 'd', text: 'Si le revenu augmente de +20 et la consommation de +15, la pente vaut 0,75.', isCorrect: false },
    ],
    explanation: 'La proposition C est FAUSSE : il existe plusieurs modèles possibles (formes fonctionnelles différentes, variables de contrôle distinctes) pour aborder une même problématique.',
  },
];
