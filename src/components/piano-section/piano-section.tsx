import { Component, h, Listen, State } from "@stencil/core";
import { Note } from "../../interfaces/application";
import { PianoVoicing, generatePianoVoicings } from "../../services/piano-voicings";

@Component({
  tag: 'piano-section'
})
export class PianoSection {

  @State() isCollapsed: boolean;
  @State() pianoVoicings: PianoVoicing[] = [];
  @State() activeVoicingIdx: number = -1;
  @State() activeChordName: string = '';

  async handleSectionHeaderClicked() {
    this.isCollapsed = !this.isCollapsed;
  }

  @Listen('chordSelected', { target: 'body' })
  handleChordSelected(event: any) {
    const notes: Note[] = event.detail.notes;
    this.activeChordName = event.detail.chordName ?? '';
    this.pianoVoicings = generatePianoVoicings(notes);
    this.activeVoicingIdx = -1;
    this.dispatchVoicingEvent(null);
  }

  @Listen('chordDeselected', { target: 'body' })
  handleChordDeselected() {
    this.clearVoicings();
  }

  @Listen('keyChanged', { target: 'body' })
  handleKeyChanged() {
    this.clearVoicings();
  }

  @Listen('keyAlterationChanged', { target: 'body' })
  handleKeyAlterationChanged() {
    this.clearVoicings();
  }

  @Listen('scaleChanged', { target: 'body' })
  handleScaleChanged() {
    this.clearVoicings();
  }

  private clearVoicings() {
    this.pianoVoicings = [];
    this.activeVoicingIdx = -1;
    this.activeChordName = '';
    this.dispatchVoicingEvent(null);
  }

  private dispatchVoicingEvent(voicing: PianoVoicing | null) {
    document.body.dispatchEvent(new CustomEvent('pianoVoicingSelected', {
      bubbles: true,
      detail: voicing
    }));
  }

  private handleVoicingChipClicked(idx: number) {
    if (this.activeVoicingIdx === idx) {
      this.activeVoicingIdx = -1;
      this.dispatchVoicingEvent(null);
    } else {
      this.activeVoicingIdx = idx;
      this.dispatchVoicingEvent(this.pianoVoicings[idx]);
    }
  }

  renderVoicingChips() {
    if (this.pianoVoicings.length === 0) return null;
    return (
      <div style={{ margin: '4px 44px 0', display: 'flex', flexWrap: 'wrap',
                    gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '.8em', color: 'var(--ion-color-medium)',
                       fontStyle: 'italic', marginRight: '4px' }}>
          {this.activeChordName} voicings:
        </span>
        {this.pianoVoicings.map((v, i) => (
          <ion-chip
            color={this.activeVoicingIdx === i ? 'primary' : 'medium'}
            onClick={() => this.handleVoicingChipClicked(i)}
            style={{ cursor: 'pointer', fontSize: '.8em' }}
          >
            {v.label}
          </ion-chip>
        ))}
      </div>
    );
  }

  render() {
    return [
      <div style={{ backgroundColor: 'rgba(var(--ion-color-tertiary-rgb),.1)',
                    margin: '40px 16px 16px 40px' }}
           onClick={()=>this.handleSectionHeaderClicked()} >
        <h1 style={{ color: 'var(--ion-color-tertiary)',
                     transform: this.isCollapsed ? 'none' : 'translate(-8px, -20px)' }}>
          PIANO
        </h1>
      </div>,
      !this.isCollapsed && this.renderVoicingChips(),
      !this.isCollapsed &&
      <div style={{ display: 'flex', flexDirection: 'row',
                    margin: '16px 44px',
                    paddingBottom: '20px',
                    overflowX: 'scroll' }}>
        <piano-key-group octave={1} />
        <piano-key-group octave={2} />
      </div>
    ];
  }
}
