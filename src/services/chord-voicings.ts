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

function nearestFretFor(targetSemi: number, openSemi: number, nearFret: number): number {
  const base = ((targetSemi - openSemi) % 12 + 12) % 12;
  const candidates = [base, base + 12, base + 24].filter(f => f <= 22);
  if (candidates.length === 0) return -1;
  return candidates.reduce((best, c) =>
    Math.abs(c - nearFret) < Math.abs(best - nearFret) ? c : best);
}

function intervalToRole(interval: number): VoicingPosition['role'] {
  if (interval === 0) return 'root';
  if (interval === 3 || interval === 4) return '3rd';
  if (interval === 6 || interval === 7 || interval === 8) return '5th';
  return '7th';
}

function buildExtSuffix(extIntervals: number[]): string {
  if (extIntervals.includes(11)) return '+M7';
  if (extIntervals.includes(10)) return '+7';
  if (extIntervals.includes(9)) return '+°7';
  if (extIntervals.includes(2)) return '+9';
  return '';
}

function tryExtendPositions(
  positions: VoicingPosition[],
  strOpen: number[],
  rootSemi: number,
  targetInterval: number,
  barreFret?: number
): VoicingPosition[] | null {
  const targetSemi = (rootSemi + targetInterval) % 12;

  const roleCounts: Record<string, number> = {};
  for (const p of positions) {
    roleCounts[p.role] = (roleCounts[p.role] ?? 0) + 1;
  }

  // Never substitute the lowest sounding string — it defines the bass note
  const lowestString = Math.max(...positions.map(p => p.string));

  const candidates: Array<{ posIdx: number; newFret: number; priority: number }> = [];

  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    if (p.string === lowestString) continue;
    const si = 6 - p.string; // string 1 (high E) → si=5; string 6 (low E) → si=0

    let basePriority: number;
    if (p.role === 'root' && roleCounts['root'] > 1)      basePriority = 0;
    else if (p.role === '5th' && roleCounts['5th'] > 1)   basePriority = 1;
    else if (p.role === '5th')                             basePriority = 2;
    else if (p.role === '3rd' && roleCounts['3rd'] > 1)   basePriority = 3;
    else continue; // never substitute single root or single 3rd

    const newFret = nearestFretFor(targetSemi, strOpen[si], p.fret);
    if (newFret < 0 || newFret > 22) continue;
    if (barreFret !== undefined && newFret < barreFret) continue;

    // Lower priority number = better candidate; prefer high strings (lower string number)
    candidates.push({ posIdx: i, newFret, priority: basePriority * 10 + p.string });
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.priority - b.priority);

  for (const cand of candidates) {
    const newPositions = positions.map((p, i) => {
      if (i !== cand.posIdx) return p;
      const si = 6 - p.string;
      const noteInterval = ((strOpen[si] + cand.newFret - rootSemi) % 12 + 12) % 12;
      return { ...p, fret: cand.newFret, role: intervalToRole(noteInterval) };
    });

    const frettedFrets = newPositions.filter(p => p.fret > 0).map(p => p.fret);
    if (frettedFrets.length > 0) {
      const span = Math.max(...frettedFrets) - Math.min(...frettedFrets);
      if (span > 4) continue;
    }

    return newPositions;
  }

  return null;
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

      let barreFret: number | undefined;
      let barreHighString: number | undefined;
      let barreLowString: number | undefined;

      if (shape.barreOffset !== null && rootFret >= shape.barreMinRootFret) {
        barreFret = rootFret + shape.barreOffset;
        const barreNums = shape.barreStrIdxs.map(si => 6 - si);
        barreHighString = Math.min(...barreNums);
        barreLowString  = Math.max(...barreNums);
      }

      // Attempt to add 7th or other extended intervals
      const extIntervals = intervals.filter(i => ![0, 3, 4, 6, 7, 8].includes(i));
      let finalPositions = positions;
      let extSuffix = '';

      if (extIntervals.length > 0) {
        const targetInterval = [11, 10, 9, 2].find(i => extIntervals.includes(i)) ?? extIntervals[0];
        const extended = tryExtendPositions(positions, strOpen, rootSemi, targetInterval, barreFret);
        if (extended !== null) {
          finalPositions = extended;
          extSuffix = buildExtSuffix(extIntervals);
        }
      }

      const frettedFrets = finalPositions.filter(p => p.fret > 0).map(p => p.fret);
      const minFret = frettedFrets.length > 0 ? Math.min(...frettedFrets) : 0;
      const maxFret = finalPositions.length > 0 ? Math.max(...finalPositions.map(p => p.fret)) : 0;

      voicings.push({
        shapeName: shape.name,
        label: `${shape.name} · ${fretToRoman(rootFret)}${extSuffix}`,
        positions: finalPositions,
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
