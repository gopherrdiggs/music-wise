class RouterController {

  async setRoot(url: string) {
    const router = document.querySelector('ion-router');
    await router.push(url, 'root');
  }

  async forwardTo(url: string) {
    const router = document.querySelector('ion-router');
    await router.push(url, 'forward');
  }
  
  async backTo(url: string) {
    const router = document.querySelector('ion-router');
    await router.push(url, 'back');
  }

  async back() {
    const router = document.querySelector('ion-router');
    await router.back();
  }
  
  async addAdHocRoute(url: string, component: string, componentProps: any) {
    const router = document.querySelector('ion-router');
    let adHocRoute = document.createElement('ion-route');
    adHocRoute.url = url;
    adHocRoute.component = component;
    adHocRoute.componentProps = componentProps;
    router.appendChild(adHocRoute);
  }

  async setRootComponent(url: string, component: string, componentProps: any) {
    await this.addAdHocRoute(url, component, componentProps);
    await this.setRoot(url);
  }

  async forwardToComponent(url: string, component: string, componentProps: any) {
    await this.addAdHocRoute(url, component, componentProps);
    await this.forwardTo(url);
  }

  async backToComponent(url: string, component: string, componentProps: any) {
    await this.addAdHocRoute(url, component, componentProps);
    await this.backTo(url);
  }

  async checkError(error: any) {

    try {

      let errorString = error as string;
      if (errorString.includes('401') || errorString.includes('403')) {

        let appElem = document.querySelector('ion-app');
        appElem.dispatchEvent(
          new CustomEvent('userAuthChanged', {
            bubbles: true,
            detail: {
              user: null
          }}));
        RouterService.setRoot('/');
      }
    }
    catch (error) {}
  }
}

export const RouterService = new RouterController();