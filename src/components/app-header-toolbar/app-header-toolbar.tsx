import { Component, h, Event, EventEmitter, Prop } from "@stencil/core";
import { RouterService } from "../../services/router";

@Component({
  tag: 'app-header-toolbar'
})
export class AppHeaderToolbar {

  @Event() closeClicked: EventEmitter;

  @Prop() headerTitle: string;
  @Prop() showMenu: boolean = true;
  @Prop() showClose: boolean;
  @Prop() showBack: boolean;
  @Prop() backCallback: Function;

  toggleMenu() {

    const splitPane = document.querySelector('ion-split-pane') as HTMLIonSplitPaneElement;
    const windowWidth = window.innerWidth;
    const splitPaneShownAt = 992;
    const when = `(min-width: ${splitPaneShownAt}px)`;

    if (windowWidth >= splitPaneShownAt) {
      // split pane view is visible
      const open = splitPane.when === when;
      splitPane.when = open ? false : when;
    } 
    else {
      // split pane view is not visible
      // toggle menu open
      const menu = splitPane.querySelector('ion-menu');
      return menu.open();
    }
  }

  async handleCloseClicked() {

    this.closeClicked.emit();
  }

  async handleBackClicked() {

    if (this.backCallback) {

      await this.backCallback();
    }
    else {

      await RouterService.back();
    }
  }

  render() {
    return [
      <ion-toolbar color='tertiary'>
        {(this.showMenu || this.showBack || this.showClose) &&
          <ion-buttons slot='start'>
            {this.showMenu &&
              <ion-button onClick={()=>this.toggleMenu()}>
                <ion-icon name="menu" slot="icon-only" />
              </ion-button>
            }
            {this.showClose &&
              <ion-button onClick={()=>this.handleCloseClicked()}>
                <ion-icon slot='icon-only' name='close' />
              </ion-button>
            }
            {this.showBack &&
              <ion-button onClick={()=>this.handleBackClicked()}>
                <ion-icon slot='icon-only' name='arrow-back' />
              </ion-button>
            }
          </ion-buttons>
        }
        <ion-title slot='start' style={{ paddingLeft: '12px' }}>
          {this.headerTitle}
        </ion-title>
        <slot slot='end' name='end' />
      </ion-toolbar>
    ]
  }
}