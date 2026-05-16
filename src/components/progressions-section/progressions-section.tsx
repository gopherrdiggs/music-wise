import { Component, h, Event, EventEmitter, Listen, State } from "@stencil/core";
import { Chord, ChordGroup, Scale } from "../../interfaces/application";
import { App } from "../../services/app-state";
import { TheoryService } from "../../services/theory";

interface ProgressionTemplate {
  label: string;
  degrees: number[];
}

interface ProgressionCategory {
  category: string;
  progressions: ProgressionTemplate[];
}

interface ProgressionStep {
  numeral: string;
  chord: Chord | null;
}

interface ProgressionRow {
  label: string;
  numerals: string;
  steps: ProgressionStep[];
  categoryHeader?: string;
}

// Degree indices are 1-based scale positions. Chord quality is derived from the
// active scale's chordPattern at runtime — nothing is hardcoded per key or mode.
const PROGRESSION_LIBRARY: ProgressionCategory[] = [
  {
    category: 'Pop / Rock',
    progressions: [
      { label: 'Axis of Awesome',   degrees: [1,5,6,4] },
      { label: 'Classic',           degrees: [1,4,5,1] },
      { label: '50s (Doo-wop)',     degrees: [1,6,4,5] },
      { label: 'vi First',          degrees: [6,4,1,5] },
      { label: 'Ascending',         degrees: [1,3,4,5] },
    ]
  },
  {
    category: 'Jazz',
    progressions: [
      { label: 'ii – V – I',            degrees: [2,5,1]   },
      { label: 'Turnaround',            degrees: [1,6,2,5] },
      { label: 'Circle (iii–vi–ii–V)',  degrees: [3,6,2,5] },
      { label: 'IV Descent',            degrees: [1,4,3,6] },
    ]
  },
  {
    category: 'Blues (12-bar)',
    progressions: [
      { label: 'Bars 1–4',   degrees: [1,4,1,1] },
      { label: 'Bars 5–8',   degrees: [4,4,1,1] },
      { label: 'Bars 9–12',  degrees: [5,4,1,5] },
    ]
  },
  {
    category: 'Classical',
    progressions: [
      { label: 'Perfect Authentic',  degrees: [1,5,1]   },
      { label: 'Full Cadence',       degrees: [1,4,5,1] },
      { label: 'Plagal (Amen)',      degrees: [1,4,1]   },
      { label: 'Deceptive',          degrees: [1,5,6]   },
      { label: 'ii – V – I',        degrees: [1,2,5,1] },
    ]
  },
];

@Component({
  tag: 'progressions-section'
})
export class ProgressionsSection {

  @Event() chordSelected: EventEmitter;
  @Event() chordDeselected: EventEmitter;

  @State() selectedKey: string;
  @State() selectedKeyAlteration: 'natural' | 'flat' | 'sharp';
  @State() selectedScale: Scale;
  @State() chordGroups: ChordGroup[] = [];
  @State() progressionRows: ProgressionRow[] = [];
  @State() activeCategory: string | null = null;
  @State() activeStepKey: string | null = null;
  @State() isCollapsed: boolean;

  private activeChord: Chord | null = null;

  async componentWillLoad() {
    this.selectedKey = App.state.currentKey;
    this.selectedKeyAlteration = App.state.currentKeyAlteration;
    this.selectedScale = App.state.currentScale;
    await this.updateChords();
  }

  @Listen('keyChanged', { target: 'body' })
  async handleKeyChanged(event: any) {
    this.selectedKey = event.detail.key;
    this.activeStepKey = null;
    this.activeChord = null;
    await this.updateChords();
  }

  @Listen('keyAlterationChanged', { target: 'body' })
  async handleKeyAlterationChanged(event: any) {
    this.selectedKeyAlteration = event.detail.keyAlteration;
    this.activeStepKey = null;
    this.activeChord = null;
    await this.updateChords();
  }

  @Listen('scaleChanged', { target: 'body' })
  async handleScaleChanged(event: any) {
    this.selectedScale = event.detail.scale;
    this.activeStepKey = null;
    this.activeChord = null;
    await this.updateChords();
  }

  async updateChords() {
    if (!this.selectedKey || !this.selectedScale) return;

    this.chordGroups = await TheoryService.generateKeyChordGroups(
      this.selectedKey,
      await TheoryService.getNoteAlterationSymbol(this.selectedKeyAlteration),
      this.selectedScale.intervalPattern
    );

    this.buildProgressionRows();
  }

