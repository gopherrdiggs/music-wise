import { Component, h, Event, EventEmitter, Listen, Prop, State } from "@stencil/core";
import { Note } from "../../interfaces/application";
import { PopoverService } from "../../services/popover";

@Component({
  tag: 'chord-box',
  styleUrl: 'chord-box.css'
})
export class ChordBox {

  @Event() chordSelected: EventEmitter;
  @Event() chordDeselected: EventEmitter;

  @Prop() chordNumber: string;
  @Prop() chordName: string;
  @Prop() chordNotes: Note[]; // = 'C • E • G';

  @State() boxColor: string = 'light';

  @Listen('keyChanged', { target: 'body' })
  async handleKeyChanged(_event: any) {
    this.boxColor = 'light';
  }

  @Listen('keyAlterationChanged', { target: 'body' })
  async handleKeyAlterationChanged(_event: any) {
    this.boxColor = 'light';
  }

  @Listen('scaleChanged', { target: 'body' })
  async handleScaleChanged(_event: any) {
    this.boxColor = 'light';
  }

  async handleBoxClicked(event: any) {

    let content = <div style={{ padding: '8px'}}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <ion-button color='light' 
                    onClick={()=>this.handleChordColorSelected()} >
          <ion-icon slot='icon-only' name='close-circle-outline' />
        </ion-button>
        <ion-button color='primary' style={{ width: '55px' }}
                    onClick={()=>this.handleChordColorSelected('primary')} />
        <ion-button color='secondary' style={{ width: '55px' }}
                    onClick={()=>this.handleChordColorSelected('secondary')} />
        <ion-button color='tertiary' style={{ width: '55px' }}
                    onClick={()=>this.handleChordColorSelected('tertiary')} />
      </div>
    </div>;

    let popover = await PopoverService.create({
      component: 'popover-menu',
      componentProps: {
        content: content
      },
      event: event,
      showBackdrop: false
    });

    await popover.present();
  }

  async handleChordColorSelected(color?: 'primary' | 'secondary' | 'tertiary') {

    console.log('Color', color);
    if (!color) {
      
      this.boxColor = 'light';
      this.chordDeselected.emit({
        chordName: this.chordName,
        notes: this.chordNotes
      });
    }
    else {

      this.boxColor = color;
      this.chordSelected.emit({
        chordName: this.chordName,
        notes: this.chordNotes,
        color: color
      });
    }

    await PopoverService.dismiss();
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
        <div class="ion-activatable ripple-parent"
             style={{ backgroundColor: `var(--ion-color-${this.boxColor})`,
                      color: `var(--ion-color-${this.boxColor}-contrast)`, 
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