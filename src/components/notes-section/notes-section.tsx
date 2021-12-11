import { Component, h, Event, EventEmitter, Listen, State } from "@stencil/core";
import { Note, Scale } from "../../interfaces/application";
import { App } from "../../services/app-state";
import { TheoryService } from "../../services/theory";

@Component({
  tag: 'notes-section'
})
export class NotesSection {

  @Event() keyNotesChanged: EventEmitter;
  @Event() scaleNotesChanged: EventEmitter;

  @State() selectedKey: string;
  @State() selectedKeyAlteration: 'natural' | 'flat' | 'sharp';
  @State() selectedScale: Scale;
  @State() notes: Note[] = [];
  @State() isCollapsed: boolean;

  async componentWillLoad() {
    this.selectedKey = App.state.currentKey;
    this.selectedKeyAlteration = App.state.currentKeyAlteration;
    this.selectedScale = App.state.currentScale;
    await this.updateNotes();
  }

  @Listen('keyChanged', { target: 'body' })
  async handleKeyChanged(event: any) {
    this.selectedKey = event.detail.key;
    console.log('notes-section key changed', this.selectedKey);
    await this.updateNotes();
  }

  @Listen('keyAlterationChanged', { target: 'body' })
  async handleKeyAlterationChanged(event: any) {
    this.selectedKeyAlteration = event.detail.keyAlteration;
    console.log('notes-section key alt changed', this.selectedKeyAlteration);
    await this.updateNotes();
  }

  @Listen('scaleChanged', { target: 'body' })
  async handleScaleChanged(event: any) {
    this.selectedScale = event.detail.scale;
    console.log('notes-section scale changed', this.selectedScale);
    await this.updateNotes();
  }

  async updateNotes() {

    if (!this.selectedKey || !this.selectedScale) { return }

    this.notes = await TheoryService.generateKeyNotes(
      this.selectedKey,
      await TheoryService.getNoteAlterationSymbol(this.selectedKeyAlteration),
      this.selectedScale.intervalPattern);

    if (this.notes && this.notes.length > 11) {
      this.keyNotesChanged.emit({
        keyNotes: this.notes
      })
      this.scaleNotesChanged.emit({
        scaleNotes: this.notes.filter(n => n.isDiatonic).slice(0,7)
      });
    }
  }

  async handleSectionHeaderClicked() {
    this.isCollapsed = !this.isCollapsed;
  }

  render() {
    return [
      <div style={{ backgroundColor: 'rgba(var(--ion-color-tertiary-rgb),.1)',
                    margin: '40px 16px 16px 40px' }}
           onClick={()=>this.handleSectionHeaderClicked()} >
        <h1 style={{ color: 'var(--ion-color-tertiary)',
                     transform: this.isCollapsed ? 'none' : 'translate(-8px, -20px)' }}>
          NOTES
        </h1>
      </div>,
      !this.isCollapsed &&
      <div style={{ display: 'flex', flexDirection: 'row', 
                    margin: '16px 44px', 
                    paddingBottom: '20px',
                    overflowX: 'scroll' }}>
        {this.notes.map((note, indx) =>
          <note-box id={`note_${note.intervalNumericReference}`}  
                    key={`note_${note.intervalNumericReference}`} 
                    keyNoteIndex={indx} />
        )}
      </div>
    ]
  }
}