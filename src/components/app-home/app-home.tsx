import { Component, h, State } from '@stencil/core';
import { Note, Tone, ToneAlteration } from '../../interfaces/application';

@Component({
  tag: 'app-home'
})
export class AppHome {

  @State() selectedToneNatural: Tone;
  @State() selectedToneAlteration: ToneAlteration;
  @State() combinedKeyName: string;
  @State() keyTones: string[] = [];
  @State() keyChords: string[] = [];
  @State() keyNotes: Note[];

  render() {
    return [
      <ion-header>
        <app-header-toolbar headerTitle='Music Theory' />
      </ion-header>,
      <ion-content>
        <key-scale-selector />
        <notes-section />
        <chords-section />
        <progressions-section />
        <piano-section />
        <guitar-section />
        <div style={{ height: '50px' }} />
      </ion-content>
    ];
  }
}
