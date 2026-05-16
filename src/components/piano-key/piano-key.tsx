import { Component, h, Listen, Prop, State } from "@stencil/core";
import { Note } from "../../interfaces/application";
import { App } from "../../services/app-state";
import { TheoryService } from "../../services/theory";

@Component({
  tag: 'piano-key'
})
export class PianoKey {

  @Prop() keyNumber: number;
  @Prop() isBlack: boolean;

  @State() noteName: string;
  @State() isDiatonic: boolean;
  @State() noteColor: string;

  selectedKey: string;
  keyNotes: Note[] = [];
  allNotes: Note[] = [];
  
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
    if (event.detail.notes.find((n: Note) => n.name == this.noteName)) {
      this.noteColor = event.detail.color;
    }
  }

  @Listen('chordDeselected', { target: 'body' })
  async handleChordDeselected(event: any) {
    const notes = event.detail?.notes;
    if (!notes || notes.find((n: Note) => n.name === this.noteName)) {
      if (this.noteName === this.selectedKey) {
        this.noteColor = 'secondary';
      } else if (this.isDiatonic) {
        this.noteColor = 'tertiary';
      } else {
        this.noteColor = this.isBlack ? 'medium' : 'light';
      }
    }
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
    return [
      <div class="ion-activatable ripple-parent"
           style={{ height: '200px', width: '60px',
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
        <ion-ripple-effect />
      </div>
    ]
  }

  renderBlackKey() {
    const isTonic = this.noteName === this.selectedKey;
    return [
      <div class="ion-activatable ripple-parent"
           style={{ height: '125px', width: '35px',
                    position: 'relative', left: '-50px',
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