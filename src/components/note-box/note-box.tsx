import { Component, h, Event, EventEmitter, Listen, Prop, State } from "@stencil/core";
import { App } from "../../services/app-state";
import { PopoverService } from "../../services/popover";

@Component({
  tag: 'note-box',
  styleUrl: 'note-box.css'
})
export class NoteBox {

  @Event() noteSelected: EventEmitter;
  @Event() noteDeselected: EventEmitter;

  @Prop() noteNumber: string = '';
  @Prop() noteName: string;
  @Prop() noteSubtext: string;
  @Prop({ mutable: true }) isDiatonic: boolean;
  @Prop({ mutable: true }) isSelected: boolean;

  @State() boxColor: string;

  selectedKey: string;
  
  async componentWillLoad() {
    this.selectedKey = App.state.currentKey
    await this.updateNote();
  }

  @Listen('keyChanged', { target: 'body' })
  async handleKeyChanged(event: any) {
    this.selectedKey = event.detail.key;
    await this.updateNote();
  }

  @Listen('keyAlterationChanged', { target: 'body' })
  async handleKeyAlterationChanged(_event: any) {
    await this.updateNote();
  }

  @Listen('scaleChanged', { target: 'body' })
  async handleScaleChanged(_event: any) {
    await this.updateNote();
  }

  @Listen('noteDeselected', { target: 'body' })
  async handleNoteDeselected(event: any) {
    if (event.detail.noteName == this.noteName) {
      this.boxColor = 'light';
    }
  }

  @Listen('noteSelected', { target: 'body' })
  async handleNoteSelected(event: any) {
    if (event.detail.noteName == this.noteName) {
      this.boxColor = event.detail.color;
    }
  }

  @Listen('chordDeselected', { target: 'body' })
  async handleChordDeselected(_event: any) {

  }

  @Listen('chordSelected', { target: 'body' })
  async handleChordSelected(event: any) {

    if (event.detail.notes.find(n => n.name == this.noteName)) {
      this.boxColor = event.detail.color;
    }
  }

  async updateNote() {
    
    this.boxColor = this.noteName == this.selectedKey
      ? 'secondary'
      : this.isDiatonic 
        ? 'tertiary' 
        : 'light';
  }

  async handleBoxClicked(event: any) {

    let content = <div style={{ padding: '8px'}}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <ion-button color='light' 
                    onClick={()=>this.handleNoteColorSelected()} >
          <ion-icon slot='icon-only' name='close-circle-outline' />
        </ion-button>
        <ion-button color='primary' style={{ width: '55px' }}
                    onClick={()=>this.handleNoteColorSelected('primary')} />
        <ion-button color='secondary' style={{ width: '55px' }}
                    onClick={()=>this.handleNoteColorSelected('secondary')} />
        <ion-button color='tertiary' style={{ width: '55px' }}
                    onClick={()=>this.handleNoteColorSelected('tertiary')} />
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

  async handleNoteColorSelected(color?: 'primary' | 'secondary' | 'tertiary') {

    console.log('Color', color);
    if (!color) {
      
      this.boxColor = 'light';
      this.noteDeselected.emit({
        noteName: this.noteName
      });
    }
    else {

      this.boxColor = color;
      this.noteSelected.emit({
        noteName: this.noteName,
        color: color
      });
    }

    await PopoverService.dismiss();
  }

  render() {
    return [
      <div style={{ width: '60px', 
                    display: 'flex', flexDirection: 'column' }}
           onClick={(e)=>this.handleBoxClicked(e)}>
        <div style={{ color: this.isDiatonic ? 'var(--ion-color-dark)' : 'var(--ion-color-medium-tint)', 
                      fontSize: this.isDiatonic ? '1.5em' : '1em',
                      fontWeight: this.isDiatonic ? 'bold' : 'normal',
                      height: '40px', padding: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {this.noteNumber}
        </div>
        <div class="ion-activatable ripple-parent"
             style={{ backgroundColor: `var(--ion-color-${this.boxColor})`,
                      color: `var(--ion-color-${this.boxColor}-contrast)`, 
                      fontSize: this.isDiatonic ? '1.5em' : '1em',
                      fontWeight: this.isDiatonic ? 'bold' : 'normal',
                      padding: '24px', border: '2px solid gray', 
                      height: '60px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {this.noteName.replace('♭', '\u266D').replace('♯', '\u266F')}
          <ion-ripple-effect />
        </div>
        <div style={{ color: 'var(--ion-color-medium)', 
                      fontSize: '.6em',
                      padding: '8px', textAlign: 'center' }}>
          {this.noteSubtext}
        </div>
      </div>
    ];
  }
}