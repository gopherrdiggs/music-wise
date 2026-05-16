# Music Theory Domain Knowledge

Reference for maintaining and extending `src/services/theory.ts`.

---

## Interval system

The app uses a 12-position chromatic pattern (`intervalPattern`) with `|`-delimited tokens:

| Token | Semitones from root | Meaning |
|-------|---------------------|---------|
| `1`   | 0  | Unison / Root |
| `♭2`  | 1  | Minor 2nd |
| `2`   | 2  | Major 2nd |
| `♭3`  | 3  | Minor 3rd |
| `3`   | 4  | Major 3rd |
| `4`   | 5  | Perfect 4th |
| `♯4`/`♭5` | 6 | Tritone (augmented 4th / diminished 5th) |
| `5`   | 7  | Perfect 5th |
| `♭6`  | 8  | Minor 6th |
| `6`   | 9  | Major 6th |
| `♭7`  | 10 | Minor 7th |
| `7`   | 11 | Major 7th |
| `-`   | (any) | Chromatic (non-diatonic), skip |

Enharmonic equivalents in the app: `♯5 = ♭6`, `♯4 = ♭5`, `♭♭7 = 6`.

---

## Scales — verification status

### 7-Tone Scales ✓ All interval patterns verified correct

| Scale | Pattern | Chord Pattern |
|-------|---------|--------------|
| Major (Ionian) | `1\|-\|2\|-\|3\|4\|-\|5\|-\|6\|-\|7` | I ii iii IV V vi vii° |
| Natural Minor (Aeolian) | `1\|-\|2\|♭3\|-\|4\|-\|5\|♭6\|-\|♭7\|-` | i ii° III iv v VI VII |
| Melodic Minor Asc. | `1\|-\|2\|♭3\|-\|4\|-\|5\|-\|6\|-\|7` | i ii III+ IV V vi° vii° |
| Harmonic Minor | `1\|-\|2\|♭3\|-\|4\|-\|5\|♭6\|-\|-\|7` | i ii° III+ iv V VI vii° |
| Dorian | `1\|-\|2\|♭3\|-\|4\|-\|5\|-\|6\|♭7\|-` | i ii III IV v vi° VII |
| Phrygian | `1\|♭2\|-\|♭3\|-\|4\|-\|5\|♭6\|-\|♭7\|-` | i II III iv v° VI vii |
| Lydian | `1\|-\|2\|-\|3\|-\|♯4\|5\|-\|6\|-\|7` | I II iii iv° V vi vii |
| Mixolydian | `1\|-\|2\|-\|3\|4\|-\|5\|-\|6\|♭7\|-` | I ii iii° IV v vi VII |
| Locrian | `1\|♭2\|-\|♭3\|-\|4\|♭5\|-\|♭6\|-\|♭7\|-` | i° II iii iv V VI vii |

### 5-Tone (Pentatonic) Scales ✓

| Name | Pattern | Standard Mode # |
|------|---------|-----------------|
| Pentatonic (Major) | `1\|-\|2\|-\|3\|-\|-\|5\|-\|6\|-\|-` | Mode I |
| Mode II (Egyptian) | `1\|-\|2\|-\|-\|4\|-\|5\|-\|-\|♭7\|-` | Mode II |
| Mode III (Man Gong) | `1\|-\|-\|♭3\|-\|4\|-\|-\|♭6\|-\|♭7\|-` | Mode III |
| Mode IV (Ritusen) | `1\|-\|2\|-\|-\|4\|-\|5\|-\|6\|-\|-` | Mode IV |
| Pentatonic (Minor) | `1\|-\|-\|♭3\|-\|4\|-\|5\|-\|-\|♭7\|-` | Mode V |

### 6-Tone Scales ✓

| Scale | Notes |
|-------|-------|
| Blues | 1 ♭3 4 ♭5 5 ♭7 — correct |
| Whole Tone | 1 2 3 ♯4 ♯5 ♯6 — correct |

