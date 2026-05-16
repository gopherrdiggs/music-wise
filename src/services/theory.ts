import { Chord, ChordGroup, Note, NoteAlteration, ScaleGroup } from "../interfaces/application";

class TheoryController {

  private notes: Note[] = [
    { id: 'a',  name: "A / B♭♭ / G♯♯" },
    { id: 'as', name: "A♯ / B♭ / C♭♭" },
    { id: 'b',  name: "B / C♭ / A♯♯" },
    { id: 'c',  name: "C / B♯ / D♭♭" },
    { id: 'cs', name: "C♯ / D♭" },
    { id: 'd',  name: "D / E♭♭ / C♯♯" },
    { id: 'ds', name: "D♯ / E♭ / F♭♭" },
    { id: 'e',  name: "E / F♭ / D♯♯" },
    { id: 'f',  name: "F / E♯ / G♭♭" },
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
    { id: 'natural', symbol: '', name: 'Natural' },
    { id: 'flat', symbol: '♭', name: 'Flat' },
    { id: 'sharp', symbol: '♯', name: 'Sharp' }
  ];

  private scaleGroups: ScaleGroup[] = [
    { "name": "7 Tone Scales",
      "scales": [
        { "id": "major", "name": "Major (Ionian)", "intervalPattern": "1|-|2|-|3|4|-|5|-|6|-|7", "chordPattern": ['I','ii','iii','IV','V','vi','vii°'] },
        { "id": "aeolian", "name": "Natural Minor (Aeolian), Melodic Minor Desc.", "intervalPattern": "1|-|2|♭3|-|4|-|5|♭6|-|♭7|-", "chordPattern": ['i','ii°','III','iv','v','VI','VII'], "modeDescription": "6th mode of Major" },
        { "id": "melodicMinorAsc", "name": "Melodic Minor Asc. (Ionian ♭3)", "intervalPattern": "1|-|2|♭3|-|4|-|5|-|6|-|7", "chordPattern": ['i', 'ii', 'III+', 'IV', 'V', 'vi°', 'vii°'] },
        { "id": "harmonicMinor", "name": "Harmonic Minor (Aeolian ♯7)", "intervalPattern": "1|-|2|♭3|-|4|-|5|♭6|-|-|7", "chordPattern": ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°'] },
        { "id": "dorian", "name": "Dorian (Alt. Minor)", "intervalPattern": "1|-|2|♭3|-|4|-|5|-|6|♭7|-", "chordPattern": ['i','ii','III','IV','v','vi°', 'VII'], "modeDescription": "2nd mode of Major" },
        { "id": "phrygian", "name": "Phrygian (Alt. Minor)", "intervalPattern": "1|♭2|-|♭3|-|4|-|5|♭6|-|♭7|-", "chordPattern": ['i','II','III','iv','v°','VI', 'vii'], "modeDescription": "3rd mode of Major" },
        { "id": "lydian", "name": "Lydian (Alt. Major)", "intervalPattern": "1|-|2|-|3|-|♯4|5|-|6|-|7", "chordPattern": ['I','II', 'iii', 'iv°', 'V', 'vi', 'vii'], "modeDescription": "4th mode of Major" },
        { "id": "mixolydian", "name": "Mixolydian (Alt. Major)", "intervalPattern": "1|-|2|-|3|4|-|5|-|6|♭7|-" , "chordPattern": ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'VII'], "modeDescription": "5th mode of Major" },
        { "id": "locrian", "name": "Locrian (Diminished)", "intervalPattern": "1|♭2|-|♭3|-|4|♭5|-|♭6|-|♭7|-", "chordPattern": ['i°', 'II', 'iii', 'iv', 'V', 'VI', 'vii'], "modeDescription": "7th mode of Major" }
      ]},
    { "name": "5 Tone Scales (Pentatonic)",
      "scales": [
        { "id": "minorPentatonic", "name": "Pentatonic (Minor)", "intervalPattern": "1|-|-|♭3|-|4|-|5|-|-|♭7|-", "modeDescription": "5th mode of Major Pentatonic"},
        { "id": "majorPentatonic", "name": "Pentatonic (Major)", "intervalPattern": "1|-|2|-|3|-|-|5|-|6|-|-"},
        { "id": "modeII", "name": "Mode II (Egyptian)", "intervalPattern": "1|-|2|-|-|4|-|5|-|-|♭7|-", "modeDescription": "2nd mode of Major Pentatonic"},
        { "id": "modeIII", "name": "Mode III (Man Gong)", "intervalPattern": "1|-|-|♭3|-|4|-|-|♭6|-|♭7|-", "modeDescription": "3rd mode of Major Pentatonic"},
        { "id": "modeIV", "name": "Mode IV (Ritusen)", "intervalPattern": "1|-|2|-|-|4|-|5|-|6|-|-", "modeDescription": "4th mode of Major Pentatonic"}
      ]},
    { "name": "6 Tone Scales",
      "scales": [
        { "id": "blues", "name": "Blues (Pentatonic Minor + ♭5)", "intervalPattern": "1|-|-|♭3|-|4|♭5|5|-|-|♭7|-"},
        { "id": "wholeTone", "name": "Whole Tone", "intervalPattern": "1|-|2|-|3|-|♯4|-|♯5|-|♯6|-"}
      ]},
    { "name": "8 Tone Scales",
      "scales": [
        { "id": "wholeHalfI", "name": "Whole-Half (I)", "intervalPattern": "1|-|2|♭3|-|4|♭5|-|♭6|6|-|7"},
        { "id": "halfWholeII", "name": "Half-Whole (II)", "intervalPattern": "1|♭2|-|♭3|3|-|♯4|5|-|6|♭7|-", "modeDescription": "2nd mode of Whole-Half"}
      ]}
  ];

