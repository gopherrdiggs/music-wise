import { Chord, Note, NoteAlteration, ScaleGroup } from "../interfaces/application";

class TheoryController {

  private notes: Note[] = [
    { id: 'a',  name: "A / B♭♭ / G♯♯" },
    { id: 'as', name: "A♯ / B♭" },
    { id: 'b',  name: "B / C♭ / A♯♯" },
    { id: 'c',  name: "C / D♭♭ / B♯" },
    { id: 'cs', name: "C♯ / D♭" },
    { id: 'd',  name: "D / E♭♭ / C♯♯" },
    { id: 'ds', name: "D♯ / E♭" },
    { id: 'e',  name: "E / F♭ / D♯♯" },
    { id: 'f',  name: "F / G♭♭ / E♯" },
    { id: 'fs', name: "F♯ / G♭" },
    { id: 'g',  name: "G / A♭♭ / F♯♯" },
    { id: 'gs', name: "G♯ / A♭" }
  ];

  private noteNaturals: Note[] = [
    { id: 'a', name: 'A' },
    { id: 'b', name: 'B' },
    { id: 'c', name: 'C' },
    { id: 'd', name: 'D' },
    { id: 'e', name: 'E' },
    { id: 'f', name: 'F' },
    { id: 'g', name: 'G' }
  ];

  private noteAlterations: NoteAlteration[] = [
    { id: 'flat', symbol: '♭', name: 'Flat' },
    { id: 'sharp', symbol: '♯', name: 'Sharp' }
  ];

  private scaleGroups: ScaleGroup[] = [
    { "name": "7 Tone Scales",
      "scales": [
        { "id": "major", "name": "Major (Ionian)", "intervalPattern": "1|-|2|-|3|4|-|5|-|6|-|7", "chordPattern": ['I','ii','iii','IV','V','vi','vii°'] },
        { "id": "melodicMinorAsc", "name": "Melodic Minor Ascending (Ionian ♭3)", "intervalPattern": "1|-|2|♭3|-|4|-|5|-|6|-|7", "chordPattern": ['i', 'ii', 'III+', 'IV', 'V', 'vi°', 'vii°'] },
        { "id": "harmonicMinor", "name": "Harmonic Minor (Aeolian ♯7)", "intervalPattern": "1|-|2|♭3|-|4|-|5|♭6|-|-|7", "chordPattern": ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°'] },
        { "id": "dorian", "name": "Dorian (Alt. Minor)", "intervalPattern": "1|-|2|♭3|-|4|-|5|-|6|♭7|-", "chordPattern": ['i','ii','III','IV','v','vi°', 'VII'] },
        { "id": "phrygian", "name": "Phrygian (Alt. Minor)", "intervalPattern": "1|♭2|-|♭3|-|4|-|5|♭6|-|♭7|-", "chordPattern": ['i','II','III','iv','v°','VI', 'vii'] },
        { "id": "lydian", "name": "Lydian (Alt. Major)", "intervalPattern": "1|-|2|-|3|-|♯4|5|-|6|-|7", "chordPattern": ['I','II', 'iii', 'iv°', 'V', 'vi', 'vii'] },
        { "id": "mixolydian", "name": "Mixolydian (Alt. Major)", "intervalPattern": "1|-|2|-|3|4|-|5|-|6|♭7|-" , "chordPattern": ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'VII'] },
        { "id": "aeolian", "name": "Natural Minor (Aeolian), Melodic Minor Descending", "intervalPattern": "1|-|2|♭3|-|4|-|5|♭6|-|♭7|-", "chordPattern": ['i','ii°','III','iv','v','VI','VII'] },
        { "id": "locrian", "name": "Locrian (Diminished)", "intervalPattern": "1|♭2|-|♭3|-|4|♭5|-|♭6|-|♭7|-", "chordPattern": ['i°', 'II', 'iii', 'iv', 'V', 'VI', 'vii'] }
      ]},
    { "name": "5 Tone Scales (Pentatonic)",
      "scales": [
        { "id": "minorPentatonic", "name": "Pentatonic (Minor)", "intervalPattern": "1|-|-|♭3|-|4|-|5|-|-|♭7|-"},
        { "id": "majorPentatonic", "name": "Pentatonic (Major)", "intervalPattern": "1|-|2|-|3|-|-|5|-|6|-|-"},
        { "id": "modeIII", "name": "Mode III", "intervalPattern": "1|-|2|-|-|4|-|5|-|-|♭7|-"},
        { "id": "modeIV", "name": "Mode IV", "intervalPattern": "1|-|-|♭3|-|4|-|-|♯5|-|♭7|-"},
        { "id": "modeV", "name": "Mode V", "intervalPattern": "1|-|2|-|-|4|-|5|-|6|-|-"}
      ]},
    { "name": "6 Tone Scales",
      "scales": [
        { "id": "blues", "name": "Blues (Pentatonic Minor + ♭5)", "intervalPattern": "1|-|-|♭3|-|4|♭5|5|-|-|♭7|-"},
        { "id": "wholeTone", "name": "Whole Tone", "intervalPattern": "1|-|2|-|3|-|♯4|-|♯5|-|♯6|-"}
      ]},
    { "name": "8 Tone Scales",
      "scales": [
        { "id": "wholeHalfI", "name": "Whole-Half (I)", "intervalPattern": "1|-|2|♭3|-|4|♭5|-|♭6|6|-|7"},
        { "id": "halfWholeII", "name": "Half-Whole (II)", "intervalPattern": "1|♭2|-|♭3|3|-|♯4|5|-|6|♭7|-"}
      ]}
  ];

