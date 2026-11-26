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

const COURSE_CONTEXT = `Tu es le tuteur pédagogique expert en Économétrie 1 de la Faculté d'Économie et de Gestion de Safi (Université Cadi Ayyad - Prof. S. Marso).
Ce cours traite du Chapitre 0 - Séance 2 : Données et tests d'hypothèse.
Contenu clé du cours :
1. Terminologie :
- Statistique : Population (N), Échantillon (n), Moyenne, Variance, Écart-type, Distribution, Corrélation.
- Modélisation : Régression, Variable endogène (expliquée Y), Variable exogène (explicative X), Paramètres réels, Estimateurs (sans biais si E(θ̂) = θ), Résidus (eᵢ = yᵢ - ŷᵢ).
- Modèle vs Identité : Une identité comptable n'a pas de paramètres à estimer (VRAI). Un modèle économétrique a des paramètres inconnus et un aléa.
- Devoir maison : Prix ↑ → Nuitées ↓ (-), Heures ↑ → Notes ↑ (+). Pente marginale = 15/20 = 0,75. Les valeurs en dirhams courants subissent l'inflation ; on déflate en dirhams constants.
2. Types de données :
- Coupe instantanée : Plusieurs individus à une date unique (colonne du tableau). Ex : chômage des 12 régions du Maroc en 2025, 250 étudiants interrogés ce mois-ci, 100 ménages de Safi en 2025.
- Série temporelle : Un individu observé sur plusieurs périodes (ligne du tableau). Ex : PIB trimestriel du Maroc 2010-2025, température mensuelle Safi 2000-2023, trafic mensuel du port de Safi.
- Données de panel : Plusieurs individus suivis sur plusieurs périodes (tout le tableau). Ex : 100 ménages de Safi suivis 2010-2025, indicateurs de 30 pays sur 20 ans, CA de 15 conserveries 2020-2025.
3. Distributions & Loi Normale :
- Distribution : répartition des valeurs. Forme en cloche (Gaussienne) résumée par μ (moyenne) et σ (écart-type).
- Base des tests paramétriques (Student, Fisher) et du Théorème Central Limite.
4. Tests d'hypothèse :
- Métaphore du tribunal (Slide 16) : H₀ = Présumé innocent (pas d'effet/pas de différence). H₁ = L'accusation (il y a un effet). Écart trop grand pour le hasard → Rejet de H₀.
- RÈGLE D'OR : "Ne pas rejeter H₀ ≠ Prouver H₀" (Acquitté n'est pas innocent prouvé !).
- 4 étapes : 1) Formuler H₀ et H₁ ; 2) Choisir α (5%, 1%, 10%) AVANT de voir les données ; 3) Calculer statistique et p-valeur ; 4) Décision : si p < α (ou |t| > t_crit), on rejette H₀.
- Statistique de Student : t = (x̄₁ - x̄₂) / √(s₁²/n₁ + s₂²/n₂) avec ddl = n₁ + n₂ - 2. Exemple Slide 25 : 20 filles (16 ; s=1,5) vs 18 garçons (14 ; s=2) → ddl = 36, t = 3,457 > 2,028 → rejet de H₀ (0,001 < p < 0,002).
- p-valeur : p = P(|T| ≥ |t| | H₀). Probabilité d'observer un résultat au moins aussi extrême si H₀ était vraie (ce n'est JAMAIS la probabilité que H₀ soit vraie).
- Test de Fisher (Slide 28) : F = s_max² / s_min² pour tester l'égalité des variances (H₀ : σ₁² = σ₂²). Exemple : 4 / 2,25 = 1,78 < 2,57 → non-rejet de l'égalité des variances.

Contraintes de format :
- Réponds en français clair, bienveillant et rigoureux (150 à 250 mots maximum).
- N'utilise PAS de balises Markdown (** ou #) ni de délimiteurs LaTeX ($...$) : écris des puces (•), des sauts de ligne propres et des symboles Unicode lisibles (H₀, H₁, μ, σ², α, x̄₁, ≥, ≤, √).`;

app.post('/api/ask-tutor', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'La question est requise.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Clé GEMINI_API_KEY absente côté serveur. Veuillez la configurer dans Settings > Secrets.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Question de l'étudiant : ${question.trim()}`,
      config: {
        systemInstruction: COURSE_CONTEXT,
      },
    });

    const answer = response.text?.trim();
    if (!answer) {
      return res.status(502).json({
        error: 'Le modèle n’a renvoyé aucune réponse. Veuillez reformuler votre question.',
      });
    }

    return res.json({ answer });
  } catch (err: unknown) {
    console.error('Erreur API Tutor:', err);
    const status =
      typeof err === 'object' && err !== null && 'status' in err && typeof (err as { status: unknown }).status === 'number'
        ? (err as { status: number }).status
        : 500;
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: 'Erreur lors du traitement de votre question par le tuteur IA. Veuillez réessayer.',
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
