import { Component, h, Listen, Prop, State } from "@stencil/core";
import { Note } from "../../interfaces/application";
import { App } from "../../services/app-state";
import { TheoryService } from "../../services/theory";

@Component({
  tag: 'guitar-fret-note'
})
export class GuitarFretNote {

  @Prop() fretNumber: number;
  @Prop() stringNumber: number;
  @Prop({ mutable: true }) noteColor: string = 'tertiary';
  @Prop() stringSize: 'small' | 'medium' | 'large' = 'medium';
  @Prop() isNut: boolean;
  
  @State() noteName: string;
  @State() isDiatonic: boolean;
  @State() showButton: boolean;

  selectedKey: string;
  keyNotes: Note[] = [];
  currentTuning: string[];
  allNotes: Note[] = [];

  async componentWillLoad() {
    this.selectedKey = App.state.currentKey
    this.keyNotes = App.state.keyNotes;
    this.currentTuning = App.state.guitarTuning;
    this.allNotes = await TheoryService.getNotes();
    await this.updateNote();
  }

  @Listen('noteDeselected', { target: 'body' })
  async handleNoteDeselected(event: any) {
    if (event.detail.noteName == this.noteName) {
      this.showButton = false;
    }
  }

  @Listen('noteSelected', { target: 'body' })
  async handleNoteSelected(event: any) {
    if (event.detail.noteName == this.noteName) {
      this.noteColor = event.detail.color;
      this.showButton = true;
    }
  }

  @Listen('keyNotesChanged', { target: 'body' })
  async handleKeyNotesChanged(event: any) {
    this.keyNotes = event.detail.keyNotes;
    this.selectedKey = this.keyNotes[0].name;
    await this.updateNote();
  }

  @Listen('chordSelected', { target: 'body' })
  async handleChordSelected(event: any) {

    if (event.detail.notes.find(n => n.name == this.noteName)) {
      this.noteColor = event.detail.color;
    }
  }

  async updateNote() {

    if (!this.allNotes || !this.keyNotes || !this.selectedKey || !this.currentTuning) { return }

    let stringStartNote;

    switch (this.stringNumber) {
      case 1: { stringStartNote = this.currentTuning[5]; break; }
      case 2: { stringStartNote = this.currentTuning[4]; break; }
      case 3: { stringStartNote = this.currentTuning[3]; break; }
      case 4: { stringStartNote = this.currentTuning[2]; break; }
      case 5: { stringStartNote = this.currentTuning[1]; break; }
      case 6: { stringStartNote = this.currentTuning[0]; break; }
    }
    
    // Find the index of ALL notes that matches what the standard open note name would be for the string
    let allNotesIndex = await TheoryService.getNoteIndex(stringStartNote);
    // Get index of key notes where key note matches one of the possible all note names for the current fret/string note
    let keyNotesIndex = this.keyNotes.findIndex(k => this.allNotes[allNotesIndex].name.split(' / ').includes(k.name));
    // Get the key notes array in position based on starting (open string) note
    for (;keyNotesIndex > 0; keyNotesIndex--) {
      this.keyNotes.push(this.keyNotes.shift());
    }
    // Adjust array based on fret number
    for (let i=0; i < this.fretNumber; i++) {
      this.keyNotes.push(this.keyNotes.shift());
    }

    this.noteName = this.keyNotes[0].name;
    this.isDiatonic = this.keyNotes[0].isDiatonic;
    
    if (this.noteName == this.selectedKey) {
      this.noteColor = 'secondary';
      this.showButton = true;
    }
    else if (this.isDiatonic) {
      this.noteColor = 'tertiary';
      this.showButton = true;
    }
    else {
      this.noteColor = 'transparent';
      this.showButton = false;
    }
  }

  render() {
    return [
      <div style={{ height: '30px', width: '60px',
                    padding: '2px',
                    backgroundColor: this.isNut ? 'transparent' : '#f5e7bf',
                    position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderLeft: this.isNut ? 'none' : '3px solid rgb(161, 161, 161)',
                    borderRight: '2px solid rgb(190, 190, 190)' }}>
        {!this.isNut && 
          <div style={{ position: 'absolute', top: '45%', left: '-4px',
                        width: '110%', height: 
                        this.stringSize == 'small' ? '2px' : this.stringSize == 'medium' ? '3px' : '5px',
                        background: 'linear-gradient(0deg, rgba(153,153,153,1) 0%, rgba(235,235,235,1) 52%, rgba(153,153,153,1) 100%)',
                        '-webkit-box-shadow': '4px 2px 1px 0px rgba(0,0,0,0.5)',
                        '-moz-box-shadow': '4px 2px 1px 0px rgba(0,0,0,0.5)',
                        'box-shadow': '4px 2px 1px 0px rgba(0,0,0,0.5)' }} />
        }
        {this.showButton &&
          <ion-button color={this.noteColor} size='small' shape='round'
                      style={{ padding: '0px', margin: '0px', 
                               height: '22px', width: '40px' }}>
          {this.noteName.replace('♭', '\u266D').replace('♯', '\u266F')}
          </ion-button>
        }
      </div>
    ]    
  }
}