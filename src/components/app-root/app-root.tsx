import { Component, h, Element, Event, EventEmitter, State } from '@stencil/core';
import { setDarkTheme, styleScrollbar } from '../../helpers/utils';
import { App } from '../../services/app-state';
import { LocalStorageService } from '../../services/local-storage';
import { Switchboard } from '../../services/switchboard';
import { TheoryService } from '../../services/theory';

@Component({
  tag: 'app-root'
})
export class AppRoot {

  @Element() el;

  @Event() darkThemeEnabledChanged: EventEmitter;

  @State() showMenu: boolean;
  @State() viewportSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  @State() darkThemeEnabled: boolean;
  @State() appVersion: string = '';

  menuElem: HTMLIonMenuElement;

  async componentWillLoad() {

    await this.loadAppManifest();
    await this.loadAppSettings();
    await App.initialize();
    await Switchboard.observeDomChanges({});

    this.viewportSize = App.state.viewportSize;
    this.showMenu = App.state.showMenu;
    this.darkThemeEnabled = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  async componentDidLoad() {

    // Switchboard configuration for this root element
    Switchboard.setRootElement(this.el);
    await App.registerEventHandlers();
    await this.setAppStateDefaults();

    styleScrollbar(this.menuElem);
  }

  async loadAppManifest() {

    let manifestFile = await fetch('/manifest.json');
    let manifest = await manifestFile.json();
    this.appVersion = manifest['version'];
  }

  async loadAppSettings() {

    // Get application settings from config file
    const appSettingsFile = await fetch('/app-settings.json');
    const appSettingsJson = await appSettingsFile.json();
    LocalStorageService.setLocalStoragePrefix(appSettingsJson['localStoragePrefix']);
  }

  async setAppStateDefaults() {
    
    if (!App.state.currentKey
        || !App.state.currentKeyAlteration
        || !App.state.currentScale
        || !App.state.keyNotes) {
      this.el.dispatchEvent(new CustomEvent('keyChanged', { detail: { key: 'C' }}));
      this.el.dispatchEvent(new CustomEvent('keyAlterationChanged', { detail: { keyAlteration: 'natural' }}));
      let defaultScale = (await TheoryService.getScaleGroups())[0].scales[0];
      this.el.dispatchEvent(new CustomEvent('scaleChanged', { detail: { scale: defaultScale }}));
      let notes = await TheoryService.generateKeyNotes(
        'C', 'natural', defaultScale.intervalPattern
      );
      this.el.dispatchEvent(new CustomEvent('keyNotesChanged', { detail: notes }));
      this.el.dispatchEvent(new CustomEvent('scaleNotesChanged', { detail: notes.filter(n => n.isDiatonic).slice(0,7) }));
    } 
  }

  getShowMenu() {

    if (!this.showMenu) {
      return false;
    }
    else {
      return `lg`;
    }
  }

  handleDarkThemeChanged(enableDarkTheme: boolean) {
    this.darkThemeEnabled = enableDarkTheme;
    setDarkTheme(this.darkThemeEnabled);
    this.darkThemeEnabledChanged.emit({
      enabled: enableDarkTheme
    });
  }

  configureRoutes() {
    return [
      <ion-router useHash={false} >
        <ion-route-redirect from='/' to='/home' />
        <ion-route url="/home" component="app-home" />
      </ion-router>
    ]
  }

  render() {
    return (
      <ion-app>
        {this.configureRoutes()}
        <ion-split-pane when={this.getShowMenu()} contentId='menu' style={{ '--side-max-width': '200px' }}>
          <ion-menu contentId='menu' side='start' type='overlay' ref={(el) => this.menuElem = el}>
            <ion-header>
              <ion-toolbar color="tertiary">
                <ion-title>Music-Wise</ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content>
              <app-menu />
            </ion-content>
            <ion-footer>
              <ion-item>
                <ion-toggle slot='start' color='medium' checked={this.darkThemeEnabled}
                  onIonChange={(e) => this.handleDarkThemeChanged(e.detail.checked)} />
                <ion-label slot='start' color='medium'>Dark</ion-label>
                <div slot='end' style={{ color: 'var(--ion-color-medium)', fontSize: '0.8em' }}>
                  v{this.appVersion}
                </div>
              </ion-item>
            </ion-footer>
          </ion-menu>

          <ion-nav id='menu' animated={false} />

        </ion-split-pane>
      </ion-app>
    );
  }
}
