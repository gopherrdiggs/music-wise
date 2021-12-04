import { Component, h, Listen, Prop } from "@stencil/core";

@Component({
  tag: 'guitar-fret-note'
})
export class GuitarFretNote {

  @Prop() fretNumber: number;
  @Prop() stringNumber: number;
  @Prop() noteName: string = 'C';
  @Prop() noteColor: string = 'tertiary';
  @Prop() stringSize: 'small' | 'medium' | 'large' = 'medium';

  @Listen('noteSelected', { target: 'body' })
  async handleNoteSelected(_event: any) {
    
  }


  render() {
    return [
      <div style={{ height: '30px', width: '60px',
                    padding: '2px',
                    backgroundColor: '#f5e7bf',
                    position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderLeft: '3px solid rgb(161, 161, 161)',
                    borderRight: '2px solid rgb(190, 190, 190)' }}>
        <div style={{ position: 'absolute', top: '45%', left: '-4px',
                      width: '110%', height: 
                      this.stringSize == 'small' ? '2px' : this.stringSize == 'medium' ? '3px' : '5px',
                      background: 'linear-gradient(0deg, rgba(153,153,153,1) 0%, rgba(235,235,235,1) 52%, rgba(153,153,153,1) 100%)',
                      '-webkit-box-shadow': '4px 2px 1px 0px rgba(0,0,0,0.5)',
                      '-moz-box-shadow': '4px 2px 1px 0px rgba(0,0,0,0.5)',
                      'box-shadow': '4px 2px 1px 0px rgba(0,0,0,0.5)' }} />
        <ion-button color={this.noteColor} size='small' shape='round'
                    style={{ padding: '0px', margin: '0px', height: '22px' }}>
          {this.noteName}
        </ion-button>
      </div>
    ]    
  }
}