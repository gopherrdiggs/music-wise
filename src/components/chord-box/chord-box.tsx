import { Component, h, Event, EventEmitter, Prop } from "@stencil/core";
import { Note } from "../../interfaces/application";

@Component({
  tag: 'chord-box',
  styleUrl: 'chord-box.css'
})
export class ChordBox {

  @Event() chordSelected: EventEmitter;

  @Prop() chordNumber: string;
  @Prop() chordName: string;
  @Prop() chordNotes: Note[]; // = 'C • E • G';

  async handleBoxClicked() {

    this.chordSelected.emit({
      name: this.chordName,
      notes: this.chordNotes
    });
  }

  render() {
    return [
      <div style={{ width: '100px', 
                    display: 'flex', flexDirection: 'column' }}
           onClick={()=>this.handleBoxClicked()}>
        <div style={{ color: 'var(--ion-color-dark)', 
                      height: '40px', padding: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {this.chordNumber}
        </div>
        <div class="ion-activatable ripple-parent"
             style={{ color: 'var(--ion-color-dark)', 
                      padding: '24px', border: '2px solid gray', 
                      height: '80px', textAlign: 'center',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {this.chordName}
          <ion-ripple-effect />
        </div>
        <div style={{ color: 'var(--ion-color-medium)', 
                      fontSize: '.6em',
                      padding: '8px', textAlign: 'center' }}>
          {this.chordNotes.map(n => n.name).join(' • ')}
        </div>
      </div>
    ]
  }
}