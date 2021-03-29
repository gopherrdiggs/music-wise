import { setDarkTheme } from "../helpers/utils";
import { LocalStorageService } from "./local-storage";
import { Log } from "./log";
import { Switchboard } from "./switchboard";

// Create object to represent app state here...
interface AppState {
  appVersion: string,
  darkThemeEnabled: boolean,
  showMenu: boolean,
  viewportSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

// List out available action here...
export const enum Actions {
  appVersionChanged = 'appVersionChanged',
  darkThemeEnabledChanged = 'darkThemeEnabledChanged',
  showMenuChanged = 'showMenuChanged',
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
    }
    catch (error) {

      Log.error(`Error getting initial app state: ${error.message}`);
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
  }

  async saveStateAndExecuteCallbacks(actionName: string) {

    LocalStorageService.set(this.localStorageKeySuffix, this.state);
    Switchboard.executeActionCallbacks(actionName);
  }

  async handleAppVersionChanged(event: any) {

    this.state = {...this.state,
      appVersion: event.detail.appVersion
    };

    this.saveStateAndExecuteCallbacks(Actions.appVersionChanged);
  }

  async handleDarkThemeEnabledChanged(event: any) {

    this.state = {...this.state,
      darkThemeEnabled: event.detail.enabled
    };

    this.saveStateAndExecuteCallbacks(Actions.darkThemeEnabledChanged);
  }

  async handleViewportSizeChanged(event: any, size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') {

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