export type TerminStatus =
  | 'offen'
  | 'angenommen'
  | 'unterwegs'
  | 'erledigt'
  | 'nicht_erfolgreich';

export interface Adresse {
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
}

export interface Termin {
  id: string;
  datum: string;          // ISO-8601
  uhrzeit: string;        // HH:MM
  auftragsart: string;    // z. B. "Neuanschaltung", "Entstörung"
  kundeName: string;
  adresse: Adresse;
  status: TerminStatus;
  fotoUris?: string[];    // lokale Foto-URIs nach Upload
  notiz?: string;
}

export interface AuthState {
  token: string | null;
  rollen: string[];
  hatZugang: boolean;
  laedt: boolean;
}
