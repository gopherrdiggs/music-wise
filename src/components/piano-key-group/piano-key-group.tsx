import { Component, h } from "@stencil/core";

@Component({
  tag: 'piano-key-group'
})
export class PianoKeyGroup {

  render() {
    return [
      <div style={{ display: 'flex', flexDirection: 'row', 
                    position: 'relative' }}>
        <piano-key keyNumber={1} />
        <piano-key keyNumber={3} />
        <piano-key keyNumber={5} />
        <piano-key keyNumber={6} />
        <piano-key keyNumber={8} />
        <piano-key keyNumber={10} />
        <piano-key keyNumber={12} />
        <div style={{ display: 'flex', flexDirection: 'row', 
                      position: 'absolute', top: '0', width: '100%' }}>
          <piano-key keyNumber={2} isBlack style={{ position: 'relative', left: '85px' }} />
          <piano-key keyNumber={4} isBlack style={{ position: 'relative', left: '125px' }} />
          <piano-key keyNumber={7} isBlack style={{ position: 'relative', left: '195px' }} />
          <piano-key keyNumber={9} isBlack style={{ position: 'relative', left: '228px' }} />
          <piano-key keyNumber={11} isBlack style={{ position: 'relative', left: '260px' }} />
        </div>
      </div>
    ];
  }
}