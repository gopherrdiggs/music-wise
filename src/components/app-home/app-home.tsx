import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home'
})
export class AppHome {
  render() {
    return [
      <ion-header>
        <app-header-toolbar headerTitle='Scales and Chords' />
      </ion-header>,

      <ion-content class="ion-padding">

      </ion-content>
    ];
  }
}
