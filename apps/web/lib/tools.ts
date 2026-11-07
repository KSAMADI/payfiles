/**
 * Catalogue d'outils — une entrée = une page (usine SEO FR + EN).
 * FR : /outils/[slug]  |  EN : /en/tools/[slugEn]
 * Données pures, partagées entre composants serveur et clients.
 */

export type OptionDef = {
  kind: "text" | "password" | "select" | "range" | "pages";
  id: string;
  label: string;
  /** libellé anglais (retombe sur `label` si absent) */
  labelEn?: string;
  placeholder?: string;
  default?: string;
  choices?: { value: string; label: string; labelEn?: string }[];
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
};

export type Category = "fichiers" | "pratique";
export type Kind = "file" | "currency" | "weather";
export type Locale = "fr" | "en";

export interface ToolDef {
  slug: string; // slug français (/outils/...)
  slugEn: string; // slug anglais (/en/tools/...)
  name: string;
  nameEn: string;
  /** icône Bootstrap Icons (nom sans préfixe bi-) */
  icon: string;
  desc: string;
  descEn: string;
  h1: string;
  h1En: string;
  seo: string;
  seoEn: string;
  input: "multiple" | "multiple-images" | "single";
  options: OptionDef[];
  accept?: string;
  /** conversion via moteur serveur (LibreOffice) — fichier supprimé après traitement */
  server?: boolean;
  kind: Kind;
  category: Category;
  /** affiché en avant sur l'accueil */
  popular?: boolean;
}

export const CATEGORY_LABELS: Record<Category, { label: string; labelEn: string; icon: string }> = {
  fichiers: { label: "Fichiers & PDF", labelEn: "Files & PDF", icon: "folder2-open" },
  pratique: { label: "Pratique", labelEn: "Everyday", icon: "lightning-charge" },
};

