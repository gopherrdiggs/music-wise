import { Chord, ChordGroup, Note, NoteAlteration, ScaleGroup } from "../interfaces/application";

class TheoryController {

  private notes: Note[] = [
    { id: 'a',  name: "A / B♭♭ / G♯♯" },
    { id: 'as', name: "A♯ / B♭ / C♭♭" },
    { id: 'b',  name: "B / C♭ / A♯♯" },
    { id: 'c',  name: "C / D♭♭ / B♯" },
    { id: 'cs', name: "C♯ / D♭" },
    { id: 'd',  name: "D / E♭♭ / C♯♯" },
    { id: 'ds', name: "D♯ / E♭ / F♭♭" },
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

  private chordGroups: ChordGroup[] = [
    { name: 'Major', chords: [
      { id: '', name: 'Major', intervalPattern: '1|3|5' },
      { id: 'maj6', name: 'Major 6th', intervalPattern: '1|3|5|6' },
      { id: 'maj7', name: 'Major 7th', intervalPattern: '1|3|5|7' },
      { id: 'maj9', name: 'Major 9th', intervalPattern: '1|3|5|7|9' }
    ]},
    { name: 'Minor', chords: [
      { id: 'min', name: 'Minor', intervalPattern: '1|♭3|5' },
      { id: 'min6', name: 'Minor 6th', intervalPattern: '1|♭3|5|6' },
      { id: 'min7', name: 'Minor 7th', intervalPattern: '1|♭3|5|♭7' },
      { id: 'min9', name: 'Minor 9th', intervalPattern: '1|♭3|5|♭7|9' }
    ]},
    { name: 'Dominant', chords: [
      { id: 'dom7', name: 'Dominant 7th', intervalPattern: '1|3|5|♭7' },
      { id: 'dom9', name: 'Dominant 9th', intervalPattern: '1|3|5|♭7|9' },
      { id: 'dom11', name: 'Dominant 11th', intervalPattern: '1|3|5|♭7|9|11' },
      { id: 'dom13', name: 'Dominant 13th', intervalPattern: '1|3|5|♭7|9|11|13' }
    ]},
    { name: 'Diminished', chords: [
      { id: 'dim', name: 'Diminished', intervalPattern: '1|♭3|♭5' },
      { id: 'dim7', name: 'Diminished 7th', intervalPattern: '1|♭3|♭5|♭♭7' },
      { id: 'min7♭5', name: 'Half Diminished', intervalPattern: '1|♭3|♭5|♭7' }
    ]},
    { name: 'Major Add 9', chords: [
      { id: 'add9', name: 'Major (Add 9)', intervalPattern: '1|3|5|9' },
      { id: 'min add9', name: 'Minor (Add 9)', intervalPattern: '1|♭3|5|9' },
      { id: '6 add9', name: 'Major 6 (Add 9)', intervalPattern: '1|3|5|6|9' },
      { id: 'min6 add9', name: 'Minor 6 (Add 9)', intervalPattern: '1|♭3|5|6|9' }
    ]},
    { name: 'Augmented', chords: [
      { id: 'aug', name: 'Augmented', intervalPattern: '1|3|♯5' }
    ]},
    { name: 'Suspended', chords: [
      { id: 'sus2', name: 'Suspended 2', intervalPattern: '1|2|5' },
      { id: 'sus4', name: 'Suspended 4', intervalPattern: '1|4|5' }
    ]}
  ];

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
  async generateKeyNotes(rootNatural: string, rootAlteration: string, intervalPattern: string, numNotes: number = 24): Promise<Note[]> {

    if (!rootNatural || !intervalPattern) { throw 'Missing argument.' }

    let rootNote = `${rootNatural}${rootAlteration}`;
    let noteIndex = this.notes.findIndex(note => note.name.split(' / ').includes(rootNote));
    if (noteIndex < 0) { throw 'Invalid root note.' }
    
    let noteNaturalIndex = this.noteNaturals.findIndex(note => note.name === rootNatural);
    let intervalNames = [...this.intervalNoteNames];   // i.e., 1-Unison, b2-Minor 2nd, etc.
    let interval = intervalNames.shift();
    let scaleIntervals = intervalPattern.split('|');   // e.g., 1|-|2|-|3|4|-|5|-|6|-|7
    let scaleIntervalIndex = 0;

    let result: Note[] = [];

    // Generate 24 notes (two diatonic octaves plus chromatic/other notes)
    for (let i = 0; i < numNotes; i++) {

      let isDiatonic = scaleIntervals[scaleIntervalIndex] != '-';
      let noteName = this.getNoteName(noteIndex, noteNaturalIndex);

      // Add note to result
      result.push({
        name: noteName,
        isDiatonic: isDiatonic,
        intervalNumericReference: interval.id,
        intervalName: interval.name
      } as Note);

      if (!interval.id.includes('♭')) {
        // Shift index
        noteNaturalIndex++;
        if (noteNaturalIndex >= this.noteNaturals.length) { noteNaturalIndex = 0 }
      }

      // Shift indices
      noteIndex++;
      if (noteIndex >= this.notes.length) { noteIndex = 0 }
      scaleIntervalIndex++;
      if (scaleIntervalIndex >= scaleIntervals.length) { scaleIntervalIndex = 0 }
      interval = intervalNames.shift();
    }

    return result;
  }

  async getChordNotes(scaleNotes: Note[], chordInterval: string): Promise<Note[]> {

    let result: Note[] = [];

    let chordIntervals = chordInterval.split('|');

    for (let interval of chordIntervals) {

      // Find the scale note where the interval number (e.g., ♭2) equals the interval specified in the chord
      let note = scaleNotes.find(n => n.intervalNumericReference == interval);
      // Account for the note with a combined number of ♯4/♭5
      if (!note) {
        note = scaleNotes.find(n => n.intervalNumericReference.includes(interval));
      }

      if (!note) { continue };
      result.push({
        name: note.name,
        intervalNumericReference: interval
      } as Note);
    }
    return result;
  }

  async generateKeyChordGroups(rootNatural: string, rootAlteration: string, intervalPattern: string): Promise<ChordGroup[]> {

    let keyNotes = (await this.generateKeyNotes(rootNatural, rootAlteration, intervalPattern, 12))
                    .filter(n => n.isDiatonic);
    
    let result: ChordGroup[] = [];

    for (let note of keyNotes) {

      let chordGroup = { name: `${note.name} Chords` } as ChordGroup;
      chordGroup.chords = [];

      let noteNatural = note.name.substr(0, 1);
      let noteAlteration = note.name.length > 1 ? note.name.substr(1, 1) : '';
      let noteScale = await this.generateKeyNotes(noteNatural, noteAlteration, "1|-|2|-|3|4|-|5|-|6|-|7");
      
      for (let group of this.chordGroups) {
        

        for (let chord of group.chords) {

          chordGroup.chords.push({
            id: `${note.name}${chord.id}`,
            name: `${note.name} ${chord.name}`,
            notes: await this.getChordNotes(noteScale, chord.intervalPattern),
            intervalPattern: chord.intervalPattern
          } as Chord);
        }
      }

      result.push(chordGroup);
    }

    return result;
  }
}

export const TheoryService = new TheoryController();