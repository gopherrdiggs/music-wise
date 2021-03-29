import { Component, h, Prop } from "@stencil/core";
import { ModalService } from "../../services/modal";

@Component({
  tag: 'modal-header-toolbar'
})
export class ModalHeaderToolbar {
  
  @Prop() headerTitle: string;
  @Prop() backCallback: Function;

  async handleBackClicked() {

    if (this.backCallback) {
      await this.backCallback();
    }
    else {
      await ModalService.dismiss();
    }
  }

  render() {
    return [
      <ion-toolbar color='tertiary'>
        <ion-buttons slot='start'>
          <ion-button onClick={()=>this.handleBackClicked()}>
            <ion-icon slot='icon-only' name='arrow-back' />
          </ion-button>
        </ion-buttons>
        <ion-title slot='start' style={{ paddingLeft: '12px' }}>
          {this.headerTitle}
        </ion-title>
        <slot slot='end' name='end' />
      </ion-toolbar>
    ]
  }
}