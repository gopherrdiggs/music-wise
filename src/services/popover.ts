import { popoverController, PopoverOptions } from "@ionic/core";

class PopoverController {

  async create(options: PopoverOptions) {

    return popoverController.create(options);
  }

  async dismiss(data?: any, role?: string | undefined) {
    
    return popoverController.dismiss(data, role);
  }

  async showMenu(event: any, menu: HTMLElement, width: 'auto' | 'medium' | 'large' = 'auto') {

    const popover = await this.create({
      component: 'popover-menu',
      componentProps: {
        content: menu
      },
      event: event,
      showBackdrop: false,
      cssClass: `popover-wrapper-${width}`
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
      cssClass: 'custom-scrollbar no-padding'
    });

    await popover.present();
  }
}

export const PopoverService = new PopoverController();