  private degreeNames: Record<string, string> = {
    '1':  'Tonic',
    '♭2': 'Super-tonic',
    '2':  'Super-tonic',
    '♭3': 'Mediant',
    '3':  'Mediant',
    '4':  'Sub-dominant',
    '♯4': 'Sub-dominant',
    '♭5': 'Dominant',
    '5':  'Dominant',
    '♭6': 'Sub-mediant',
    '6':  'Sub-mediant',
    '♭7': 'Sub-tonic',
    '7':  'Leading Tone'
  };

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
      { id: '', name: 'Major', intervalPattern: '1|3|5', chordType: 'triad' },
      { id: 'maj6', name: 'Major 6th', intervalPattern: '1|3|5|6', chordType: 'added' },
      { id: 'maj7', name: 'Major 7th', intervalPattern: '1|3|5|7', chordType: 'seventh' },
      { id: 'maj9', name: 'Major 9th', intervalPattern: '1|3|5|7|9', chordType: 'extended' }
    ]},
    { name: 'Minor', chords: [
      { id: 'min', name: 'Minor', intervalPattern: '1|♭3|5', chordType: 'triad' },
      { id: 'min6', name: 'Minor 6th', intervalPattern: '1|♭3|5|6', chordType: 'added' },
      { id: 'min7', name: 'Minor 7th', intervalPattern: '1|♭3|5|♭7', chordType: 'seventh' },
      { id: 'minMaj7', name: 'Minor-Major 7th', intervalPattern: '1|♭3|5|7', chordType: 'seventh' },
      { id: 'min9', name: 'Minor 9th', intervalPattern: '1|♭3|5|♭7|9', chordType: 'extended' }
    ]},
    { name: 'Dominant', chords: [
      { id: 'dom7', name: 'Dominant 7th', intervalPattern: '1|3|5|♭7', chordType: 'seventh' },
      { id: 'dom9', name: 'Dominant 9th', intervalPattern: '1|3|5|♭7|9', chordType: 'extended' },
      { id: 'dom11', name: 'Dominant 11th', intervalPattern: '1|3|5|♭7|9|11', chordType: 'extended' },
      { id: 'dom13', name: 'Dominant 13th', intervalPattern: '1|3|5|♭7|9|11|13', chordType: 'extended' }
    ]},
    { name: 'Diminished', chords: [
      { id: 'dim', name: 'Diminished', intervalPattern: '1|♭3|♭5', chordType: 'triad' },
      { id: 'dim7', name: 'Diminished 7th', intervalPattern: '1|♭3|♭5|♭♭7', chordType: 'seventh' },
      { id: 'min7♭5', name: 'Half Diminished', intervalPattern: '1|♭3|♭5|♭7', chordType: 'seventh' }
    ]},
    { name: 'Add 9', chords: [
      { id: 'add9', name: 'Major (Add 9)', intervalPattern: '1|3|5|9', chordType: 'added' },
      { id: 'min add9', name: 'Minor (Add 9)', intervalPattern: '1|♭3|5|9', chordType: 'added' },
      { id: '6 add9', name: 'Major 6 (Add 9)', intervalPattern: '1|3|5|6|9', chordType: 'added' },
      { id: 'min6 add9', name: 'Minor 6 (Add 9)', intervalPattern: '1|♭3|5|6|9', chordType: 'added' }
    ]},
    { name: 'Augmented', chords: [
      { id: 'aug', name: 'Augmented', intervalPattern: '1|3|♯5', chordType: 'triad' },
      { id: 'augMaj7', name: 'Augmented Major 7th', intervalPattern: '1|3|♯5|7', chordType: 'seventh' },
      { id: 'aug7', name: 'Augmented 7th', intervalPattern: '1|3|♯5|♭7', chordType: 'seventh' }
    ]},
    { name: 'Suspended', chords: [
      { id: 'sus2', name: 'Suspended 2', intervalPattern: '1|2|5', chordType: 'triad' },
      { id: 'sus4', name: 'Suspended 4', intervalPattern: '1|4|5', chordType: 'triad' },
      { id: '5', name: 'Power', intervalPattern: '1|5', chordType: 'triad' }
    ]},
    { name: 'Altered Dominant', chords: [
      { id: 'dom7♭5',  name: 'Dominant 7th ♭5',  intervalPattern: '1|3|♭5|♭7',       chordType: 'altered' },
      { id: 'dom7♭9',  name: 'Dominant 7th ♭9',  intervalPattern: '1|3|5|♭7|♭9',     chordType: 'altered' },
      { id: 'dom7♯9',  name: 'Dominant 7th ♯9',  intervalPattern: '1|3|5|♭7|♯9',     chordType: 'altered' },
      { id: 'dom7♯11', name: 'Dominant 7th ♯11', intervalPattern: '1|3|5|♭7|♯11',    chordType: 'altered' }
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

  async getNoteIndex(noteNameWithAlteration: string) {

    return this.notes.findIndex(note => note.name.split(' / ').includes(noteNameWithAlteration));
  }

  async getNoteName(noteIndex: number, noteNaturalIndex: number) {

    if (noteNaturalIndex >= this.noteNaturals.length) {
      noteNaturalIndex = 0;
    }

    return this.notes[noteIndex].name.split(' / ').find(n => n.includes(this.noteNaturals[noteNaturalIndex].name));
  }

  async getNoteAlterationSymbol(alterationIdOrName: 'natural' | 'flat' | 'sharp') {

    let noteAlt = this.noteAlterations.find(a => a.id == alterationIdOrName.toLowerCase());

    if (!noteAlt) { throw 'Invalid alteration id.' }

    return noteAlt.symbol;
  }

  // Manipulate arrays of reference data to generate 24 notes based on the provided root
  async generateKeyNotes(rootNatural: string, rootAlteration: string, intervalPattern: string, numNotes: number = 24): Promise<Note[]> {

    if (!rootNatural || !intervalPattern) { throw 'Missing argument.' }

    let noteIndex = await this.getNoteIndex(`${rootNatural}${rootAlteration}`);
    if (noteIndex < 0) { throw 'Invalid root note.' }
    
    let noteNaturalIndex = this.noteNaturals.findIndex(note => note.name === rootNatural);
    let scaleIntervals = intervalPattern.split('|');   // e.g., 1|-|2|-|3|4|-|5|-|6|-|7 for major
    let scaleIntervalIndex = 0;
    let intervalNames = this.intervalNoteNames.map(n => ({ ...n }));   // i.e., 1-Unison, b2-Minor 2nd, etc.
    // Set intervals 6 and 18 to either sharp or flat based on scale interval pattern
    if (scaleIntervals[6].includes('♯')) {
      intervalNames[6].id = '♯4';
      intervalNames[18].id = '♯11';
    }
    else {
      intervalNames[6].id = '♭5';
      intervalNames[18].id = '♭12';
    }

    let result: Note[] = [];

    // Generate 24 notes (two diatonic octaves plus chromatic/other notes)
    for (let i = 0; i < numNotes; i++) {

      let isDiatonic = scaleIntervals[scaleIntervalIndex] != '-';
      let noteName = await this.getNoteName(noteIndex, noteNaturalIndex);

      // Add note to result
      result.push({
        name: noteName,
        isDiatonic: isDiatonic,
        intervalNumericReference: intervalNames[0].id,
        intervalName: intervalNames[0].name,
        degreeName: isDiatonic ? this.degreeNames[intervalNames[0].id] : undefined
      } as Note);

      // If current interval is flat or next interval is sharp...
      if (!intervalNames[0].id.includes('♭') && !intervalNames[1].id.includes('♯')) {
        // ...shift index for note natural
        noteNaturalIndex++;
        if (noteNaturalIndex >= this.noteNaturals.length) { noteNaturalIndex = 0 }
      }

      // Shift other indices
      noteIndex++;
      if (noteIndex >= this.notes.length) { noteIndex = 0 }
      scaleIntervalIndex++;
      if (scaleIntervalIndex >= scaleIntervals.length) { scaleIntervalIndex = 0 }
      // Rotate intervalNames array
      intervalNames.push(intervalNames.shift());
    }

    return result;
  }

  // Enharmonic equivalents that exist in chord patterns but not in intervalNoteNames
  private enharmonicAliases: Record<string, string> = {
    '♭♭7': '6',    // Diminished 7th  = Major 6th       (9 semitones)
    '♯5':  '♭6',   // Augmented 5th   = Minor 6th        (8 semitones)
    '♯9':  '♭10',  // Augmented 9th   = Minor 10th      (15 semitones)
    '♯11': '♭12',  // Augmented 11th  = Diminished 12th (18 semitones)
  };

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
      // Fall back to enharmonic equivalent (e.g. ♭♭7 → 6 for dim7)
      if (!note && this.enharmonicAliases[interval]) {
        note = scaleNotes.find(n => n.intervalNumericReference == this.enharmonicAliases[interval]);
      }

      if (!note) { continue };
      result.push({
        name: note.name,
        intervalNumericReference: interval  // preserve the theoretically correct label
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
            intervalPattern: chord.intervalPattern,
            chordType: chord.chordType
          } as Chord);
        }
      }

      result.push(chordGroup);
    }

    return result;
  }
}

export const TheoryService = new TheoryController();