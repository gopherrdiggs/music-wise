import { alertController, AlertOptions } from "@ionic/core";

class AlertControlller {

  async create(options: AlertOptions) {

    return alertController.create(options);
  }
}

export const AlertService = new AlertControlller();