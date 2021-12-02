import { Component, h, Listen, State } from "@stencil/core";
import { Chord, ChordGroup, Scale } from "../../interfaces/application";
import { App } from "../../services/app-state";
import { TheoryService } from "../../services/theory";

@Component({
  tag: 'key-chords'
})
export class KeyChords {

  @State() selectedKey: string;
  @State() selectedKeyAlteration: string;
  @State() selectedScale: Scale;
  @State() chordGroups: ChordGroup[] = [];
  @State() chords: Chord[] = [];

  async componentWillLoad() {
    this.selectedKey = App.state.currentKey;
    this.selectedKeyAlteration = App.state.currentKeyAlteration;
    this.selectedScale = App.state.currentScale;
  }

  async componentDidLoad() {
    await this.updateChords();
  }

  @Listen('keyChanged', { target: 'body' })
  async handleKeyChanged(event: any) {
    this.selectedKey = event.detail.key;
    await this.updateChords();
  }

  @Listen('keyAlterationChanged', { target: 'body' })
  async handleKeyAlterationChanged(event: any) {
    this.selectedKeyAlteration = event.detail.keyAlteration;
    await this.updateChords();
  }

  @Listen('scaleChanged', { target: 'body' })
  async handleScaleChanged(event: any) {
    this.selectedScale = event.detail.scale;
    await this.updateChords();
  }

  async updateChords() {

    if (!this.selectedKey || !this.selectedScale) { return }

    this.chordGroups = await TheoryService.generateKeyChordGroups(
      this.selectedKey,
      this.selectedKeyAlteration == 'natural' ? '' : TheoryService.getNoteAlterationSymbol(this.selectedKeyAlteration),
      this.selectedScale.intervalPattern
    );


    let tempChords: Chord[] = [];
    for (let i=0; i < this.selectedScale.chordPattern.length; i++) {

      // Get the chord type (i.e., major, minor, dim.) from the scale
      let chordNumber = this.selectedScale.chordPattern[i];
      let chordGroup = this.chordGroups[i];
      // Find the specific chord in this group with that type name
      let chord = chordGroup.chords.find(c => {
        if (['I','II','III','IV','V','VI','VII'].includes(chordNumber)) {
          return c.name.endsWith('Major');
        }
        else if (['i','ii','iii','iv','v','vi','vii'].includes(chordNumber)) {
          return c.name.endsWith('Minor');
        }
        else {
          return c.name.endsWith('Diminished');
        }
      });
      
      tempChords.push({
        ...chord, 
        number: this.selectedScale.chordPattern[i]
      });
    }

    this.chords = tempChords;
  }

  render() {
    return [
      <div style={{ backgroundColor: 'rgba(var(--ion-color-tertiary-rgb),.1)',
                    margin: '40px 16px 16px 40px' }} >
        <h1 style={{ color: 'var(--ion-color-tertiary)',
                     transform: 'translate(-8px, -20px)' }}>
          CHORDS
        </h1>
      </div>,
      <div style={{ display: 'flex', flexDirection: 'row', 
                    margin: '16px', 
                    overflowX: 'scroll' }}>
        {this.chords.map(chord =>
          <chord-box chordNumber={chord.number}
                     chordName={chord.name}
                     chordNotes={chord.notes} />
        )}
      </div>
    ]
  }
}