import { Component, h, Event, EventEmitter, Listen, State } from "@stencil/core";
import { Chord, ChordGroup, Note, Scale } from "../../interfaces/application";
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
  secDom: Chord | null;
  dia7th: Chord | null;
}

interface ProgressionRow {
  label: string;
  numerals: string;
  steps: ProgressionStep[];
  category: string;
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
  @State() featuredRow: ProgressionRow | null = null;
  @State() selectedProgressionLabel: string = 'Axis of Awesome';
  @State() activeCategory: string | null = null;
  @State() activeStepIdx: number | null = null;
  @State() activeAltKey: string | null = null;
  @State() isCollapsed: boolean;

  private activeChord: Chord | null = null;
  private allNotes: Note[] = [];

  async componentWillLoad() {
    this.selectedKey = App.state.currentKey;
    this.selectedKeyAlteration = App.state.currentKeyAlteration;
    this.selectedScale = App.state.currentScale;
    this.allNotes = await TheoryService.getNotes();
    await this.updateChords();
  }

  @Listen('keyChanged', { target: 'body' })
  async handleKeyChanged(event: any) {
    this.selectedKey = event.detail.key;
    this.resetActiveState();
    await this.updateChords();
  }

  @Listen('keyAlterationChanged', { target: 'body' })
  async handleKeyAlterationChanged(event: any) {
    this.selectedKeyAlteration = event.detail.keyAlteration;
    this.resetActiveState();
    await this.updateChords();
  }

  @Listen('scaleChanged', { target: 'body' })
  async handleScaleChanged(event: any) {
    this.selectedScale = event.detail.scale;
    this.resetActiveState();
    await this.updateChords();
  }

