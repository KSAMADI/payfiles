/** Chaînes de l'interface runner, FR + EN. */
export const UI = {
  fr: {
    dropSingle: "Déposez un fichier PDF ici, ou cliquez pour sélectionner",
    dropMulti: "Déposez vos fichiers ici, ou cliquez pour sélectionner",
    dropImages: "Déposez vos images ici (PNG/JPG), ou cliquez pour sélectionner",
    launch: "Lancer l'action",
    running: "Traitement…",
    download: "Télécharger",
    files: "fichiers",
    badgeLocal: "100 % local — fichiers jamais téléversés",
    badgeServer: "Traitement serveur à la volée — fichier supprimé après conversion",
    pickFirst: "Sélectionnez au moins un fichier",
  },
  en: {
    dropSingle: "Drop a PDF file here, or click to select",
    dropMulti: "Drop your files here, or click to select",
    dropImages: "Drop your images here (PNG/JPG), or click to select",
    launch: "Run the tool",
    running: "Processing…",
    download: "Download",
    files: "files",
    badgeLocal: "100% local — files are never uploaded",
    badgeServer: "Server-side on-the-fly processing — file deleted after conversion",
    pickFirst: "Select at least one file",
  },
} as const;

export type UiLocale = keyof typeof UI;