  private intervalNoteNames = [
    { id: '1', name: 'Unison' },
    { id: '♭2', name: 'Minor 2nd' },
    { id: '2', name: 'Major 2nd' },
    { id: '♭3', name: 'Minor 3rd' },
    { id: '3', name: 'Major 3rd' },
    { id: '4', name: 'Perfect 4th' },
    { id: '♯4/♭5', name: 'Aug 4th / dim 5th' },
    { id: '5', name: 'Perfect 5th' },
    { id: '♭6', name: 'Minor 6th' },
    { id: '6', name: 'Major 6th' },
    { id: '♭7', name: 'Minor 7th' },
    { id: '7', name: 'Major 7th' },
    { id: '8', name: 'Octave' },
    { id: '♭9', name: 'Minor 9th' },
    { id: '9', name: 'Major 9th' },
    { id: '♭10', name: 'Minor 10th' },
    { id: '10', name: 'Major 10th' },
    { id: '11', name: 'Perfect 11th' },
    { id: '♯11/♭12', name: 'Aug 11th / dim 12th' },
    { id: '12', name: 'Perfect 12th' },
    { id: '♭13', name: 'Minor 13th' },
    { id: '13', name: 'Major 13th' },
    { id: '♭14', name: 'Minor 14th' },
    { id: '14', name: 'Major 14th' }
  ]

  async getNotes() {
    return this.notes;
  }

  async getNoteNaturals() {
    return this.noteNaturals;
  }

  async getNoteAlterations() {
    return this.noteAlterations;
  }

  async getScaleGroups() {
    return this.scaleGroups;
  }

  getNoteName(noteIndex: number, noteNaturalIndex: number) {

    if (noteNaturalIndex > this.noteNaturals.length + 1) {
      noteNaturalIndex = 0;
    }

    return this.notes[noteIndex].name.split(' / ').find(n => n.includes(this.noteNaturals[noteNaturalIndex].name));
  }

  getNoteAlterationSymbol(alterationIdOrName: string) {

    let noteAlt = this.noteAlterations.find(a => a.id == alterationIdOrName.toLowerCase());

    if (!noteAlt) { throw 'Invalid alteration id.' }

    return noteAlt.symbol;
  }

  // Manipulate arrays of reference data to generate 24 notes based on the provided root
  async generateKeyNotes(rootNatural: string, rootAlteration: string, intervalPattern: string): Promise<Note[]> {

    if (!rootNatural || !intervalPattern) { throw 'Missing argument.' }

    let rootNote = `${rootNatural}${rootAlteration}`;
    let noteIndex = this.notes.findIndex(note => note.name.split(' / ').includes(rootNote));
    if (noteIndex < 0) { throw 'Invalid root note.' }
    
    let noteNaturalIndex = this.noteNaturals.findIndex(note => note.name === rootNatural);
    let intervalNames = [...this.intervalNoteNames];   // i.e., 1-Unison, b2-Minor 2nd, etc.
    let intervalName = intervalNames.shift();
    let scaleIntervals = intervalPattern.split('|');   // e.g., 1|-|2|-|3|4|-|5|-|6|-|7
    let scaleIntervalIndex = 0;

    let result: Note[] = [];

    // Generate 24 notes (two diatonic octaves plus chromatic/other notes)
    for (let i = 0; i < 24; i++) {

      let isDiatonic = scaleIntervals[scaleIntervalIndex] != '-';
      let noteName = this.getNoteName(noteIndex, noteNaturalIndex);

      result.push({
        name: noteName,
        isDiatonic: isDiatonic,
        intervalNumericReference: intervalName.id,
        intervalName: intervalName.name
      } as Note);

      if (isDiatonic) {
        // Shift indices
        noteNaturalIndex++;
        if (noteNaturalIndex >= this.noteNaturals.length) { noteNaturalIndex = 0 }
      }

      // Shift indices
      noteIndex++;
      if (noteIndex >= this.notes.length) { noteIndex = 0 }
      scaleIntervalIndex++;
      if (scaleIntervalIndex >= scaleIntervals.length) { scaleIntervalIndex = 0 }
      intervalName = intervalNames.shift();
    }

    console.log('Key notes:', result);
    return result;
  }

  async generateKeyChords(): Promise<Chord[]> {
    // Take starting note, compute key notes, take 1-3-5 for triad, 1-3-5-b7 for dominant 7th, etc

    let result: Chord[] = [];

    return result;
  }
}

export const TheoryService = new TheoryController();