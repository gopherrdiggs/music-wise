import { Component, h, Listen, State } from "@stencil/core";
import { Scale } from "../../interfaces/application";
import { App } from "../../services/app-state";

@Component({
  tag: 'guitar-section'
})
export class GuitarSection {

  @State() selectedKey: string;
  @State() selectedKeyAlteration: string;
  @State() selectedScale: Scale;
  @State() isCollapsed: boolean;

  async componentWillLoad() {
    this.selectedKey = App.state.currentKey;
    this.selectedKeyAlteration = App.state.currentKeyAlteration;
    this.selectedScale = App.state.currentScale;
  }

  @Listen('keyChanged', { target: 'body' })
  async handleKeyChanged(event: any) {
    this.selectedKey = event.detail.key;
  }

  @Listen('keyAlterationChanged', { target: 'body' })
  async handleKeyAlterationChanged(event: any) {
    this.selectedKeyAlteration = event.detail.keyAlteration;
  }

  @Listen('scaleChanged', { target: 'body' })
  async handleScaleChanged(event: any) {
    this.selectedScale = event.detail.scale;
  }

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
          GUITAR
        </h1>
      </div>,
      !this.isCollapsed &&
      <div style={{ display: 'flex', flexDirection: 'row', 
                    alignItems: 'center', 
                    margin: '24px 44px', 
                    paddingBottom: '20px',
                    overflowX: 'scroll' }}>
        <guitar-nut />
        <guitar-fret fretNumber={1} />
        <guitar-fret fretNumber={2} />
        <guitar-fret fretNumber={3} showFretMarker />
        <guitar-fret fretNumber={4} />
        <guitar-fret fretNumber={5} showFretMarker />
        <guitar-fret fretNumber={6} />
        <guitar-fret fretNumber={7} showFretMarker />
        <guitar-fret fretNumber={8} />
        <guitar-fret fretNumber={9} showFretMarker />
        <guitar-fret fretNumber={10} />
        <guitar-fret fretNumber={11} />
        <guitar-fret fretNumber={12} showFretMarker />
        <guitar-fret fretNumber={13} />
        <guitar-fret fretNumber={14} />
        <guitar-fret fretNumber={15} showFretMarker />
        <guitar-fret fretNumber={16} />
        <guitar-fret fretNumber={17} showFretMarker />
        <guitar-fret fretNumber={18} />
        <guitar-fret fretNumber={19} showFretMarker />
        <guitar-fret fretNumber={20} />
        <guitar-fret fretNumber={21} showFretMarker />
        <guitar-fret fretNumber={22} />
      </div>
    ]
  }
}