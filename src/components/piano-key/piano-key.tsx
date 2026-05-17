import { Component, h, Listen, Prop, State } from "@stencil/core";
import { Note } from "../../interfaces/application";
import { App } from "../../services/app-state";
import { TheoryService } from "../../services/theory";
import { PianoVoicing } from "../../services/piano-voicings";

@Component({
  tag: 'piano-key'
})
export class PianoKey {

  @Prop() keyNumber: number;
  @Prop() isBlack: boolean;
  @Prop() octave: number = 1;

  @State() noteName: string;
  @State() isDiatonic: boolean;
  @State() noteColor: string;
  @State() voicingActive: boolean = false;
  @State() isVoicingNote: boolean = false;

  selectedKey: string;
  keyNotes: Note[] = [];
  allNotes: Note[] = [];
  private originalNoteName: string | null = null;
  
  async componentWillLoad() {
    this.selectedKey = App.state.currentKey
    this.keyNotes = App.state.keyNotes.slice(0,12);
    this.allNotes = await TheoryService.getNotes();
    await this.updateNote();
  }

  @Listen('noteDeselected', { target: 'body' })
  async handleNoteDeselected(event: any) {
    if (event.detail.noteName == this.noteName) {
      this.noteColor = this.isBlack
      ? 'medium'
      : 'light';
    }
  }

  @Listen('noteSelected', { target: 'body' })
  async handleNoteSelected(event: any) {
    if (event.detail.noteName == this.noteName) {
      this.noteColor = event.detail.color;
    }
  }

  @Listen('keyNotesChanged', { target: 'body' })
  async handleKeyNotesChanged(event: any) {
    this.keyNotes = event.detail.keyNotes.slice(0,12);
    this.selectedKey = this.keyNotes[0].name;
    await this.updateNote();
  }

  @Listen('chordSelected', { target: 'body' })
  async handleChordSelected(event: any) {
    const notes: Note[] = event.detail.notes;
    const enharmonicMap: Record<string, string> = event.detail.enharmonicMap ?? {};
    if (notes.find((n: Note) => n.name === this.noteName)) {
      this.noteColor = event.detail.color;
    } else if (enharmonicMap[this.noteName]) {
      this.originalNoteName = this.noteName;
      this.noteName = enharmonicMap[this.noteName];
      this.noteColor = event.detail.color;
    } else if (this.isDiatonic || this.noteName === this.selectedKey) {
      this.noteColor = 'tertiary';
    }
  }

  @Listen('pianoVoicingSelected', { target: 'body' })
  handlePianoVoicingSelected(event: any) {
    const voicing: PianoVoicing | null = event.detail;
    if (!voicing) {
      this.voicingActive = false;
      this.isVoicingNote = false;
      return;
    }
    this.voicingActive = true;
    this.isVoicingNote = voicing.notes.some(
      n => n.keyNumber === this.keyNumber && n.octave === this.octave
    );
  }

  @Listen('chordDeselected', { target: 'body' })
  async handleChordDeselected(event: any) {
    const wasEnharmonic = this.originalNoteName !== null;
    const restoreName = this.originalNoteName ?? this.noteName;
    if (wasEnharmonic) {
      this.noteName = this.originalNoteName;
      this.originalNoteName = null;
    }
    const notes = event.detail?.notes;
    const isTonic = restoreName === this.selectedKey;
    if (wasEnharmonic || isTonic || !notes || notes.find((n: Note) => n.name === restoreName)) {
      if (isTonic) {
        this.noteColor = 'secondary';
      } else if (this.isDiatonic) {
        this.noteColor = 'tertiary';
      } else {
        this.noteColor = this.isBlack ? 'medium' : 'light';
      }
    }
    this.voicingActive = false;
    this.isVoicingNote = false;
  }

