import { Component, h, Event, EventEmitter, Prop } from "@stencil/core";
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
  @Prop() boxColor: string;
  @Prop() isDiatonic: boolean;
  @Prop() isSelected: boolean;
  @Prop() isHighlighted: boolean;
  @Prop() isEmphasized: boolean;
  
  async handleBoxClicked(event: any) {

    let content = <div style={{ padding: '8px'}}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <ion-button color='light'>
          <ion-icon slot='icon-only' name='close-circle-outline' />
        </ion-button>
        <ion-button color='primary' style={{ width: '55px' }} />
        <ion-button color='secondary' style={{ width: '55px' }} />
        <ion-button color='tertiary' style={{ width: '55px' }} />
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
             style={{ color: this.isEmphasized ? 'var(--ion-color-dark)' : 'var(--ion-color-medium-tint)', 
                      fontSize: this.isEmphasized ? '1.5em' : '1em',
                      fontWeight: this.isEmphasized ? 'bold' : 'normal',
                      padding: '24px', border: '2px solid gray', 
                      height: '60px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {this.noteName}
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