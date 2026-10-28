import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

const COURSE_CONTEXT = `
Tu es le tuteur pédagogique expert en Économétrie 1 de la Faculté d'Économie et de Gestion de Safi (Université Cadi Ayyad - Prof. S. Marso).
Ce cours traite du Chapitre 0 - Séance 2 : Données et tests d'hypothèse.
Contenu clé du cours :
1. Terminologie :
- Statistique : Population, Échantillon, Moyenne, Variance, Écart-type, Distribution, Corrélation.
- Modélisation : Régression, Variable endogène (expliquée Y), Variable exogène (explicative X), Paramètres réels, Estimateurs, Biais, Résidus (e = y - y_chapeau).
- Modèle vs Identité : Une identité n'a pas de paramètres à estimer. Un modèle a des paramètres inconnus et un aléa.
- Devoir maison : Prix ↑ → Nuitées ↓ (-), Heures ↑ → Notes ↑ (+). Pente marginale = 15/20 = 0.75. Les valeurs courantes subissent l'inflation.
2. Types de données :
- Coupe instantanée : Plusieurs individus à une date unique. Colonne du tableau. (Ex: chômage 12 régions du Maroc en 2025, 250 étudiants interrogés ce mois-ci, 100 ménages de Safi en 2025).
- Série temporelle : Un individu observé sur plusieurs périodes. Ligne du tableau. (Ex: PIB trimestriel du Maroc 2010-2025, température mensuelle Safi 2000-2023, trafic mensuel du port de Safi).
- Données de panel : Plusieurs individus suivis sur plusieurs périodes. Tout le tableau. (Ex: 100 ménages de Safi suivis 2010-2025, indicateurs de 30 pays sur 20 ans, CA de 15 conserveries 2020-2025).
3. Distributions & Loi Normale :
- Distribution : répartition des valeurs. Forme en cloche (Gaussienne) résumée par mu (moyenne) et sigma (écart-type).
- Base des tests paramétriques (Student, Fisher) et du Théorème Central Limite.
4. Tests d'hypothèse :
- Métaphore du tribunal : H0 = Présumé innocent (pas d'effet/pas de différence). H1 = L'accusation (il y a un effet). Écart trop grand pour le hasard -> Rejet de H0.
- RÈGLE D'OR : "Ne pas rejeter H0 ≠ Prouver H0" (Acquitté n'est pas innocent prouvé !).
- 4 étapes : 1) Formuler H0 et H1 ; 2) Choisir alpha (souvent 5%, 1%, 10%) AVANT de voir les données ; 3) Calculer statistique et p-valeur ; 4) Décision : si p < alpha (ou |t| > t_crit), on rejette H0.
- Statistique de Student : T = (écart observé) / (écart dû au hasard). t = (x1 - x2) / sqrt(s1^2/n1 + s2^2/n2). ddl = n1 + n2 - 2.
- p-valeur : p = P(|T| >= |t|). Probabilité d'observer un résultat au moins aussi extrême si H0 était vraie.
- Test de Fisher : F = s_max^2 / s_min^2 pour tester l'égalité des variances.
Réponds toujours avec bienveillance, clarté pédagogique, rigueur mathématique et donne des conseils méthodologiques pour réussir l'examen final.
`;

