import { Component, h, State } from '@stencil/core';
import { Note, OldScale, Tone, ToneAlteration } from '../../interfaces/application';

@Component({
  tag: 'app-home'
})
export class AppHome {

  @State() tones: Tone[] = [
    { id: 'a',  name: "A / B♭♭ / G♯♯" },
    { id: 'as', name: "A♯ / B♭" },
    { id: 'b',  name: "B / C♭ / A♯♯" },
    { id: 'c',  name: "C / D♭♭ / B♯" },
    { id: 'cs', name: "C♯ / D♭" },
    { id: 'd',  name: "D / E♭♭ / C♯♯" },
    { id: 'ds', name: "D♯ / E♭" },
    { id: 'e',  name: "E / F♭ / D♯♯" },
    { id: 'f',  name: "F / G♭♭ / E♯" },
    { id: 'fs', name: "F♯ / G♭" },
    { id: 'g',  name: "G / A♭♭ / F♯♯" },
    { id: 'gs', name: "G♯ / A♭" }
  ]

  @State() toneNaturals: Tone[] = [
    { id: 'a', name: 'A' },
    { id: 'b', name: 'B' },
    { id: 'c', name: 'C' },
    { id: 'd', name: 'D' },
    { id: 'e', name: 'E' },
    { id: 'f', name: 'F' },
    { id: 'g', name: 'G' }
  ];
  @State() toneAlterations: ToneAlteration[] = [
    { id: 'flat', symbol: '♭', name: 'Flat' },
    { id: 'sharp', symbol: '♯', name: 'Sharp' }
  ];
  @State() scales: OldScale[] = [
    { id: 'major', name: 'Major', toneIntervalPattern: ['W','W','H','W','W','W','H'], chordPattern: ['I','ii','iii','IV','V','vi','vii°'] },
    { id: 'minor', name: 'Minor', toneIntervalPattern: ['W','H','W','W','H','W','W'], chordPattern: ['i','ii°','III','iv','v','VI','VII'] }
  ];

  @State() selectedToneNatural: Tone;
  @State() selectedToneAlteration: ToneAlteration;
  @State() selectedScale: OldScale;
  @State() combinedKeyName: string;
  @State() keyTones: string[] = [];
  @State() keyChords: string[] = [];

  // New stuff
  @State() keyNotes: Note[];

  async generateKeyTones() {

    if (!this.selectedToneNatural || !this.selectedScale) { return; }

    let toneIntervals = this.selectedScale.toneIntervalPattern;
    let tempKeyTones = [`${this.selectedToneNatural.name}${this.selectedToneAlteration ? this.selectedToneAlteration.symbol : ''}`];
    let toneIndex = this.tones.findIndex(t => t.name.split(' / ').includes(tempKeyTones[0]));
    let toneNaturalIndex = this.toneNaturals.findIndex(t => t.name === this.selectedToneNatural.name);
    
    for (let i = 0; i < toneIntervals.length; i++) {
      toneIndex = await this.moveIndex(toneIndex, this.tones.length - 1, toneIntervals[i] === 'H' ? 1 : 2);
      toneNaturalIndex = await this.moveIndex(toneNaturalIndex, this.toneNaturals.length - 1, 1);
      tempKeyTones.push(this.tones[toneIndex].name.split(' / ').find(n => n.includes(this.toneNaturals[toneNaturalIndex].name)));
    }

    this.keyTones = tempKeyTones;
  }

  async generateKeyChords() {
    
    if (!this.selectedToneNatural || !this.selectedScale) { return; }

    let chordPattern = this.selectedScale.chordPattern;
    let tempKeyChords = [];

    for (let i = 0; i < chordPattern.length; i++) {
      tempKeyChords.push(`${this.keyTones[i]}${this.getChordSuffix(chordPattern[i])}`);
    }

    this.keyChords = tempKeyChords;
  }

  getChordSuffix(patternName: string) {
    if (['i','ii','iii','iv','v','vi','vii'].includes(patternName)) {
      return 'm';
    }
    else if (['ii°','vii°'].includes(patternName)) {
      return 'dim';
    }
    return '';
  }

  async moveIndex(index: number, maxIndex: number, numMoves: number) {
    for (let i = 0; i < numMoves; i++) {
      index++;
      if (index > maxIndex) {
        index = 0;
      }
    }
    return index;
  }