  resetActiveState() {
    if (this.activeChord !== null) {
      this.chordDeselected.emit({ notes: this.activeChord.notes });
      this.activeChord = null;
    }
    this.activeStepIdx = null;
    this.activeAltKey = null;
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

  private getNotePreferredName(noteIdx: number): string {
    const names = this.allNotes[noteIdx].name.split(' / ');
    if (this.selectedKeyAlteration === 'flat') {
      return names.find(n => n.length === 2 && n.endsWith('♭')) ?? names[0];
    }
    return names.find(n => !n.includes('♭') && !n.includes('♯♯') && !n.includes('♭♭')) ?? names[0];
  }

  private buildSecDom(nextChordRoot: string): Chord | null {
    if (!this.allNotes?.length || !nextChordRoot) return null;
    const nextRootIdx = this.allNotes.findIndex(n => n.name.split(' / ').includes(nextChordRoot));
    if (nextRootIdx < 0) return null;
    const domRootIdx = (nextRootIdx + 7) % 12;
    const domRootName = this.getNotePreferredName(domRootIdx);
    const notes: Note[] = [0, 4, 7, 10].map(offset => ({
      name: this.getNotePreferredName((domRootIdx + offset) % 12)
    }));
    return {
      id: `secdom-${domRootName}`,
      name: `${domRootName}7`,
      notes,
      intervalPattern: '1|3|5|♭7',
      chordType: 'seventh'
    };
  }

  private buildDia7th(degree: number): Chord | null {
    const groupChords = this.chordGroups[degree - 1]?.chords ?? [];
    return groupChords.find(c => c.intervalPattern.split('|').length === 4) ?? null;
  }

  private getDisplayChord(step: ProgressionStep, stepIdx: number): Chord | null {
    if (this.activeAltKey === `${stepIdx}-secdom`) return step.secDom;
    if (this.activeAltKey === `${stepIdx}-dia7th`) return step.dia7th;
    return step.chord;
  }

  buildProgressionRows() {
    const chordPattern = this.selectedScale?.chordPattern;
    if (!chordPattern?.length || !this.chordGroups.length) {
      this.progressionRows = [];
      this.featuredRow = null;
      return;
    }

    const allRows: ProgressionRow[] = [];

    for (const cat of PROGRESSION_LIBRARY) {
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
          const dia7th = this.buildDia7th(degree);
          return { numeral, chord, secDom: null, dia7th };
        });

        steps.forEach((step, i) => {
          if (i < steps.length - 1) {
            const nextRoot = steps[i + 1].chord?.notes[0]?.name;
            if (nextRoot) step.secDom = this.buildSecDom(nextRoot);
          }
        });

        const numerals = steps.map(s => s.numeral).join(' – ');
        allRows.push({ label: prog.label, numerals, steps, category: cat.category });
      }
    }

    // Carry over or reset featured row
    const featured = allRows.find(r => r.label === this.selectedProgressionLabel);
    if (featured) {
      this.featuredRow = featured;
    } else {
      const first = allRows[0] ?? null;
      this.featuredRow = first;
      this.selectedProgressionLabel = first?.label ?? '';
    }

    // Apply category filter + category headers for list
    const filtered = this.activeCategory
      ? allRows.filter(r => r.category === this.activeCategory)
      : allRows;

    const rows: ProgressionRow[] = [];
    let lastCategory: string | null = null;
    for (const row of filtered) {
      const r = { ...row };
      if (this.activeCategory === null && row.category !== lastCategory) {
        r.categoryHeader = row.category;
        lastCategory = row.category;
      }
      rows.push(r);
    }
    this.progressionRows = rows;
  }

  handleFeaturedStepClicked(stepIdx: number) {
    const step = this.featuredRow?.steps[stepIdx];
    if (!step?.chord) return;

    const displayChord = this.getDisplayChord(step, stepIdx);
    if (!displayChord) return;

    if (this.activeStepIdx === stepIdx) {
      this.chordDeselected.emit({ notes: displayChord.notes });
      this.activeStepIdx = null;
      this.activeChord = null;
      // activeAltKey intentionally preserved — swap persists after deselection
    } else {
      if (this.activeChord) this.chordDeselected.emit({ notes: this.activeChord.notes });
      this.activeStepIdx = stepIdx;
      this.activeChord = displayChord;
      // activeAltKey intentionally not cleared — respect chip selection
      this.chordSelected.emit({ chordName: displayChord.name, notes: displayChord.notes, color: 'primary' });
    }
  }

  handleAltChipClicked(stepIdx: number, altType: 'secdom' | 'dia7th') {
    const altKey = `${stepIdx}-${altType}`;

    // If this step is currently highlighted, deselect first to avoid stale notes
    if (this.activeStepIdx === stepIdx && this.activeChord) {
      this.chordDeselected.emit({ notes: this.activeChord.notes });
      this.activeStepIdx = null;
      this.activeChord = null;
    }

    // Toggle the chip — note highlighting requires a separate chord button click
    this.activeAltKey = this.activeAltKey === altKey ? null : altKey;
  }

  handleProgressionListClicked(row: ProgressionRow) {
    if (row.label === this.selectedProgressionLabel) return;
    if (this.activeChord !== null) {
      this.chordDeselected.emit({ notes: this.activeChord.notes });
      this.activeChord = null;
    }
    this.activeStepIdx = null;
    this.activeAltKey = null;
    this.selectedProgressionLabel = row.label;
    this.featuredRow = row;
  }

  handleSectionHeaderClicked() {
    this.isCollapsed = !this.isCollapsed;
  }

  setCategory(category: string | null) {
    if (this.activeChord !== null) {
      this.chordDeselected.emit({ notes: this.activeChord.notes });
      this.activeChord = null;
    }
    this.activeCategory = category;
    this.activeStepIdx = null;
    this.activeAltKey = null;
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

        {/* Featured progression */}
        {this.featuredRow && (
          <div style={{ margin: '0 44px 16px', padding: '12px',
                        backgroundColor: 'rgba(var(--ion-color-tertiary-rgb), .06)',
                        border: '1px solid rgba(var(--ion-color-tertiary-rgb), .2)',
                        borderRadius: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline',
                          gap: '8px', marginBottom: '10px' }}>
              <span style={{ color: 'var(--ion-color-dark)', fontWeight: 'bold', fontSize: '.85em' }}>
                {this.featuredRow.label}
              </span>
              <span style={{ color: 'var(--ion-color-medium)', fontSize: '.65em' }}>
                {this.featuredRow.numerals}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px',
                          overflowX: 'auto', paddingBottom: '4px' }}>
              {this.featuredRow.steps.map((step, stepIdx) => {
                if (!step.chord) return null;
                const isStepActive = this.activeStepIdx === stepIdx;
                const isSecDomActive = this.activeAltKey === `${stepIdx}-secdom`;
                const isDia7thActive = this.activeAltKey === `${stepIdx}-dia7th`;
                const displayChord = this.getDisplayChord(step, stepIdx);
                return (
                  <div style={{ minWidth: '80px', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', userSelect: 'none' }}>
                    <div style={{ color: 'var(--ion-color-medium)', fontSize: '.6em',
                                  height: '20px', display: 'flex', alignItems: 'center',
                                  justifyContent: 'center' }}>
                      {step.numeral}
                    </div>
                    <div class="ion-activatable"
                         style={{ backgroundColor: `var(--ion-color-${isStepActive ? 'primary' : 'light'})`,
                                  color: `var(--ion-color-${isStepActive ? 'primary' : 'light'}-contrast)`,
                                  border: '2px solid gray',
                                  height: '55px', width: '100%', position: 'relative', overflow: 'hidden',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  textAlign: 'center', fontSize: '.78em', borderRadius: '2px',
                                  padding: '4px', cursor: 'pointer', boxSizing: 'border-box' }}
                         onClick={() => this.handleFeaturedStepClicked(stepIdx)}>
                      {displayChord?.name}
                      <ion-ripple-effect />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '3px',
                                  marginTop: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {step.secDom && (
                        <span style={{ fontSize: '.55em', padding: '2px 5px', borderRadius: '4px',
                                       cursor: 'pointer', userSelect: 'none',
                                       backgroundColor: isSecDomActive ? 'var(--ion-color-primary)' : 'transparent',
                                       color: isSecDomActive ? 'var(--ion-color-primary-contrast)' : 'var(--ion-color-medium)',
                                       border: `1px solid ${isSecDomActive ? 'var(--ion-color-primary)' : 'var(--ion-color-medium-tint)'}` }}
                               onClick={(e) => { e.stopPropagation(); this.handleAltChipClicked(stepIdx, 'secdom'); }}>
                          {step.secDom.name} {'→'}
                        </span>
                      )}
                      {step.dia7th && (
                        <span style={{ fontSize: '.55em', padding: '2px 5px', borderRadius: '4px',
                                       cursor: 'pointer', userSelect: 'none',
                                       backgroundColor: isDia7thActive ? 'var(--ion-color-primary)' : 'transparent',
                                       color: isDia7thActive ? 'var(--ion-color-primary-contrast)' : 'var(--ion-color-medium)',
                                       border: `1px solid ${isDia7thActive ? 'var(--ion-color-primary)' : 'var(--ion-color-medium-tint)'}` }}
                               onClick={(e) => { e.stopPropagation(); this.handleAltChipClicked(stepIdx, 'dia7th'); }}>
                          {step.dia7th.name}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category filter buttons */}
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

        {/* Progression list */}
        {this.progressionRows.map((row) => [
          row.categoryHeader &&
            <div style={{ color: 'var(--ion-color-medium)', fontSize: '.75em', fontWeight: 'bold',
                          margin: '16px 44px 0' }}>
              {row.categoryHeader}
            </div>,

          <div style={{ margin: '2px 44px', padding: '6px 8px', borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: row.label === this.selectedProgressionLabel
                          ? 'rgba(var(--ion-color-tertiary-rgb), .15)' : 'transparent' }}
               onClick={() => this.handleProgressionListClicked(row)}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',
                          gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--ion-color-dark)', fontSize: '.8em', minWidth: '130px' }}>
                {row.label}
              </span>
              <span style={{ color: 'var(--ion-color-medium)', fontSize: '.65em', minWidth: '80px' }}>
                {row.numerals}
              </span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {row.steps.map(step => step.chord && (
                  <span style={{ fontSize: '.65em', padding: '1px 6px', borderRadius: '3px',
                                 border: '1px solid var(--ion-color-medium-tint)',
                                 color: 'var(--ion-color-dark)' }}>
                    {step.chord.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ])}

        <div style={{ height: '8px' }} />
      </div>
    ];
  }
}
