export interface Chord {
  id: string,
  name: string,
  number?: string,
  notes?: Note[],
  intervalPattern?: string
}

export interface ChordGroup {
  name: string,
  chords: Chord[]
}

export interface Note {
  id?: string,
  name: string,
  isDiatonic?: boolean,
  intervalNumericReference?: string,
  intervalName?: string,
  degreeName?: string
}

export interface NoteAlteration {
  id: string,
  symbol: string,
  name: string
}

export interface Scale {
  id: string,
  name: string,
  intervalPattern: string,
  chordPattern?: string[],
  modeDescription?: string
}

export interface ScaleGroup {
  name: string,
  scales: Scale[]
}

export interface Tone {
  id: string,
  name: string
}

export interface ToneAlteration {
  id: string,
  symbol: string,
  name: string
}