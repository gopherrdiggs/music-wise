import { Component, h, Listen, State } from "@stencil/core";
import { Note, Scale } from "../../interfaces/application";
import { App } from "../../services/app-state";
import { TheoryService } from "../../services/theory";

@Component({
  tag: 'notes-section'
})
export class NotesSection {

  @State() selectedKey: string;
  @State() selectedKeyAlteration: string;
  @State() selectedScale: Scale;
  @State() notes: Note[] = [];

  async componentWillLoad() {
    this.selectedKey = App.state.currentKey;
    this.selectedKeyAlteration = App.state.currentKeyAlteration;
    this.selectedScale = App.state.currentScale;
  }

  async componentDidLoad() {
    await this.updateNotes();
  }

  @Listen('keyChanged', { target: 'body' })
  async handleKeyChanged(event: any) {
    this.selectedKey = event.detail.key;
    await this.updateNotes();
  }

  @Listen('keyAlterationChanged', { target: 'body' })
  async handleKeyAlterationChanged(event: any) {
    this.selectedKeyAlteration = event.detail.keyAlteration;
    await this.updateNotes();
  }

  @Listen('scaleChanged', { target: 'body' })
  async handleScaleChanged(event: any) {
    this.selectedScale = event.detail.scale;
    await this.updateNotes();
  }

  async updateNotes() {

    if (!this.selectedKey || !this.selectedScale) { return }

    this.notes = await TheoryService.generateKeyNotes(
      this.selectedKey,
      this.selectedKeyAlteration == 'natural' ? '' : TheoryService.getNoteAlterationSymbol(this.selectedKeyAlteration),
      this.selectedScale.intervalPattern);
  }

  render() {
    return [
      <div style={{ backgroundColor: 'rgba(var(--ion-color-tertiary-rgb),.1)',
                    margin: '40px 16px 16px 40px' }} >
        <h1 style={{ color: 'var(--ion-color-tertiary)',
                     transform: 'translate(-8px, -20px)' }}>
          NOTES
        </h1>
      </div>,
      <div style={{ display: 'flex', flexDirection: 'row', 
                    margin: '16px 44px', 
                    overflowX: 'scroll' }}>
        {this.notes.map(note =>
          <note-box noteNumber={note.intervalNumericReference}
                    noteName={note.name}
                    noteSubtext={note.intervalName}
                    isDiatonic={note.isDiatonic}
                    isEmphasized={note.isDiatonic} />
        )}
      </div>
    ]
  }
}