  buildProgressionRows() {
    const chordPattern = this.selectedScale?.chordPattern;
    if (!chordPattern?.length || !this.chordGroups.length) {
      this.progressionRows = [];
      return;
    }

    const filtered = this.activeCategory
      ? PROGRESSION_LIBRARY.filter(c => c.category === this.activeCategory)
      : PROGRESSION_LIBRARY;

    const rows: ProgressionRow[] = [];
    let lastCategory: string | null = null;

    for (const cat of filtered) {
      for (const prog of cat.progressions) {
        if (Math.max(...prog.degrees) > chordPattern.length) continue;

        const steps: ProgressionStep[] = prog.degrees.map(degree => {
          const idx = degree - 1;
          const numeral = chordPattern[idx];
          const groupChords = this.chordGroups[idx]?.chords ?? [];

          const isMajor = ['I','II','III','IV','V','VI','VII'].includes(numeral);
          const isMinor = ['i','ii','iii','iv','v','vi','vii'].includes(numeral);
          const isDim   = numeral?.includes('°');
          const isAug   = numeral?.includes('+');

          let pattern: string | undefined;
          if (isMajor)      pattern = '1|3|5';
          else if (isMinor) pattern = '1|♭3|5';
          else if (isDim)   pattern = '1|♭3|♭5';
          else if (isAug)   pattern = '1|3|♯5';

          const chord = pattern ? (groupChords.find(c => c.intervalPattern === pattern) ?? null) : null;
          return { numeral, chord };
        });

        const numerals = steps.map(s => s.numeral).join(' – ');
        const row: ProgressionRow = { label: prog.label, numerals, steps };

        if (this.activeCategory === null && cat.category !== lastCategory) {
          row.categoryHeader = cat.category;
          lastCategory = cat.category;
        }

        rows.push(row);
      }
    }

    this.progressionRows = rows;
  }

  handleStepClicked(rowIdx: number, stepIdx: number, chord: Chord) {
    const key = `${rowIdx}-${stepIdx}`;
    if (this.activeStepKey === key) {
      this.activeStepKey = null;
      this.activeChord = null;
      this.chordDeselected.emit({ chordName: chord.name, notes: chord.notes });
    } else {
      if (this.activeChord !== null) {
        this.chordDeselected.emit({ notes: this.activeChord.notes });
      }
      this.activeStepKey = key;
      this.activeChord = chord;
      this.chordSelected.emit({ chordName: chord.name, notes: chord.notes, color: 'primary' });
    }
  }

  handleSectionHeaderClicked() {
    this.isCollapsed = !this.isCollapsed;
  }

  setCategory(category: string | null) {
    if (this.activeChord !== null) {
      this.chordDeselected.emit({ notes: this.activeChord.notes });
    }
    this.activeCategory = category;
    this.activeStepKey = null;
    this.activeChord = null;
    this.buildProgressionRows();
  }

  render() {
    return [
      <div style={{ backgroundColor: 'rgba(var(--ion-color-tertiary-rgb),.1)',
                    margin: '40px 16px 16px 40px' }}
           onClick={() => this.handleSectionHeaderClicked()}>
        <h1 style={{ color: 'var(--ion-color-tertiary)',
                     transform: this.isCollapsed ? 'none' : 'translate(-8px, -20px)' }}>
          PROGRESSIONS
        </h1>
      </div>,

      !this.isCollapsed && <div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',
                      flexWrap: 'wrap', gap: '6px', margin: '0 44px 4px' }}>
          <ion-button size='small'
                      fill={this.activeCategory === null ? 'solid' : 'outline'}
                      color='tertiary'
                      onClick={(e) => { e.stopPropagation(); this.setCategory(null); }}>
            All
          </ion-button>
          {PROGRESSION_LIBRARY.map(cat =>
            <ion-button size='small'
                        fill={this.activeCategory === cat.category ? 'solid' : 'outline'}
                        color='tertiary'
                        onClick={(e) => { e.stopPropagation(); this.setCategory(cat.category); }}>
              {cat.category}
            </ion-button>
          )}
        </div>

        {!this.selectedScale?.chordPattern &&
          <div style={{ color: 'var(--ion-color-medium)', margin: '12px 44px', fontSize: '.9em' }}>
            Select a 7-tone scale to see chord progressions.
          </div>
        }

        {this.progressionRows.map((row, rowIdx) => [
          row.categoryHeader &&
            <div style={{ color: 'var(--ion-color-medium)', fontSize: '.75em', fontWeight: 'bold',
                          margin: '16px 44px 0' }}>
              {row.categoryHeader}
            </div>,

          <div style={{ margin: '6px 44px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline',
                          gap: '8px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--ion-color-dark)', fontSize: '.8em' }}>
                {row.label}
              </span>
              <span style={{ color: 'var(--ion-color-medium)', fontSize: '.65em' }}>
                {row.numerals}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '6px',
                          overflowX: 'auto', paddingBottom: '4px' }}>
              {row.steps.map((step, stepIdx) => {
                if (!step.chord) return null;
                const isActive = this.activeStepKey === `${rowIdx}-${stepIdx}`;
                return (
                  <div style={{ minWidth: '80px', display: 'flex', flexDirection: 'column',
                                cursor: 'pointer', userSelect: 'none' }}
                       onClick={(e) => { e.stopPropagation(); this.handleStepClicked(rowIdx, stepIdx, step.chord!); }}>
                    <div style={{ color: 'var(--ion-color-medium)', fontSize: '.6em', textAlign: 'center',
                                  height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {step.numeral}
                    </div>
                    <div class="ion-activatable"
                         style={{ backgroundColor: `var(--ion-color-${isActive ? 'primary' : 'light'})`,
                                  color: `var(--ion-color-${isActive ? 'primary' : 'light'}-contrast)`,
                                  border: '2px solid gray',
                                  height: '55px', position: 'relative', overflow: 'hidden',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  textAlign: 'center', fontSize: '.78em', borderRadius: '2px',
                                  padding: '4px' }}>
                      {step.chord.name}
                      <ion-ripple-effect />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ])}
      </div>
    ];
  }
}
