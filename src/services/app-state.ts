import { setDarkTheme } from "../helpers/utils";
import { Note, Scale } from "../interfaces/application";
import { LocalStorageService } from "./local-storage";
import { Log } from "./log";
import { Switchboard } from "./switchboard";

// Create object to represent app state here...
interface AppState {
  appVersion: string,
  darkThemeEnabled: boolean,
  showMenu: boolean,
  currentKey: string,
  currentKeyAlteration: string,
  currentScale: Scale,
  keyNotes: Note[],
  scaleNotes: Note[],
  guitarTuning: string[],
  viewportSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

// List out available action here...
export const enum Actions {
  appVersionChanged = 'appVersionChanged',
  darkThemeEnabledChanged = 'darkThemeEnabledChanged',
  showMenuChanged = 'showMenuChanged',
  keyChanged = 'keyChanged',
  keyAlterationChanged = 'keyAlterationChanged',
  keyNotesChanged = 'keyNotesChanged',
  scaleChanged = 'scaleChanged',
  scaleNotesChanged = 'scaleNotesChanged',
  guitarTuningChanged = 'guitarTuningChanged',
  viewportSizeChanged = 'viewportSizeChanged'
}

class AppStateController {

  localStorageKeySuffix: string = 'app-state';
  state = {} as AppState;

  async initialize() {

    try {

      const savedState = LocalStorageService.get(this.localStorageKeySuffix);

      if (savedState) {
        
        this.state = savedState;
      }
      await this.setDefaults();
    }
    catch (error) {

      Log.error(`Error getting initial app state: ${error.message}`);
    }
  }

  async setDefaults() {

    if (!this.state.guitarTuning) {

      this.state = {...this.state,
        guitarTuning: ['E','A','D','G','B','E']
      };
    }
  }

  async registerEventHandlers() {

    // Create media query for user color theme preference
    const userPrefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    // Set initial theme based on preference
    setDarkTheme(userPrefersDarkMode.matches);
    // Listen for changes to preference
    userPrefersDarkMode.addEventListener('change', mediaQuery => setDarkTheme(mediaQuery.matches));

    // Create media query for viewport size changes
    const extraSmallSize = window.matchMedia("(min-width: 1px) and (max-width: 319px)");
    const smallSize = window.matchMedia("(min-width: 320px) and (max-width: 511px)");
    const mediumSize = window.matchMedia("(min-width: 512px) and (max-width: 991px)");
    const largeSize = window.matchMedia("(min-width: 992px) and (max-width: 1199px)");
    const extraLargeSize = window.matchMedia("(min-width: 1200px) and (max-width: 9999px)");

    // Listen for changes to viewport size
    extraSmallSize.addEventListener('change', e=>this.handleViewportSizeChanged(e, 'xs'));
    smallSize.addEventListener('change', e=>this.handleViewportSizeChanged(e, 'sm'));
    mediumSize.addEventListener('change', e=>this.handleViewportSizeChanged(e, 'md'));
    largeSize.addEventListener('change', e=>this.handleViewportSizeChanged(e, 'lg'));
    extraLargeSize.addEventListener('change', e=>this.handleViewportSizeChanged(e, 'xl' ));

    Switchboard.routeEventToActionHandler(
      Actions.appVersionChanged, async (ev) => {
        await this.handleAppVersionChanged(ev);
      });

    Switchboard.routeEventToActionHandler(
      Actions.darkThemeEnabledChanged, async (ev) => {
        await this.handleDarkThemeEnabledChanged(ev);
      });

    Switchboard.routeEventToActionHandler(
      Actions.keyChanged, async (ev) => {
        await this.handleKeyChanged(ev);
      });

    Switchboard.routeEventToActionHandler(
      Actions.keyAlterationChanged, async (ev) => {
        await this.handleKeyAlterationChanged(ev);
      });

    Switchboard.routeEventToActionHandler(
      Actions.scaleChanged, async (ev) => {
        await this.handleScaleChanged(ev);
      });

    Switchboard.routeEventToActionHandler(
      Actions.keyNotesChanged, async (ev) => {
        await this.handleKeyNotesChanged(ev);
      });
  
    Switchboard.routeEventToActionHandler(
      Actions.scaleNotesChanged, async (ev) => {
        await this.handleScaleNotesChanged(ev);
      });

    Switchboard.routeEventToActionHandler(
      Actions.guitarTuningChanged, async (ev) => {
        await this.handleGuitarTuningChanged(ev);
      });
  }

  private async saveStateAndExecuteCallbacks(actionName: string) {

    LocalStorageService.set(this.localStorageKeySuffix, this.state);
    Switchboard.executeActionCallbacks(actionName);
  }

  private async handleAppVersionChanged(event: any) {

    this.state = {...this.state,
      appVersion: event.detail.appVersion
    };

    this.saveStateAndExecuteCallbacks(Actions.appVersionChanged);
  }

  private async handleDarkThemeEnabledChanged(event: any) {

    this.state = {...this.state,
      darkThemeEnabled: event.detail.enabled
    };

    this.saveStateAndExecuteCallbacks(Actions.darkThemeEnabledChanged);
  }

  private async handleKeyChanged(event: any) {

    this.state = {...this.state,
      currentKey: event.detail.key
    };

    this.saveStateAndExecuteCallbacks(Actions.keyChanged);
  }

  private async handleKeyAlterationChanged(event: any) {

    this.state = {...this.state,
      currentKeyAlteration: event.detail.keyAlteration
    };

    this.saveStateAndExecuteCallbacks(Actions.keyAlterationChanged);
  }

  private async handleScaleChanged(event: any) {

    this.state = {...this.state,
      currentScale: event.detail.scale
    };

    this.saveStateAndExecuteCallbacks(Actions.scaleChanged);
  }

  private async handleKeyNotesChanged(event: any) {

    this.state = {...this.state,
      keyNotes: event.detail.keyNotes
    };

    this.saveStateAndExecuteCallbacks(Actions.scaleChanged);
  }

  private async handleScaleNotesChanged(event: any) {

    this.state = {...this.state,
      scaleNotes: event.detail.scaleNotes
    };

    this.saveStateAndExecuteCallbacks(Actions.scaleChanged);
  }

  private async handleGuitarTuningChanged(event: any) {

    this.state = {...this.state,
      guitarTuning: event.detail.tuning
    };

    this.saveStateAndExecuteCallbacks(Actions.scaleChanged);
  }

  private async handleViewportSizeChanged(event: any, size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') {

    if (event.matches) {

      this.state = {...this.state,
        viewportSize: size
      };
  
      this.saveStateAndExecuteCallbacks(Actions.viewportSizeChanged);

      // Dispatch event to which other components can listen
      let appElem = document.querySelector('ion-app');
      appElem.dispatchEvent(new CustomEvent('viewportSizeChanged', {
        bubbles: true,
        detail: {
          viewportSize: size
        }
      }));
    }
  }
}

export const App = new AppStateController();