import { Component, h } from "@stencil/core";

@Component({
  tag: 'guitar-nut'
})
export class GuitarNut {

  render() {
    return [
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '20' }} />
        <guitar-fret-note isNut fretNumber={0} stringNumber={1} noteColor='medium' stringSize='small' />
        <guitar-fret-note isNut fretNumber={0} stringNumber={2} noteColor='medium' stringSize='small' />
        <guitar-fret-note isNut fretNumber={0} stringNumber={3} noteColor='medium' stringSize='medium' />
        <guitar-fret-note isNut fretNumber={0} stringNumber={4} noteColor='medium' stringSize='medium' />
        <guitar-fret-note isNut fretNumber={0} stringNumber={5} noteColor='medium' stringSize='large' />
        <guitar-fret-note isNut fretNumber={0} stringNumber={6} noteColor='medium' stringSize='large' />
        <div style={{ height: '20' }} />
      </div>
    ];
  }
}