export const TOOLS: ToolDef[] = [
  {
    slug: "fusionner-pdf", slugEn: "merge-pdf",
    name: "Fusionner PDF", nameEn: "Merge PDF",
    icon: "chevron-bar-contract",
    desc: "Assemblez plusieurs PDF dans un seul document.",
    descEn: "Combine multiple PDFs into a single document.",
    h1: "Fusionner des PDF en ligne, 100 % dans votre navigateur",
    h1En: "Merge PDF files online, 100% in your browser",
    seo:
      "Réunissez plusieurs PDF (rapports, contrats, scans) en un seul document dans l'ordre " +
      "de votre choix. Les fichiers sont traités localement par votre navigateur : rien n'est " +
      "téléversé sur un serveur, aucune limite de taille.",
    seoEn:
      "Combine multiple PDFs (reports, contracts, scans) into one document, in any order. " +
      "Everything is processed locally by your browser: no upload, no server handling, " +
      "no file size limit.",
    input: "multiple", options: [], kind: "file", category: "fichiers", popular: true,
  },
  {
    slug: "diviser-pdf", slugEn: "split-pdf",
    name: "Diviser PDF", nameEn: "Split PDF",
    icon: "scissors",
    desc: "Extrayez des pages ou éclatez le PDF page par page (ZIP).",
    descEn: "Extract pages or explode the PDF page by page (ZIP).",
    h1: "Diviser un PDF : extraire des pages ou découpage en un clic",
    h1En: "Split a PDF: extract pages or split in one click",
    seo:
      "Choisissez des plages de pages (ex. « 1-3,5 ») pour en extraire une copie, ou découpez " +
      "l'intégralité du document en un fichier PDF par page, livré dans un ZIP. Tout se passe " +
      "dans votre navigateur.",
    seoEn:
      "Pick page ranges (e.g. \u201c1-3,5\u201d) to extract, or split the whole document into " +
      "one PDF per page, delivered as a ZIP. Everything happens in your browser.",
    input: "single",
    options: [
      { kind: "select", id: "mode", label: "Mode", labelEn: "Mode", default: "extraire",
        choices: [
          { value: "extraire", label: "Extraire des plages de pages", labelEn: "Extract page ranges" },
          { value: "tout", label: "Un fichier par page (ZIP)", labelEn: "One file per page (ZIP)" },
        ] },
      { kind: "pages", id: "ranges", label: "Pages (ex. 1-3,5)", labelEn: "Pages (e.g. 1-3,5)", placeholder: "1-3,5" },
    ],
    kind: "file", category: "fichiers", popular: true,
  },
  {
    slug: "organiser-pdf", slugEn: "organize-pdf",
    name: "Organiser PDF", nameEn: "Organize PDF",
    icon: "funnel",
    desc: "Supprimez des pages inutiles ou inversez l'ordre.",
    descEn: "Remove unwanted pages or reverse the order.",
    h1: "Organiser un PDF : supprimer des pages, inverser l'ordre",
    h1En: "Organize a PDF: delete pages, reverse page order",
    seo:
      "Nettoyez vos documents avant de les envoyer : supprimez les pages blanches ou de garde, " +
      "inversez l'ordre des pages d'un scan recto-verso mal orienté. Reconstruit localement.",
    seoEn:
      "Clean up documents before sending: drop blank pages, reverse a mis-ordered " +
      "double-sided scan. The result is rebuilt locally in seconds.",
    input: "single",
    options: [
      { kind: "select", id: "mode", label: "Action", labelEn: "Action", default: "supprimer",
        choices: [
          { value: "supprimer", label: "Supprimer les pages indiquées", labelEn: "Delete listed pages" },
          { value: "garder", label: "Garder uniquement les pages indiquées", labelEn: "Keep only listed pages" },
          { value: "inverser", label: "Inverser l'ordre de toutes les pages", labelEn: "Reverse all pages" },
        ] },
      { kind: "pages", id: "ranges", label: "Pages (ex. 2,7)", labelEn: "Pages (e.g. 2,7)", placeholder: "2,7" },
    ],
    kind: "file", category: "fichiers",
  },
  {
    slug: "tourner-pdf", slugEn: "rotate-pdf",
    name: "Tourner PDF", nameEn: "Rotate PDF",
    icon: "arrow-clockwise",
    desc: "Faites pivoter toutes les pages ou seulement certaines.",
    descEn: "Rotate all pages or just the ones you pick.",
    h1: "Pivoter les pages d'un PDF (90°, 180°, 270°)",
    h1En: "Rotate PDF pages (90°, 180°, 270°)",
    seo:
      "Ramenez vos scans à l'endroit : rotation globale ou sur pages précises, sans perte de " +
      "qualité, la rotation reste modifiable par tout lecteur PDF.",
    seoEn:
      "Straighten scans and photos of documents: rotate everything or selected pages, with no " +
      "quality loss — the rotation stays editable in any PDF reader.",
    input: "single",
    options: [
      { kind: "select", id: "rotation", label: "Rotation", labelEn: "Rotation", default: "90",
        choices: [
          { value: "90", label: "90° horaire", labelEn: "90° clockwise" },
          { value: "180", label: "180°", labelEn: "180°" },
          { value: "270", label: "90° anti-horaire", labelEn: "90° counter-clockwise" },
        ] },
      { kind: "pages", id: "pages", label: "Pages concernées (vide = toutes)", labelEn: "Pages (empty = all)", placeholder: "3-5" },
    ],
    kind: "file", category: "fichiers",
  },
  {
    slug: "compresser-pdf", slugEn: "compress-pdf",
    name: "Compresser PDF", nameEn: "Compress PDF",
    icon: "arrows-angle-contract",
    desc: "Réduisez le poids d'un PDF en ajustant la qualité.",
    descEn: "Shrink a PDF's file size by tuning quality.",
    h1: "Compresser un PDF dans le navigateur, sans upload",
    h1En: "Compress a PDF in the browser — no upload",
    seo:
      "Idéal pour les dossiers administratifs limités en poids (2 Mo, 10 Mo...). La compression " +
      "re-rend chaque page en image à la résolution choisie : parfait pour les scans. " +
      "Les fichiers restent chez vous.",
    seoEn:
      "Perfect for file-size-limited uploads (2 MB, 10 MB...). Each page is re-rendered as an " +
      "image at the resolution you choose: great for scans and visual documents. Your files " +
      "never leave your machine.",
    input: "single",
    options: [
      { kind: "select", id: "quality", label: "Niveau de compression", labelEn: "Compression level", default: "moyen",
        choices: [
          { value: "fort", label: "Fort (fichier le plus léger)", labelEn: "Strong (smallest file)" },
          { value: "moyen", label: "Moyen (recommandé)", labelEn: "Medium (recommended)" },
          { value: "leger", label: "Léger (qualité maximale)", labelEn: "Light (max quality)" },
        ] },
    ],
    kind: "file", category: "fichiers", popular: true,
  },
  {
    slug: "proteger-pdf", slugEn: "protect-pdf",
    name: "Protéger PDF", nameEn: "Protect PDF",
    icon: "shield-lock",
    desc: "Ajoutez un mot de passe (chiffrement AES-256).",
    descEn: "Add a password (AES-256 encryption).",
    h1: "Protéger un PDF par mot de passe (AES-256), sans upload",
    h1En: "Password-protect a PDF (AES-256) — nothing is uploaded",
    seo:
      "Verrouillez un contrat, une facture ou un dossier personnel avec un mot de passe. Le " +
      "chiffrement AES-256 est calculé par votre navigateur : mot de passe et document ne " +
      "quittent jamais votre ordinateur.",
    seoEn:
      "Lock a contract, invoice or personal file behind a password. AES-256 encryption runs " +
      "in your browser: both the password and the document stay on your computer.",
    input: "single",
    options: [
      { kind: "password", id: "password", label: "Mot de passe", labelEn: "Password", placeholder: "Mot de passe" },
    ],
    kind: "file", category: "fichiers", popular: true,
  },
  {
    slug: "deverrouiller-pdf", slugEn: "unlock-pdf",
    name: "Déverrouiller PDF", nameEn: "Unlock PDF",
    icon: "unlock-fill",
    desc: "Retirez le mot de passe d'un PDF (vous le connaissez).",
    descEn: "Remove a PDF's password (one you know).",
    h1: "Déverrouiller un PDF avec son mot de passe",
    h1En: "Unlock a PDF with its password",
    seo:
      "Vous connaissez le mot de passe et en avez marre de le retaper ? Cet outil produit " +
      "une copie déchiffrée, calculée dans votre navigateur. Usage légitime uniquement.",
    seoEn:
      "Tired of retyping a password you know? This tool produces a decrypted copy, computed " +
      "in your browser. Legitimate use only, on documents you own.",
    input: "single",
    options: [
      { kind: "password", id: "password", label: "Mot de passe actuel", labelEn: "Current password", placeholder: "Mot de passe du PDF" },
    ],
    kind: "file", category: "fichiers",
  },
  {
    slug: "filigrane-pdf", slugEn: "watermark-pdf",
    name: "Filigrane PDF", nameEn: "Watermark PDF",
    icon: "droplet",
    desc: "Ajoutez un texte en diagonal sur chaque page.",
    descEn: "Stamp diagonal text on every page.",
    h1: "Appliquer un filigrane texte à un PDF",
    h1En: "Apply a text watermark to a PDF",
    seo:
      "Marquez vos documents « BROUILLON », « CONFIDENTIEL » ou votre marque, en diagonal et " +
      "réglable en opacité — chaque fichier partagé fait votre publicité.",
    seoEn:
      "Mark documents with \u201cDRAFT\u201d, \u201cCONFIDENTIAL\u201d or your brand, diagonally, with adjustable " +
      "opacity — every shared file advertises you.",
    input: "single",
    options: [
      { kind: "text", id: "text", label: "Texte du filigrane", labelEn: "Watermark text", placeholder: "BROUILLON", default: "BROUILLON" },
      { kind: "range", id: "opacity", label: "Opacité", labelEn: "Opacity", min: 10, max: 90, step: 5, default: "35", suffix: "%" },
    ],
    kind: "file", category: "fichiers",
  },
  {
    slug: "numeroter-pdf", slugEn: "add-page-numbers",
    name: "Numéroter PDF", nameEn: "Add page numbers",
    icon: "list-ol",
    desc: "Ajoutez la pagination automatique.",
    descEn: "Add automatic pagination.",
    h1: "Numéroter les pages d'un PDF automatiquement",
    h1En: "Number the pages of a PDF automatically",
    seo:
      "Ajoutez la pagination aux dossiers constitués de plusieurs fichiers fusionnés, avant " +
      "envoi à une administration. Position et numéro de départ au choix.",
    seoEn:
      "Number merged multi-file bundles before submitting to an authority. Choose the " +
      "position and the starting number.",
    input: "single",
    options: [
      { kind: "select", id: "position", label: "Position", labelEn: "Position", default: "bas-centre",
        choices: [
          { value: "bas-centre", label: "Bas centre", labelEn: "Bottom center" },
          { value: "bas-droite", label: "Bas droite", labelEn: "Bottom right" },
          { value: "haut-centre", label: "Haut centre", labelEn: "Top center" },
          { value: "haut-droite", label: "Haut droite", labelEn: "Top right" },
        ] },
      { kind: "text", id: "start", label: "Commencer à la page", labelEn: "Start at page", placeholder: "1", default: "1" },
    ],
    kind: "file", category: "fichiers",
  },
  {
    slug: "pdf-vers-jpg", slugEn: "pdf-to-jpg",
    name: "PDF → JPG", nameEn: "PDF to JPG",
    icon: "file-earmark-image",
    desc: "Exportez chaque page en image JPG (ZIP).",
    descEn: "Export every page as JPG images (ZIP).",
    h1: "Convertir un PDF en images JPG",
    h1En: "Convert a PDF to JPG images",
    seo:
      "Transformez chaque page du PDF en image JPG à la résolution de votre choix, livraison " +
      "en ZIP, directement dans le navigateur.",
    seoEn:
      "Turn every PDF page into a JPG image at your chosen resolution, delivered as a ZIP, " +
      "entirely in the browser.",
    input: "single",
    options: [
      { kind: "select", id: "dpi", label: "Résolution", labelEn: "Resolution", default: "150",
        choices: [
          { value: "72", label: "72 dpi — écran, dossier léger", labelEn: "72 dpi — screen, small file" },
          { value: "150", label: "150 dpi — qualité standard", labelEn: "150 dpi — standard quality" },
          { value: "300", label: "300 dpi — impression", labelEn: "300 dpi — print" },
        ] },
    ],
    kind: "file", category: "fichiers",
  },
  {
    slug: "jpg-vers-pdf", slugEn: "jpg-to-pdf",
    name: "JPG → PDF", nameEn: "JPG to PDF",
    icon: "file-earmark-pdf",
    desc: "Transformez des images en PDF (scan propre).",
    descEn: "Turn images into a clean PDF.",
    h1: "Rassembler des images dans un PDF",
    h1En: "Assemble images into one PDF",
    seo:
      "Sélectionnez vos photos de documents ou captures d'écran : chaque image devient une " +
      "page d'un PDF propre, prêt à envoyer. Ordre au choix, traitement local.",
    seoEn:
      "Select document photos or screenshots: each image becomes a page of a clean, " +
      "send-ready PDF, in your chosen order, processed locally.",
    input: "multiple-images", options: [], kind: "file", category: "fichiers",
  },
  {
    slug: "pdf-vers-word", slugEn: "pdf-to-word",
    name: "PDF → Word", nameEn: "PDF to Word",
    icon: "file-earmark-word",
    desc: "Récupérez le texte d'un PDF en .docx éditable.",
    descEn: "Get a PDF's text back as an editable .docx.",
    h1: "Convertir un PDF en Word (.docx) modifiable",
    h1En: "Convert a PDF to editable Word (.docx)",
    seo:
      "Extrayez le contenu texte de votre PDF en document Word modifiable, reconstruit " +
      "paragraphe par paragraphe. Prévu pour les PDF textuels (pas les scans).",
    seoEn:
      "Extract your PDF's text into an editable Word document, rebuilt paragraph by " +
      "paragraph. Made for text-based PDFs (not scans).",
    input: "single", options: [], kind: "file", category: "fichiers", popular: true,
  },
  {
    slug: "pdf-vers-excel", slugEn: "pdf-to-excel",
    name: "PDF → Excel", nameEn: "PDF to Excel",
    icon: "file-earmark-excel",
    desc: "Exportez les tableaux du PDF en .xlsx.",
    descEn: "Export the PDF's tables as .xlsx.",
    h1: "Convertir un PDF en Excel (.xlsx)",
    h1En: "Convert a PDF to Excel (.xlsx)",
    seo:
      "Lignes et colonnes reconstruites à partir des positions du texte : parfait pour les " +
      "relevés, factures et listes.",
    seoEn:
      "Rows and columns rebuilt from text positions: perfect for statements, invoices " +
      "and lists. Verify alignment for complex layouts.",
    input: "single", options: [], kind: "file", category: "fichiers",
  },
  {
    slug: "pdf-vers-txt", slugEn: "pdf-to-txt",
    name: "PDF → TXT", nameEn: "PDF to TXT",
    icon: "file-earmark-text",
    desc: "Extrayez le texte brut d'un PDF.",
    descEn: "Extract a PDF's plain text.",
    h1: "Extraire le texte d'un PDF (.txt)",
    h1En: "Extract a PDF's text (.txt)",
    seo: "Tout le texte du PDF dans un .txt léger, sans mise en forme. 100 % local.",
    seoEn: "All the PDF's text in a light .txt file, no formatting, 100% local.",
    input: "single", options: [], kind: "file", category: "fichiers",
  },
  {
    slug: "word-vers-pdf", slugEn: "word-to-pdf",
    name: "Word → PDF", nameEn: "Word to PDF",
    icon: "filetype-docx",
    desc: "Convertissez vos .docx en PDF fidèles.",
    descEn: "Convert your .docx files to faithful PDFs.",
    h1: "Convertir un document Word en PDF",
    h1En: "Convert a Word document to PDF",
    seo:
      "Conversion par un moteur Office complet (LibreOffice) qui préserve polices, marges et " +
      "tableaux. Fichier traité à la volée puis supprimé immédiatement.",
    seoEn:
      "Converted by a full Office engine (LibreOffice) that preserves fonts, margins and " +
      "tables. The file is processed on the fly and deleted immediately.",
    input: "single", accept: ".doc,.docx,.odt,.rtf", server: true, options: [],
    kind: "file", category: "fichiers", popular: true,
  },
  {
    slug: "excel-vers-pdf", slugEn: "excel-to-pdf",
    name: "Excel → PDF", nameEn: "Excel to PDF",
    icon: "filetype-xlsx",
    desc: "Feuilles de calcul → PDF paginé.",
    descEn: "Spreadsheets → paginated PDF.",
    h1: "Convertir un classeur Excel en PDF",
    h1En: "Convert an Excel workbook to PDF",
    seo:
      "Transformez vos .xlsx et .csv en PDF paginé, prêt à envoyer ou archiver. Fichier " +
      "source effacé immédiatement après la conversion.",
    seoEn:
      "Turn .xlsx and .csv files into a paginated, send-ready PDF. The source file is wiped " +
      "right after the conversion.",
    input: "single", accept: ".xls,.xlsx,.csv,.ods", server: true, options: [],
    kind: "file", category: "fichiers",
  },
  {
    slug: "ppt-vers-pdf", slugEn: "ppt-to-pdf",
    name: "PPT → PDF", nameEn: "PPT to PDF",
    icon: "filetype-pptx",
    desc: "Présentations → PDF (une diapositive par page).",
    descEn: "Presentations → PDF (one slide per page).",
    h1: "Convertir une présentation PowerPoint en PDF",
    h1En: "Convert a PowerPoint presentation to PDF",
    seo:
      "Partagez vos diapositives dans un format universel : chaque slide devient une page " +
      "du PDF. Fichier supprimé du serveur juste après le traitement.",
    seoEn:
      "Share slides in a universal format: every slide becomes a PDF page. The file is " +
      "deleted from the server right after processing.",
    input: "single", accept: ".ppt,.pptx,.odp", server: true, options: [],
    kind: "file", category: "fichiers",
  },
  {
    slug: "convertisseur-devise", slugEn: "currency-converter",
    name: "Convertisseur de devises", nameEn: "Currency converter",
    icon: "currency-exchange",
    desc: "Taux de change en temps réel, 150+ monnaies.",
    descEn: "Real-time exchange rates, 150+ currencies.",
    h1: "Convertisseur de devises : taux de change du jour",
    h1En: "Currency converter: today's exchange rates",
    seo:
      "Convertissez entre plus de 150 devises aux taux de change du jour, mis en cache en " +
      "session — gratuit, sans inscription.",
    seoEn:
      "Convert between 150+ currencies at today's rates, cached in your session — free, " +
      "no signup.",
    input: "multiple", options: [], kind: "currency", category: "pratique", popular: true,
  },
  {
    slug: "meteo", slugEn: "weather-forecast",
    name: "Météo", nameEn: "Weather forecast",
    icon: "cloud-sun",
    desc: "Météo actuelle et prévisions 7 jours, sans pub.",
    descEn: "Current weather and 7-day forecast, ad-light.",
    h1: "Météo en direct et prévisions à 7 jours",
    h1En: "Live weather and 7-day forecast",
    seo:
      "Température, vent, précipitations et prévisions détaillées pour n'importe quelle ville " +
      "du monde — données ouvertes Open-Meteo, sans inscription ni pubs intrusives.",
    seoEn:
      "Temperature, wind, precipitation and a detailed 7-day forecast for any city worldwide " +
      "— powered by open Open-Meteo data, no signup, no intrusive ads.",
    input: "multiple", options: [], kind: "weather", category: "pratique", popular: true,
  },
];

