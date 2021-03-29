import { popoverController, PopoverOptions } from "@ionic/core";

class PopoverController {

  async create(options: PopoverOptions) {

    return popoverController.create(options);
  }

  async dismiss(data?: any, role?: string | undefined) {
    
    return popoverController.dismiss(data, role);
  }

  async showMenu(event: any, menu: HTMLElement) {

    const popover = await this.create({
      component: 'popover-menu',
      componentProps: {
        content: menu
      },
      event: event
    });

    await popover.present();
  }
  
  async showContent(event: any, content: HTMLElement) {

    const popover = await this.create({
      component: 'popover-menu',
      componentProps: {
        content: content
      },
      event: event,
      cssClass: 'popover-medium custom-scrollbar no-padding'
    });

    await popover.present();
  }
}

export const PopoverService = new PopoverController();