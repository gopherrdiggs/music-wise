import { Component, h, Event, EventEmitter, State } from "@stencil/core";
import { Scale, ScaleGroup } from "../../interfaces/application";
import { App } from "../../services/app-state";
import { PopoverService } from "../../services/popover";
import { TheoryService } from "../../services/theory";

@Component({
  tag: 'key-scale-selector'
})
export class KeyScaleSelector {

  @Event() keyChanged: EventEmitter;
  @Event() keyAlterationChanged: EventEmitter;
  @Event() scaleChanged: EventEmitter;

  @State() scaleGroups: ScaleGroup[];
  @State() selectedKey: string;
  @State() isRootSharp: boolean;
  @State() isRootFlat: boolean;
  @State() selectedScale: Scale;

  async componentWillLoad() {

    this.scaleGroups = await TheoryService.getScaleGroups();
    this.selectedKey = App.state.currentKey;
    if (App.state.currentKeyAlteration != 'natural') {
      this.isRootSharp = App.state.currentKeyAlteration == 'sharp';
      this.isRootFlat = !this.isRootSharp;
    }
    this.selectedScale = App.state.currentScale;
  }

  async handleRootClicked(event: any) {

    let menu = <div style={{ padding: '8px' }}>
      <ion-content>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ flex: '1' }}>
            <ion-list>
              {
                ['A', 'B', 'C', 'D'].map(value =>
                  <ion-item button onClick={() => this.handleRootSelected(value)}>
                    {value}
                  </ion-item>
                )
              }
            </ion-list>
          </div>
          <div style={{ flex: '1' }}>
            <ion-list>
              {
                ['E', 'F', 'G'].map(value =>
                  <ion-item button onClick={() => this.handleRootSelected(value)}>
                    {value}
                  </ion-item>
                )
              }
            </ion-list>
          </div>
        </div>
      </ion-content>
    </div>;

    await PopoverService.showMenu(event, menu);
  }

  async handleRootSelected(note: string) {

    this.selectedKey = note;
    this.keyChanged.emit({
      key: note
    });
    await PopoverService.dismiss();
  }

  async handleSharpSelected() {

    this.isRootSharp = !this.isRootSharp;
    this.isRootFlat = false;
    this.keyAlterationChanged.emit({
      keyAlteration: this.isRootSharp ? 'sharp' : 'natural'
    });
  }

  async handleFlatSelected() {

    this.isRootFlat = !this.isRootFlat;
    this.isRootSharp = false;
    this.keyAlterationChanged.emit({
      keyAlteration: this.isRootFlat ? 'flat' : 'natural'
    });
  }

  async handleScaleClicked(event: any) {

    let menu = <div style={{ padding: '8px' }}>
      <ion-content>
        <ion-list>
          {this.scaleGroups.map((group) =>
            this.renderScaleGroupListSection(group)
          )}
        </ion-list>
      </ion-content>
    </div>;

    await PopoverService.showMenu(event, menu);
  }

  async handleScaleSelected(scale: Scale) {

    this.selectedScale = scale;
    this.scaleChanged.emit({
      scale: scale
    });
    await PopoverService.dismiss();
  }

  renderScaleGroupListSection(scaleGroup: ScaleGroup) {

    return [
      <ion-list-header style={{ color: 'gray' }}>
        {scaleGroup.name}
      </ion-list-header>,
      scaleGroup.scales.map(scale =>
        <ion-item button onClick={() => this.handleScaleSelected(scale)}>
          {scale.name}
        </ion-item>
      )
    ]
  }

  render() {
    return [
      <ion-grid>
        <ion-row>
          <ion-col sizeXs='12' sizeSm='4' sizeMd='4' sizeLg='3' sizeXl='3' >
            <div style={{
              display: 'flex', flexDirection: 'row',
              marginLeft: '26px', marginRight: '26px',
              alignItems: 'center', justifyContent: 'start'
            }}>
              <div style={{ minWidth: '80px', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  height: '30px', fontSize: '.8em',
                  color: 'var(--ion-color-medium)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'end'
                }}>
                  Key
                </div>
                <ion-item button detail={false} lines='none' 
                          style={{ border: '2px solid gray', borderRadius: '4px' }}
                          onClick={(e) => this.handleRootClicked(e)}>
                  <ion-input readonly value={this.selectedKey} />
                  <ion-icon slot='end' color='medium' style={{ width: '15px' }} name='caret-down' />
                </ion-item>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '30px' }}></div>
                <ion-item button detail={false} lines='none' 
                          style={{ '--min-height': '0',
                                    margin: '6px 0' }}>
                  <ion-label style={{ margin: '0 0 0 6px' }}>
                    Sharp
                  </ion-label>
                  <ion-checkbox slot="start" 
                                style={{ "--border-radius": '2px', 
                                         margin: '0' }}
                                onClick={() => this.handleSharpSelected()}
                                checked={this.isRootSharp} />
                </ion-item>
                <ion-item button detail={false} lines='none' 
                          style={{ '--min-height': '0',
                                    margin: '6px 0' }}>
                  <ion-label style={{ margin: '0 0 0 6px' }}>
                    Flat
                  </ion-label>
                  <ion-checkbox slot="start" 
                                style={{ "--border-radius": '2px', 
                                         margin: '0' }}
                                onClick={() => this.handleFlatSelected()}
                                checked={this.isRootFlat} />
                </ion-item>
              </div>
            </div>

          </ion-col>
          <ion-col>
            <div style={{ marginLeft: '28px', marginRight: '8px', minWidth: '150px' }}>
              <div style={{
                height: '30px', fontSize: '.8em',
                color: 'var(--ion-color-medium)',
                display: 'flex', flexDirection: 'column', justifyContent: 'end'
              }}>
                Scale
              </div>
              <ion-item button detail={false} lines='none' style={{ border: '2px solid gray', borderRadius: '4px', maxWidth: '500px' }}
                onClick={(e) => this.handleScaleClicked(e)}>
                <ion-input readonly value={this.selectedScale ? this.selectedScale.name : null} placeholder='Select' />
                <ion-icon slot='end' color='medium' style={{ width: '15px' }} name='caret-down' />
              </ion-item>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    ]
  }
}