// ---------------------------------------------------------------------------
// Recherche + chemins par langue
// ---------------------------------------------------------------------------

export function getToolBySlug(slug: string, locale: Locale = "fr"): ToolDef | undefined {
  return TOOLS.find((t) => (locale === "en" ? t.slugEn : t.slug) === slug);
}

/** Voie locale d'un outil : /outils/[slug] (fr) ou /en/tools/[slugEn] (en) */
export function toolPath(tool: ToolDef, locale: Locale): string {
  return locale === "en" ? `/en/tools/${tool.slugEn}` : `/outils/${tool.slug}`;
}

export function localizedTool(tool: ToolDef, locale: Locale) {
  const en = locale === "en";
  return {
    ...tool,
    displayName: en ? tool.nameEn : tool.name,
    displayDesc: en ? tool.descEn : tool.desc,
    displayH1: en ? tool.h1En : tool.h1,
    displaySeo: en ? tool.seoEn : tool.seo,
  };
}

/** « 1-3,5 » -> [0,1,2,4] ; garde l'ordre, déduplique. */
export function parseRanges(input: string, pageCount: number): number[] {
  const out: number[] = [];
  for (const part of input.split(",")) {
    const piece = part.trim();
    if (!piece) continue;
    const m = piece.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) throw new Error(`Plage invalide : « ${piece} »`);
    let a = parseInt(m[1], 10);
    let b = m[2] ? parseInt(m[2], 10) : a;
    if (b < a) [a, b] = [b, a];
    for (let i = a; i <= b; i++) {
      if (i < 1 || i > pageCount) throw new Error(`Page hors limites : ${i} (document de ${pageCount} pages)`);
      const zero = i - 1;
      if (!out.includes(zero)) out.push(zero);
    }
  }
  return out;
}
