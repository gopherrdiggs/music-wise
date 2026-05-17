import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: 'piano-key-group'
})
export class PianoKeyGroup {

  @Prop() octave: number = 1;

  render() {
    return [
      <div style={{ display: 'flex', flexDirection: 'row',
                    position: 'relative' }}>
        <piano-key keyNumber={1} octave={this.octave} />
        <piano-key keyNumber={3} octave={this.octave} />
        <piano-key keyNumber={5} octave={this.octave} />
        <piano-key keyNumber={6} octave={this.octave} />
        <piano-key keyNumber={8} octave={this.octave} />
        <piano-key keyNumber={10} octave={this.octave} />
        <piano-key keyNumber={12} octave={this.octave} />
        <div style={{ display: 'flex', flexDirection: 'row',
                      position: 'absolute', top: '0', width: '100%' }}>
          <piano-key keyNumber={2} isBlack octave={this.octave} style={{ position: 'relative', left: '85px' }} />
          <piano-key keyNumber={4} isBlack octave={this.octave} style={{ position: 'relative', left: '125px' }} />
          <piano-key keyNumber={7} isBlack octave={this.octave} style={{ position: 'relative', left: '195px' }} />
          <piano-key keyNumber={9} isBlack octave={this.octave} style={{ position: 'relative', left: '227px' }} />
          <piano-key keyNumber={11} isBlack octave={this.octave} style={{ position: 'relative', left: '260px' }} />
        </div>
      </div>
    ];
  }
}