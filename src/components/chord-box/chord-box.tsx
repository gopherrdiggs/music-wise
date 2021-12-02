import { Component, h, Prop } from "@stencil/core";
import { Note } from "../../interfaces/application";

@Component({
  tag: 'chord-box'
})
export class ChordBox {

  @Prop() chordNumber: string;
  @Prop() chordName: string;
  @Prop() chordNotes: Note[]; // = 'C • E • G';

  async handleBoxClicked(_event: any) {

  }

  render() {
    return [
      <div style={{ width: '100px', 
                    display: 'flex', flexDirection: 'column' }}
           onClick={(e)=>this.handleBoxClicked(e)}>
        <div style={{ color: 'var(--ion-color-dark)', 
                      height: '40px', padding: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {this.chordNumber}
        </div>
        <div style={{ color: 'var(--ion-color-dark)', 
                      padding: '24px', border: '2px solid gray', 
                      height: '80px', textAlign: 'center',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {this.chordName}
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