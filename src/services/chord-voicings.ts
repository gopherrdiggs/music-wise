import { Note } from '../interfaces/application';

export interface VoicingPosition {
  string: number;  // 1 = high E (top of fretboard), 6 = low E (bottom)
  fret: number;
  role: 'root' | '3rd' | '5th' | '7th';
}

export interface ChordVoicing {
  shapeName: string;
  label: string;
  positions: VoicingPosition[];
  barreFret?: number;
  barreHighString?: number;  // smallest string# covered by barre
  barreLowString?: number;   // largest string# covered by barre
  minFret: number;
  maxFret: number;
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

function noteToSemitone(name: string): number {
  const first = name.split(' / ')[0].trim();
  return NOTE_SEMITONES[first] ?? -1;
}

function findFret(noteSemi: number, openSemi: number): number {
  return ((noteSemi - openSemi) % 12 + 12) % 12;
}

function fretToRoman(fret: number): string {
  const r = ['Open','I','II','III','IV','V','VI','VII','VIII','IX','X',
             'XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII'];
  return r[fret] ?? String(fret);
}

// offsets index: 0=string6(low E), 1=string5(A), 2=string4(D), 3=string3(G), 4=string2(B), 5=string1(high E)
// Derived from open major chord shapes:
//   E shape (open E: 022100), A shape (open A: x02220), G shape (open G: 320003),
//   C shape (open C: x32010), D shape (open D: xx0232)
interface ShapeTemplate {
  name: string;
  refStrIdx: number;           // which string index carries the root
  offsets: (number | null)[];  // fret offset from root fret; null = muted
  barreOffset: number | null;  // offset from root fret to barre fret; null = no barre
  barreMinRootFret: number;    // only show barre when rootFret >= this (avoids open position)
  barreStrIdxs: number[];      // string indices (0=str6) spanned by the barre
}

const CAGED_MAJOR: ShapeTemplate[] = [
  { name: 'E', refStrIdx: 0, offsets: [0, 2, 2, 1, 0, 0],          barreOffset:  0,   barreMinRootFret:  1, barreStrIdxs: [0,1,2,3,4,5] },
  { name: 'A', refStrIdx: 1, offsets: [null, 0, 2, 2, 2, 0],        barreOffset:  0,   barreMinRootFret:  1, barreStrIdxs: [1,2,3,4,5]   },
  { name: 'G', refStrIdx: 0, offsets: [0, -1, -3, -3, -3, 0],       barreOffset: -3,   barreMinRootFret:  4, barreStrIdxs: [2,3,4]       },
  { name: 'C', refStrIdx: 1, offsets: [null, 0, -1, -3, -2, -3],    barreOffset: -3,   barreMinRootFret:  4, barreStrIdxs: [3,5]         },
  { name: 'D', refStrIdx: 2, offsets: [null, null, 0, 2, 3, 2],     barreOffset: null, barreMinRootFret: 99, barreStrIdxs: []            },
];

export function generateChordVoicings(chordNotes: Note[], tuning: string[]): ChordVoicing[] {
  if (!chordNotes || chordNotes.length < 3 || !tuning || tuning.length < 6) return [];

  // tuning[0] = string 6 (low E), tuning[5] = string 1 (high E)
  const strOpen = tuning.map(n => noteToSemitone(n));
  if (strOpen.some(s => s < 0)) return [];

  const chordSemis = chordNotes.map(n => noteToSemitone(n.name));
  const rootSemi = chordSemis[0];
  if (rootSemi < 0) return [];

  const intervals = chordSemis.map(s => ((s - rootSemi) + 12) % 12);
  // Adjustments relative to major template (major 3rd + perfect 5th)
  const thirdAdj = intervals.includes(3) ? -1 : 0;
  const fifthAdj  = intervals.includes(6) ? -1 : intervals.includes(8) ? 1 : 0;

  const voicings: ChordVoicing[] = [];

  for (const shape of CAGED_MAJOR) {
    const refOpen = strOpen[shape.refStrIdx];

    for (let octave = 0; octave < 2; octave++) {
      const rootFret = findFret(rootSemi, refOpen) + octave * 12;
      if (rootFret > 22) continue;

      const positions: VoicingPosition[] = [];

      for (let si = 0; si < 6; si++) {
        const rawOff = shape.offsets[si];
        if (rawOff === null) continue;

        const majorFret = rootFret + rawOff;
        if (majorFret < 0) continue;

        // Determine what interval this string plays in the major template
        const majorNote = (strOpen[si] + majorFret) % 12;
        const majorInterval = ((majorNote - rootSemi) + 12) % 12;

        // Apply quality adjustments to major-3rd and perfect-5th strings
        let adj = rawOff;
        if (majorInterval === 4) adj += thirdAdj;
        else if (majorInterval === 7) adj += fifthAdj;

        const fret = rootFret + adj;
        if (fret < 0 || fret > 22) continue;

        const noteAtFret = (strOpen[si] + fret) % 12;
        const interval = ((noteAtFret - rootSemi) + 12) % 12;
        const role: VoicingPosition['role'] =
          interval === 0 ? 'root' :
          (interval === 3 || interval === 4) ? '3rd' :
          (interval === 6 || interval === 7 || interval === 8) ? '5th' :
          '7th';

        const stringNum = 6 - si; // si=0 → string 6, si=5 → string 1
        positions.push({ string: stringNum, fret, role });
      }

      const hasRoot = positions.some(p => p.role === 'root');
      const has3rd  = positions.some(p => p.role === '3rd');
      const has5th  = positions.some(p => p.role === '5th');
      if (!hasRoot || !has3rd || !has5th || positions.length < 3) continue;

      const frettedFrets = positions.filter(p => p.fret > 0).map(p => p.fret);
      const minFret = frettedFrets.length > 0 ? Math.min(...frettedFrets) : 0;
      const maxFret = positions.length > 0 ? Math.max(...positions.map(p => p.fret)) : 0;

      let barreFret: number | undefined;
      let barreHighString: number | undefined;
      let barreLowString: number | undefined;

      if (shape.barreOffset !== null && rootFret >= shape.barreMinRootFret) {
        barreFret = rootFret + shape.barreOffset;
        const barreNums = shape.barreStrIdxs.map(si => 6 - si);
        barreHighString = Math.min(...barreNums);
        barreLowString  = Math.max(...barreNums);
      }

      voicings.push({
        shapeName: shape.name,
        label: `${shape.name} · ${fretToRoman(rootFret)}`,
        positions,
        barreFret,
        barreHighString,
        barreLowString,
        minFret: barreFret !== undefined ? Math.min(minFret, barreFret) : minFret,
        maxFret
      });
    }
  }

  return voicings;
}
