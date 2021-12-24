import { Component, h, Event, EventEmitter, State } from "@stencil/core";

@Component({
  tag: 'notes-section'
})
export class NotesSection {

  @Event() scaleNotesChanged: EventEmitter;

  @State() isCollapsed: boolean;

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
          NOTES
        </h1>
      </div>,
      !this.isCollapsed &&
      <div style={{ display: 'flex', flexDirection: 'row', 
                    margin: '16px 44px', 
                    paddingBottom: '20px',
                    overflowX: 'scroll' }}>
        <note-box keyNoteIndex={0} />
        <note-box keyNoteIndex={1} />
        <note-box keyNoteIndex={2} />
        <note-box keyNoteIndex={3} />
        <note-box keyNoteIndex={4} />
        <note-box keyNoteIndex={5} />
        <note-box keyNoteIndex={6} />
        <note-box keyNoteIndex={7} />
        <note-box keyNoteIndex={8} />
        <note-box keyNoteIndex={9} />
        <note-box keyNoteIndex={10} />
        <note-box keyNoteIndex={11} />
        <note-box keyNoteIndex={12} />
        <note-box keyNoteIndex={13} />
        <note-box keyNoteIndex={14} />
        <note-box keyNoteIndex={15} />
        <note-box keyNoteIndex={16} />
        <note-box keyNoteIndex={17} />
        <note-box keyNoteIndex={18} />
        <note-box keyNoteIndex={19} />
        <note-box keyNoteIndex={20} />
        <note-box keyNoteIndex={21} />
        <note-box keyNoteIndex={22} />
        <note-box keyNoteIndex={23} />
      </div>
    ]
  }
}