### 8-Tone Scales ✓

| Scale | Notes |
|-------|-------|
| Whole-Half | 1 2 ♭3 4 ♭5 ♭6 6 7 — correct |
| Half-Whole | 1 ♭2 ♭3 3 ♯4 5 6 ♭7 — correct |

---

## Chords — verification status ✓ All patterns verified correct

Chord lookup always uses a **major scale reference** per root note — this is correct and intentional.

| Group | Chord | Pattern | Status |
|-------|-------|---------|--------|
| Major | Major | `1\|3\|5` | ✓ |
| Major | Major 6th | `1\|3\|5\|6` | ✓ |
| Major | Major 7th | `1\|3\|5\|7` | ✓ |
| Major | Major 9th | `1\|3\|5\|7\|9` | ✓ |
| Minor | Minor | `1\|♭3\|5` | ✓ |
| Minor | Minor 6th | `1\|♭3\|5\|6` | ✓ |
| Minor | Minor 7th | `1\|♭3\|5\|♭7` | ✓ |
| Minor | Minor 9th | `1\|♭3\|5\|♭7\|9` | ✓ |
| Dominant | Dom 7th | `1\|3\|5\|♭7` | ✓ |
| Dominant | Dom 9th | `1\|3\|5\|♭7\|9` | ✓ |
| Dominant | Dom 11th | `1\|3\|5\|♭7\|9\|11` | ✓ |
| Dominant | Dom 13th | `1\|3\|5\|♭7\|9\|11\|13` | ✓ |
| Diminished | Diminished | `1\|♭3\|♭5` | ✓ |
| Diminished | Dim 7th | `1\|♭3\|♭5\|♭♭7` | ✓ |
| Diminished | Half Dim | `1\|♭3\|♭5\|♭7` | ✓ |
| Add 9 | Major Add 9 | `1\|3\|5\|9` | ✓ |
| Add 9 | Minor Add 9 | `1\|♭3\|5\|9` | ✓ |
| Add 9 | Maj 6 Add 9 | `1\|3\|5\|6\|9` | ✓ |
| Add 9 | Min 6 Add 9 | `1\|♭3\|5\|6\|9` | ✓ |
| Augmented | Augmented | `1\|3\|♯5` | ✓ |
| Suspended | Sus2 | `1\|2\|5` | ✓ |
| Suspended | Sus4 | `1\|4\|5` | ✓ |

---

## Enhancement ideas (future features)

### High value for teaching
- **Scale degree names** — label notes as Tonic, Supertonic, Mediant, Subdominant, Dominant, Submediant, Leading Tone
- **Relative / parallel key display** — e.g., C major ↔ A minor
- **Mode relationship display** — show which mode of which parent scale the current scale is
- **Chord function labels** — Tonic (T), Subdominant (S), Dominant (D) for each diatonic chord

### Chord completeness
Common chord types not yet included:
- Minor-major 7th (mMaj7): `1|♭3|5|7`
- Augmented 7th (aug7 / 7♯5): `1|3|♯5|♭7`
- Dominant 7th ♭5 (7♭5): `1|3|♭5|♭7`
- Dominant 7th ♭9 (7♭9): `1|3|5|♭7|♭9`
- Dominant 7th ♯9 (7♯9): `1|3|5|♭7|♯9`
- Lydian chord (Maj7♯11): `1|3|5|7|♯11`
- Power chord (5): `1|5`

### Guitar-specific
- Alternative tunings — Drop D (`D A D G B E`), Open G (`D G D G B D`), DADGAD, etc.
- Chord voicings on fretboard (not just note coloring)
- CAGED system visualization
- Barre chord shapes

### Piano-specific
- More than 2 octaves (3–4 octave view)
- Chord inversions

### General
- Audio playback for notes and chords
- Interval trainer / ear training mode
- Print / share a scale or chord diagram
