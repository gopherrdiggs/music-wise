import { Note } from '../interfaces/application';

export interface PianoVoicingNote {
  keyNumber: number;  // 1–12 (C=1 … B=12)
  octave: number;     // 1 or 2
  role: 'root' | '3rd' | '5th' | '7th';
}

export interface PianoVoicing {
  label: string;
  notes: PianoVoicingNote[];
}

const NOTE_SEMITONES: Record<string, number> = {
  'C': 0, 'B♯': 0,
  'C♯': 1, 'D♭': 1,
  'D': 2,
  'D♯': 3, 'E♭': 3,
  'E': 4, 'F♭': 4,
  'F': 5, 'E♯': 5,
  'F♯': 6, 'G♭': 6,
  'G': 7,
  'G♯': 8, 'A♭': 8,
  'A': 9,
  'A♯': 10, 'B♭': 10,
  'B': 11, 'C♭': 11,
};

function noteNameToSemitone(name: string): number {
  const first = name.split(' / ')[0].trim();
  return NOTE_SEMITONES[first] ?? -1;
}

function intervalToRole(interval: number): PianoVoicingNote['role'] {
  if (interval === 0) return 'root';
  if (interval === 3 || interval === 4) return '3rd';
  if (interval === 6 || interval === 7 || interval === 8) return '5th';
  return '7th';
}

const INVERSION_LABELS = ['Root', '1st Inv', '2nd Inv', '3rd Inv'];

// Generates close-position inversions for the chord spanning at most 2 octaves.
export function generatePianoVoicings(chordNotes: Note[]): PianoVoicing[] {
  if (!chordNotes || chordNotes.length < 3) return [];

  const semitones = chordNotes.map(n => noteNameToSemitone(n.name));
  if (semitones.some(s => s < 0)) return [];

  const rootSemi = semitones[0];
  const intervals = semitones.map(s => ((s - rootSemi) + 12) % 12);
  const n = chordNotes.length;
  const voicings: PianoVoicing[] = [];

  for (let inv = 0; inv < n; inv++) {
    const notes: PianoVoicingNote[] = [];
    let prevSemi = -1;
    let octave = 1;

    for (let i = 0; i < n; i++) {
      const idx = (i + inv) % n;
      const semi = semitones[idx] % 12;

      if (i === 0) {
        prevSemi = semi;
        octave = 1;
      } else if (semi < prevSemi) {
        octave++;
        prevSemi = semi;
      } else {
        prevSemi = semi;
      }

      if (octave > 2) break;

      notes.push({ keyNumber: semi + 1, octave, role: intervalToRole(intervals[idx]) });
    }

    if (notes.length === n) {
      voicings.push({ label: INVERSION_LABELS[inv] ?? `Inv ${inv}`, notes });
    }
  }

  return voicings;
}
