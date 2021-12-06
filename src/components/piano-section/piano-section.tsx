import { Component, h } from "@stencil/core";

@Component({
  tag: 'piano-section'
})
export class PianoSection {

  render() {
    return [
      <div style={{ backgroundColor: 'rgba(var(--ion-color-tertiary-rgb),.1)',
                    margin: '40px 16px 16px 40px' }} >
        <h1 style={{ color: 'var(--ion-color-tertiary)',
                     transform: 'translate(-8px, -20px)' }}>
          PIANO
        </h1>
      </div>,
      <div style={{ display: 'flex', flexDirection: 'row', 
                    margin: '16px 44px', 
                    overflowX: 'scroll' }}>
        <piano-key-group />
        <piano-key-group />
      </div>
    ];
  }
}