app.post('/api/ask-tutor', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'La question est requise.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback deterministic smart answering based on keywords
      const lower = question.toLowerCase();
      let answer = '';

      if (lower.includes('coupe') || lower.includes('panel') || lower.includes('série') || lower.includes('serie')) {
        answer = `**Différence entre Coupe, Série et Panel :**\n\n1. **Coupe instantanée :** Plusieurs individus observés à **une seule date** (ex: le taux de chômage des 12 régions du Maroc en 2025). Dans un tableau, c'est **une colonne**.\n2. **Série temporelle :** **Un seul individu** suivi sur **plusieurs dates** (ex: le PIB trimestriel du Maroc de 2010 à 2025). Dans un tableau, c'est **une ligne**.\n3. **Données de panel :** **Plusieurs individus** suivis sur **plusieurs dates** (ex: 100 ménages de Safi suivis de 2010 à 2025). Dans un tableau, c'est **l'ensemble de la matrice**.\n\n*Astuce d'examen :* Pour avoir du panel, il faut impérativement la double dimension (individus ET temps).`;
      } else if (lower.includes('p-valeur') || lower.includes('p-value') || lower.includes('pvaleur')) {
        answer = `**La p-valeur (p-value) et son interprétation :**\n\n- **Définition formelle :** $p = P(|T| \\ge |t|)$ sous l'hypothèse où $H_0$ est vraie. C'est la probabilité d'obtenir par pur hasard un écart au moins aussi grand que celui observé.\n- **Règle de décision :**\n  - Si $p < \\alpha$ (ex: $p < 0,05$) : on **rejette $H_0$** (l'effet est statistiquement significatif).\n  - Si $p \\ge \\alpha$ : on **ne rejette pas $H_0$**.\n\n*Piège d'examen n°1 :* La p-valeur n'est **JAMAIS** la probabilité que $H_0$ soit vraie ! Ne dites jamais "on prouve $H_0$", dites toujours "on ne rejette pas $H_0$ par manque de preuves".`;
      } else if (lower.includes('student') || lower.includes('ddl') || lower.includes('degré') || lower.includes('degre')) {
        answer = `**Le test de Student ($t$) :**\n\n- **Objectif :** Comparer deux moyennes d'échantillons ou tester la significativité d'un coefficient.\n- **Formule :** $t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}$ (un écart rapporté au hasard).\n- **Degrés de liberté :** $ddl = n_1 + n_2 - 2$.\n- **Exemple du cours :** 20 filles (moyenne 16, $s=1,5$) et 18 garçons (moyenne 14, $s=2$). $ddl = 36$, $t = 3,46 > 2,028$ (valeur critique à 5%). Conclusion : Rejet de $H_0$, l'écart de 2 points n'est pas dû au hasard !`;
      } else if (lower.includes('fisher') || lower.includes('variance')) {
        answer = `**Le test de Fisher ($F$) :**\n\n- **Objectif :** Comparer les variances (dispersions) de deux échantillons pour vérifier l'homogénéité.\n- **Formule :** $F = \\frac{s_{max}^2}{s_{min}^2}$.\n- **Exemple du cours :** Garçons ($s=2 \\implies s^2=4$), Filles ($s=1,5 \\implies s^2=2,25$). $F = 4 / 2,25 = 1,78$. La valeur critique à 5% est $2,57$. Comme $1,78 < 2,57$ et $p \\approx 0,23 > 0,05$, on **ne rejette pas l'égalité des variances**.`;
      } else {
        answer = `**Conseil méthodologique d'examen (Économétrie 1 - FEG Safi) :**\n\nPour réussir votre évaluation finale, veillez à toujours respecter les 4 étapes d'un test statistique :\n1. Formuler explicitement $H_0$ (ex: $\\mu_1 = \\mu_2$) et $H_1$ (ex: $\\mu_1 \\neq \\mu_2$).\n2. Fixer le seuil $\\alpha$ (généralement 5%) **avant** de regarder les données.\n3. Calculer la statistique de test ($t$ ou $F$) et sa p-valeur associée avec les degrés de liberté.\n4. Conclure rigoureusement en comparant $p$ à $\\alpha$ (ou $t$ à $t_{critique}$). N'écrivez jamais "on accepte $H_0$", écrivez "on ne rejette pas $H_0$".`;
      }

      return res.json({ answer });
    }

    const ai = new GoogleGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${COURSE_CONTEXT}\n\nQuestion de l'étudiant : ${question}` }],
        },
      ],
    });

    res.json({ answer: response.text });
  } catch (err: any) {
    console.error('Erreur API Tutor:', err);
    res.status(500).json({
      error: 'Erreur lors du traitement de votre question. Veuillez réessayer.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