  async updateCombinedKeyName() {
    if (!this.selectedToneNatural || !this.selectedScale) {
      this.combinedKeyName = null;
    }
    else {
      this.combinedKeyName = `${this.selectedToneNatural.name}${this.selectedToneAlteration ? this.selectedToneAlteration.symbol : ''} ${this.selectedScale.name}`;
    }
  }

  async handleToneNaturalSelected(event: any) {
    this.selectedToneNatural = event.detail.value ? this.toneNaturals.find(i => i.id === event.detail.value) : null;
    await this.updateCombinedKeyName();
    await this.generateKeyTones();
    await this.generateKeyChords();
  }

  async handleToneAlterationSelected(event: any) {
    this.selectedToneAlteration = this.toneAlterations.find(i => i.id === event.detail.value);
    await this.updateCombinedKeyName();
    await this.generateKeyTones();
    await this.generateKeyChords();
  }

  async handleScaleSelected(event: any) {
    this.selectedScale = this.scales.find(i => i.id === event.detail.value);
    await this.updateCombinedKeyName();
    await this.generateKeyTones();
    await this.generateKeyChords();
  }

  render() {
    return [
      <ion-header>
        <app-header-toolbar headerTitle='Notes and Chords' />
      </ion-header>,
      <ion-content>
        {/* <collapsi-card cardTitle={`Key${this.combinedKeyName ? `: ${this.combinedKeyName}` : ''}`}>
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-item>
                  <ion-select style={{ width: '100%' }}
                              onIonChange={(e)=>this.handleToneNaturalSelected(e)}>
                    {this.toneNaturals.map(toneNatural =>
                      <ion-select-option value={toneNatural.id}>{toneNatural.name}</ion-select-option>  
                    )}
                  </ion-select>
                </ion-item>
              </ion-col>
              <ion-col>
                <ion-item>
                  <ion-select style={{ width: '100%' }}
                              disabled={!this.selectedToneNatural}
                              onIonChange={(e)=>this.handleToneAlterationSelected(e)}>
                    <ion-select-option value=''></ion-select-option>
                    {this.toneAlterations.map(toneAlteration =>
                      <ion-select-option value={toneAlteration.id}>{toneAlteration.symbol} ({toneAlteration.name})</ion-select-option>  
                    )}
                  </ion-select>
                </ion-item>
              </ion-col>
              <ion-col>
                <ion-item>
                  <ion-select style={{ width: '100%' }}
                              disabled={!this.selectedToneNatural}
                              onIonChange={(e)=>this.handleScaleSelected(e)}>
                    {this.scales.map(scale =>
                      <ion-select-option value={scale.id}>{scale.name}</ion-select-option>  
                    )}
                  </ion-select>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>
        </collapsi-card>
        {this.selectedScale &&
          <collapsi-card cardTitle='Tones / Scale'>
            <div id='tones-section-wrapper' class='flex-col' style={{ marginTop: '20px' }}>
              <div id='tones-interval-pattern-wrapper' class='flex-row'>
                {this.selectedScale.toneIntervalPattern.map(toneInterval =>
                  <div class='tone-interval-pattern-box'>
                    <div class='tone-interval-pattern-box-content'>
                      {toneInterval}
                    </div>
                  </div>
                )}
                <div class='tone-interval-pattern-box'></div>
              </div>
              <div id='tones-wrapper' class='flex-row' style={{ height: '80px' }} >
                {this.keyTones.map(keyTone =>  
                  <div class='tone-box'><div class='tone-box-content'>{keyTone}</div></div>
                )}
              </div>
            </div>
          </collapsi-card>
        }
        {this.selectedScale &&
          <collapsi-card cardTitle='Chords'>
            <div id='chords-section-wrapper' class='flex-col' style={{ marginTop: '20px' }}>
              <div id='chords-pattern-wrapper' class='flex-row'>
                {this.selectedScale.chordPattern.map(chordNumeral =>
                  <div class='chords-pattern-box'>
                    <div class='chords-pattern-box-content'>
                      {chordNumeral}
                    </div>
                  </div>
                )}
              </div>
              <div id='chords-wrapper' class='flex-row' style={{ height: '80px' }} >
                {this.keyChords.map(chord =>  
                  <div class='chords-box'><div class='chords-box-content'>{chord}</div></div>
                )}
              </div>
            </div>
          </collapsi-card>
        } */}
        <key-scale-selector />
        <key-notes />
        <key-chords />

      </ion-content>
    ];
  }
}
