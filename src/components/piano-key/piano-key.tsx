import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: 'piano-key'
})
export class PianoKey {

  @Prop() keyNumber: number;
  @Prop() isBlack: boolean;

  renderWhiteKey() {
    return [
      <div class="ion-activatable ripple-parent"
           style={{ height: '200px', width: '60px',
                    backgroundColor: 'var(--ion-color-light)',
                    border: '1px solid lightgray',
                    borderRadius: '0 0 5px 5px' }} >
        <ion-ripple-effect />
      </div>
    ]
  }

  renderBlackKey() {
    return [
      <div class="ion-activatable ripple-parent"
           style={{ height: '125px', width: '35px',
                    position: 'relative', left: '-50px',
                    backgroundColor: 'var(--ion-color-medium-shade)',
                    borderRadius: '0 0 5px 5px',
                    '-webkit-box-shadow': '1px 1px 1px 2px rgba(0,0,0,0.75)',
                    '-moz-box-shadow': '1px 1px 1px 2px rgba(0,0,0,0.75)',
                    'box-shadow': '1px 1px 1px 2px rgba(0,0,0,0.75)' }} >
        <ion-ripple-effect />
      </div>
    ]
  }

  render() {
    if (this.isBlack) {
      return this.renderBlackKey();
    }
    return this.renderWhiteKey();
  }
}