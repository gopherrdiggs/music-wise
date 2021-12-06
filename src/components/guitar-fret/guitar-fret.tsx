import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: 'guitar-fret'
})
export class GuitarFret {

  @Prop() showFretMarker: boolean;
  @Prop() fretNumber: number;

  render() {
    return [
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ backgroundColor: 'var(--ion-color-medium)', 
                      color: 'var(--ion-color-medium-contrast)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      height: '20',
                      'border-top-left-radius': '15px',
                      'border-top-right-radius': '15px' }}>
          {this.showFretMarker ? this.fretNumber : ''}
        </div>
        <guitar-fret-note fretNumber={this.fretNumber} stringNumber={1} stringSize='small' />
        <guitar-fret-note fretNumber={this.fretNumber} stringNumber={2} stringSize='small' />
        <guitar-fret-note fretNumber={this.fretNumber} stringNumber={3} stringSize='medium' />
        <guitar-fret-note fretNumber={this.fretNumber} stringNumber={4} stringSize='medium' />
        <guitar-fret-note fretNumber={this.fretNumber} stringNumber={5} stringSize='large' />
        <guitar-fret-note fretNumber={this.fretNumber} stringNumber={6} stringSize='large' />
        <div style={{ backgroundColor: 'var(--ion-color-medium)', 
                      color: 'var(--ion-color-medium-contrast)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      height: '20',
                      'border-bottom-left-radius': '15px',
                      'border-bottom-right-radius': '15px' }}>
          {this.showFretMarker ? this.fretNumber : ''}
        </div>
      </div>
    ];
  }
}