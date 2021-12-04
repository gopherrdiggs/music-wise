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
  @Prop({ mutable: true }) noteName: string;
  @Prop({ mutable: true }) noteColor: string = 'tertiary';
  @Prop() stringSize: 'small' | 'medium' | 'large' = 'medium';
  @Prop() isNut: boolean;

  @State() showButton: boolean;

  selectedKey: string;
  keyNotes: Note[] = [];
  scaleNotes: Note[] = [];
  currentTuning: string[];
  allNotes: Note[] = [];
  noteNaturals: Note[] = [];

  async componentWillLoad() {
    this.selectedKey = App.state.currentKey
    this.keyNotes = App.state.keyNotes;
    this.scaleNotes = App.state.scaleNotes;
    this.currentTuning = App.state.guitarTuning;
    this.allNotes = await TheoryService.getNotes();
    this.noteNaturals = await TheoryService.getNoteNaturals();
  }

  async componentDidLoad() {
    await this.updateNote();
  }

  @Listen('noteDeselected', { target: 'body' })
  async handleNoteDeselected(_event: any) {
    // Event from note-box
    await this.updateNote();
  }

  @Listen('noteSelected', { target: 'body' })
  async handleNoteSelected(_event: any) {
    // Event from note-box
    await this.updateNote();
  }

  @Listen('keyNotesChanged', { target: 'body' })
  async handleKeyNotesChanged(event: any) {
    this.keyNotes = event.detail.keyNotes;
    this.scaleNotes = event.detail.keyNotes.filter(n => n.isDiatonic).slice(0.7)
    this.selectedKey = this.keyNotes[0].name;
    await this.updateNote();
  }

  // @Listen('scaleNotesChanged', { target: 'body' })
  // async handleScaleNotesChanged(event: any) {
  //   console.log('Handling changes')
  //   this.scaleNotes = event.detail.scaleNotes;
  //   await this.updateNote();
  // }

  async updateNote() {

    if (!this.keyNotes || !this.scaleNotes || !this.selectedKey || !this.currentTuning) { return }

    // Use fret and string number, along with scale notes and current tuning
    // to determine which note this is and what is visible state should be.

    let stringStartNote;

    switch (this.stringNumber) {
      case 1: { stringStartNote = this.currentTuning[5]; break; }
      case 2: { stringStartNote = this.currentTuning[4]; break; }
      case 3: { stringStartNote = this.currentTuning[3]; break; }
      case 4: { stringStartNote = this.currentTuning[2]; break; }
      case 5: { stringStartNote = this.currentTuning[1]; break; }
      case 6: { stringStartNote = this.currentTuning[0]; break; }
    }
    
    // Find the index of ALL notes that matches what the natural note name would be
    let allNotesIndex = await TheoryService.getNoteIndex(stringStartNote);
    // Get index of key notes where key note matches one of the possible all note names
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
    
    if (this.noteName == this.selectedKey) {
      this.noteColor = 'secondary';
      this.showButton = true;
    }
    else if (this.scaleNotes.find(s => s.name == this.noteName)) {
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
                      style={{ padding: '0px', margin: '0px', height: '22px' }}>
          {this.noteName}
          </ion-button>
        }
      </div>
    ]    
  }
}