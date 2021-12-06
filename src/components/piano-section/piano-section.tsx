import { Component, h, State } from "@stencil/core";

@Component({
  tag: 'piano-section'
})
export class PianoSection {

  @State() isCollapsed: boolean;

  async handleSectionHeaderClicked() {
    this.isCollapsed = !this.isCollapsed;
  }

  render() {
    return [
      <div style={{ backgroundColor: 'rgba(var(--ion-color-tertiary-rgb),.1)',
                    margin: '40px 16px 16px 40px' }}
           onClick={()=>this.handleSectionHeaderClicked()} >
        <h1 style={{ color: 'var(--ion-color-tertiary)',
                     transform: this.isCollapsed ? 'none' : 'translate(-8px, -20px)' }}>
          PIANO
        </h1>
      </div>,
      !this.isCollapsed &&
      <div style={{ display: 'flex', flexDirection: 'row', 
                    margin: '16px 44px',
                    paddingBottom: '20px',
                    overflowX: 'scroll' }}>
        <piano-key-group />
        <piano-key-group />
      </div>
    ];
  }
}