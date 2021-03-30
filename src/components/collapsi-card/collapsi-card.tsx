import { Component, h, Prop, State } from "@stencil/core";

@Component({
  tag: 'collapsi-card'
})
export class CollapsiCard {

  @Prop() cardTitle: string;
  @Prop() collapsed: boolean;

  @State() isCollapsed: boolean;

  async componentWillLoad() {

    this.isCollapsed = this.collapsed;
  }

  render() {
    return [
      <ion-card>
        <ion-card-header onClick={()=>{this.isCollapsed = !this.isCollapsed}}>
          <ion-item lines={this.isCollapsed ? 'none': 'full'}>
            <ion-icon slot='start' color='medium' name={this.isCollapsed ? 'chevron-forward' : 'chevron-down'}></ion-icon>
            <div slot='end'>
              <slot name='header-start' />
            </div>
            <ion-label>{this.cardTitle}</ion-label>
            <div slot='end'>
              <slot name='header-end' />
            </div>
          </ion-item>
        </ion-card-header>
        <ion-card-content style={{ 'display': this.isCollapsed ? 'none' : 'block' }}>
          <slot />
        </ion-card-content>
      </ion-card>
    ];
  }
}