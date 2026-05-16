import { Component, h, Listen, State } from "@stencil/core";
import { Chord, ChordGroup, ChordType, Scale } from "../../interfaces/application";
import { App } from "../../services/app-state";
import { TheoryService } from "../../services/theory";

const DEFAULT_TYPES: ChordType[] = ['triad'];

// For each active chord type, defines which interval pattern to show per scale degree quality.
// Interval patterns are the single source of truth — no chord names hard-coded here.
const TYPE_CONFIG: {
  type: ChordType;
  label: string;
  majorPattern?: string;
  minorPattern?: string;
  dimPattern?: string;
  augPattern?: string;
}[] = [
  { type: 'triad',    label: 'Main Chords',  majorPattern: '1|3|5',       minorPattern: '1|♭3|5',       dimPattern: '1|♭3|♭5',    augPattern: '1|3|♯5'   },
  { type: 'seventh',  label: '7th Chords',   majorPattern: '1|3|5|7',     minorPattern: '1|♭3|5|♭7',    dimPattern: '1|♭3|♭5|♭7', augPattern: '1|3|♯5|7' },
  { type: 'extended', label: 'Extended',     majorPattern: '1|3|5|7|9',   minorPattern: '1|♭3|5|♭7|9'  },
  { type: 'added',    label: 'Added Tone',   majorPattern: '1|3|5|9',     minorPattern: '1|♭3|5|9'      },
  { type: 'altered',  label: 'Altered',      majorPattern: '1|3|5|♭7|♭9'                                },
];

@Component({
  tag: 'chords-section'
})
export class ChordsSection {

  @State() selectedKey: string;
  @State() selectedKeyAlteration: 'natural' | 'flat' | 'sharp';
  @State() selectedScale: Scale;
  @State() chordGroups: ChordGroup[] = [];
  @State() chordRows: { type: ChordType; label: string; chords: Chord[] }[] = [];
  @State() activeChordTypes: ChordType[] = [...DEFAULT_TYPES];
  @State() isCollapsed: boolean;

  async componentWillLoad() {
    this.selectedKey = App.state.currentKey;
    this.selectedKeyAlteration = App.state.currentKeyAlteration;
    this.selectedScale = App.state.currentScale;
    await this.updateChords();
  }

  @Listen('keyChanged', { target: 'body' })
  async handleKeyChanged(event: any) {
    this.selectedKey = event.detail.key;
    await this.updateChords();
  }

  @Listen('keyAlterationChanged', { target: 'body' })
  async handleKeyAlterationChanged(event: any) {
    this.selectedKeyAlteration = event.detail.keyAlteration;
    await this.updateChords();
  }

  @Listen('scaleChanged', { target: 'body' })
  async handleScaleChanged(event: any) {
    this.selectedScale = event.detail.scale;
    await this.updateChords();
  }

  async updateChords() {
    if (!this.selectedKey || !this.selectedScale) { return; }

    this.chordGroups = await TheoryService.generateKeyChordGroups(
      this.selectedKey,
      await TheoryService.getNoteAlterationSymbol(this.selectedKeyAlteration),
      this.selectedScale.intervalPattern
    );

    this.buildChordRows();
  }

  buildChordRows() {
    const chordPattern = this.selectedScale?.chordPattern;
    if (!chordPattern?.length || !this.chordGroups.length) {
      this.chordRows = [];
      return;
    }

    this.chordRows = TYPE_CONFIG
      .filter(config => this.activeChordTypes.includes(config.type))
      .map(config => {
        const chords: Chord[] = [];

        for (let i = 0; i < chordPattern.length; i++) {
          const num = chordPattern[i];
          const groupChords = this.chordGroups[i]?.chords ?? [];

          const isMajor = ['I','II','III','IV','V','VI','VII'].includes(num);
          const isMinor = ['i','ii','iii','iv','v','vi','vii'].includes(num);
          const isDim   = num.includes('°');
          const isAug   = num.includes('+');

          let pattern: string | undefined;
          if (isMajor)      pattern = config.majorPattern;
          else if (isMinor) pattern = config.minorPattern;
          else if (isDim)   pattern = config.dimPattern;
          else if (isAug)   pattern = config.augPattern;

          if (!pattern) { continue; }

          const chord = groupChords.find(c => c.intervalPattern === pattern);
          if (chord) {
            chords.push({ ...chord, number: config.type === 'triad' ? num : undefined });
          }
        }

        return { type: config.type, label: config.label, chords };
      });
  }

  toggleChordType(type: ChordType) {
    this.activeChordTypes = this.activeChordTypes.includes(type)
      ? this.activeChordTypes.filter(t => t !== type)
      : [...this.activeChordTypes, type];
    this.buildChordRows();
  }

  resetChordTypes() {
    this.activeChordTypes = [...DEFAULT_TYPES];
    this.buildChordRows();
  }

  handleSectionHeaderClicked() {
    this.isCollapsed = !this.isCollapsed;
  }

  render() {
    return [
      <div style={{ backgroundColor: 'rgba(var(--ion-color-tertiary-rgb),.1)',
                    margin: '40px 16px 16px 40px' }}
           onClick={() => this.handleSectionHeaderClicked()}>
        <h1 style={{ color: 'var(--ion-color-tertiary)',
                     transform: this.isCollapsed ? 'none' : 'translate(-8px, -20px)' }}>
          CHORDS
        </h1>
      </div>,

      !this.isCollapsed && <div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',
                      flexWrap: 'wrap', gap: '6px', margin: '0 44px 4px' }}>
          {TYPE_CONFIG.map(config =>
            <ion-button size='small'
                        fill={this.activeChordTypes.includes(config.type) ? 'solid' : 'outline'}
                        color='tertiary'
                        onClick={() => this.toggleChordType(config.type)}>
              {config.label}
            </ion-button>
          )}
          <ion-button size='small' fill='clear' color='medium'
                      onClick={() => this.resetChordTypes()}>
            Reset
          </ion-button>
        </div>

        {this.chordRows.map(row => [
          row.type !== 'triad' &&
            <div style={{ color: 'var(--ion-color-medium)', fontSize: '.75em',
                          margin: '12px 44px 0' }}>
              {row.label}
            </div>,
          <div style={{ display: 'flex', flexDirection: 'row',
                        margin: '8px 44px',
                        paddingBottom: '8px',
                        overflowX: 'scroll' }}>
            {row.chords.map(chord =>
              <chord-box chordNumber={chord.number}
                         chordName={chord.name}
                         chordNotes={chord.notes} />
            )}
          </div>
        ])}
      </div>
    ];
  }
}
