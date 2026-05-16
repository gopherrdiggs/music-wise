import { Component, h, Event, EventEmitter, Listen, Prop, State } from "@stencil/core";
import { Note } from "../../interfaces/application";
import { TheoryService } from "../../services/theory";

@Component({
  tag: 'chord-box',
  styleUrl: 'chord-box.css'
})
export class ChordBox {

  @Event() chordSelected: EventEmitter;
  @Event() chordDeselected: EventEmitter;

  @Prop() chordNumber: string;
  @Prop() chordName: string;
  @Prop() chordNotes: Note[];

  @State() isSelected: boolean = false;

  private allNotes: Note[] = [];

  async componentWillLoad() {
    this.allNotes = await TheoryService.getNotes();
  }

  @Listen('keyChanged', { target: 'body' })
  handleKeyChanged(_event: any) {
    this.isSelected = false;
  }

  @Listen('keyAlterationChanged', { target: 'body' })
  handleKeyAlterationChanged(_event: any) {
    this.isSelected = false;
  }

  @Listen('scaleChanged', { target: 'body' })
  handleScaleChanged(_event: any) {
    this.isSelected = false;
  }

  @Listen('chordSelected', { target: 'body' })
  handleGlobalChordSelected(event: any) {
    if (event.detail.chordName !== this.chordName && this.isSelected) {
      this.isSelected = false;
    }
  }

  @Listen('chordDeselected', { target: 'body' })
  handleGlobalChordDeselected(_event: any) {
    if (this.isSelected) {
      this.isSelected = false;
    }
  }

  private buildEnharmonicMap(): Record<string, string> {
    const map: Record<string, string> = {};
    for (const chordNote of this.chordNotes) {
      const chromIdx = this.allNotes.findIndex(n => n.name.split(' / ').includes(chordNote.name));
      if (chromIdx < 0) continue;
      for (const altName of this.allNotes[chromIdx].name.split(' / ')) {
        if (altName !== chordNote.name) map[altName] = chordNote.name;
      }
    }
    return map;
  }

  handleBoxClicked() {
    if (this.isSelected) {
      this.isSelected = false;
      this.chordDeselected.emit({ chordName: this.chordName, notes: this.chordNotes });
    } else {
      this.isSelected = true;
      this.chordSelected.emit({
        chordName: this.chordName,
        notes: this.chordNotes,
        enharmonicMap: this.buildEnharmonicMap(),
        color: 'primary'
      });
    }
  }

  render() {
    const color = this.isSelected ? 'primary' : 'light';
    return [
      <div style={{ width: '100px', display: 'flex', flexDirection: 'column',
                    userSelect: 'none', cursor: 'pointer' }}
           onClick={() => this.handleBoxClicked()}>
        <div style={{ color: 'var(--ion-color-dark)',
                      height: '40px', padding: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {this.chordNumber}
        </div>
        <div class="ion-activatable ripple-parent"
             style={{ backgroundColor: `var(--ion-color-${color})`,
                      color: `var(--ion-color-${color}-contrast)`,
                      border: '2px solid gray',
                      height: '90px', boxSizing: 'border-box',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      gap: '5px', padding: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '.85em', fontWeight: 'bold', lineHeight: '1.2' }}>
            {this.chordName.replace('♭', '♭').replace('♯', '♯')}
          </div>
          <div style={{ fontSize: '.52em', lineHeight: '1.4', opacity: '0.9',
                        display: 'flex', flexWrap: 'wrap',
                        justifyContent: 'center', gap: '10px' }}>
            {this.chordNotes.map(n => <span>{n.name}</span>)}
          </div>
          <ion-ripple-effect />
        </div>
      </div>
    ];
  }
}