  async updateNote() {

    if (!this.allNotes || !this.keyNotes || !this.selectedKey) { return }

    let standardNoteName;

    switch (this.keyNumber) {
      case 1: { standardNoteName = 'C'; break; }
      case 2: { standardNoteName = 'C♯'; break; }
      case 3: { standardNoteName = 'D'; break; }
      case 4: { standardNoteName = 'D♯'; break; }
      case 5: { standardNoteName = 'E'; break; }
      case 6: { standardNoteName = 'F'; break; }
      case 7: { standardNoteName = 'F♯'; break; }
      case 8: { standardNoteName = 'G'; break; }
      case 9: { standardNoteName = 'G♯'; break; }
      case 10: { standardNoteName = 'A'; break; }
      case 11: { standardNoteName = 'A♯'; break; }
      case 12: { standardNoteName = 'B'; break; }
    }

    let keyNotesIndex = this.keyNotes.findIndex(k => k.name == standardNoteName);
    if (keyNotesIndex < 0) {
      // Find the index of ALL notes that matches what the standard note name would be
      let allNotesIndex = await TheoryService.getNoteIndex(standardNoteName);
      // Get index of key notes where key note matches one of the possible all note names
      keyNotesIndex = this.keyNotes.findIndex(k => this.allNotes[allNotesIndex].name.split(' / ').includes(k.name));
    }

    this.noteName = this.keyNotes[keyNotesIndex].name;
    this.isDiatonic = this.keyNotes[keyNotesIndex].isDiatonic;
    
    if (this.noteName == this.selectedKey) {
      this.noteColor = 'secondary';
    }
    else if (this.isDiatonic) {
      this.noteColor = 'tertiary';
    }
    else {
      this.noteColor = this.isBlack
        ? 'medium'
        : 'light';
    }
  }

  renderWhiteKey() {
    const isTonic = this.noteName === this.selectedKey;
    const opacity = this.voicingActive && !this.isVoicingNote ? '0.25' : '1';
    return [
      <div class="ion-activatable ripple-parent"
           style={{ height: '200px', width: '60px',
                    position: 'relative',
                    opacity,
                    backgroundColor: `var(--ion-color-${this.noteColor})`,
                    color: `var(--ion-color-${this.noteColor}-contrast)`,
                    border: '1px solid lightgray',
                    ...(isTonic
                      ? { borderLeft: '3px solid var(--ion-color-secondary)',
                          borderRight: '3px solid var(--ion-color-secondary)' }
                      : {}),
                    borderRadius: '0 0 5px 5px',
                    display: 'flex', alignItems: 'end', justifyContent: 'center',
                    paddingBottom: '10px' }} >
        {this.noteName}
        {this.isVoicingNote && (
          <div style={{ position: 'absolute', bottom: '30px', left: '50%',
                        transform: 'translateX(-50%)',
                        width: '18px', height: '18px',
                        backgroundColor: 'var(--ion-color-dark)',
                        border: '2px solid white',
                        borderRadius: '50%',
                        zIndex: '5', pointerEvents: 'none' }} />
        )}
        <ion-ripple-effect />
      </div>
    ]
  }

  renderBlackKey() {
    const isTonic = this.noteName === this.selectedKey;
    const opacity = this.voicingActive && !this.isVoicingNote ? '0.25' : '1';
    return [
      <div class="ion-activatable ripple-parent"
           style={{ height: '125px', width: '35px',
                    position: 'relative', left: '-50px',
                    opacity,
                    backgroundColor: `var(--ion-color-${this.noteColor})`,
                    color: `var(--ion-color-${this.noteColor}-contrast)`,
                    ...(isTonic
                      ? { borderLeft: '3px solid var(--ion-color-secondary)',
                          borderRight: '3px solid var(--ion-color-secondary)' }
                      : {}),
                    borderRadius: '0 0 5px 5px',
                    '-webkit-box-shadow': '1px 1px 1px 2px rgba(0,0,0,0.5)',
                    '-moz-box-shadow': '1px 1px 1px 2px rgba(0,0,0,0.5)',
                    'box-shadow': '1px 1px 1px 2px rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'end', justifyContent: 'center',
                    paddingBottom: '10px' }} >
        {this.noteName.replace('♭', '\u266D').replace('♯', '\u266F')}
        {this.isVoicingNote && (
          <div style={{ position: 'absolute', bottom: '30px', left: '50%',
                        transform: 'translateX(-50%)',
                        width: '14px', height: '14px',
                        backgroundColor: 'white',
                        border: '2px solid var(--ion-color-dark)',
                        borderRadius: '50%',
                        zIndex: '5', pointerEvents: 'none' }} />
        )}
        <ion-ripple-effect />
      </div>
    ]
  }

  render() {
    if (this.isBlack) {
      return this.renderBlackKey();
    }
    return this.renderWhiteKey();
  }
}