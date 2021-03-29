interface ActionCallbackRegistration {
  callback: Function,
  actionName: string,
  elementId: string
}

class SwitchboardController {

  rootElement: HTMLElement;

  // State Actions => Element Methods
  actionCallbackRegistry: ActionCallbackRegistration[] = [];

  setRootElement(rootElement: HTMLElement) {

    this.rootElement = rootElement;
  }

  routeActionToElementCallback(elementId: string, actionName: string, callback: Function) {
    
    let existingRegistration = this.actionCallbackRegistry.find(r => {
      return r.actionName == actionName && r.elementId == elementId;
    });

    if (existingRegistration) { return; }

    this.actionCallbackRegistry.push({
      callback: callback,
      actionName: actionName,
      elementId: elementId
    });
  }

  routeActionsToElementCallback(elementId: string, actionNames: string[], callback: Function) {

    if (!actionNames || actionNames.length == 0) { return; }

    actionNames.map(a => this.routeActionToElementCallback(elementId, a, callback));
  }

  removeCallbacksForElement(elementId: string) {

    this.actionCallbackRegistry = this.actionCallbackRegistry.filter(r => {
      return r.elementId != elementId;
    });
  }

  routeEventToActionHandler(eventName: string, actionHandler: Function) {

    this.rootElement.addEventListener(eventName, (event: any) => actionHandler(event));
  }

  routeEventsToActionHandler(eventNames: string[], actionHandler: Function) {

    eventNames.map(e => this.routeEventToActionHandler(e, actionHandler));
  }

  async executeActionCallbacks(actionName: string) {

    let actionCallbacks = this.actionCallbackRegistry.filter(r => {
      return r.actionName == actionName;
    });

    for (let cb of actionCallbacks) {
      await cb.callback();
    }
  }

  async observeDomChanges(switchboardConfig: object) {

    // Create mutation observer which supports app state management
    let observer = new MutationObserver(mutations => {
      mutations.forEach(async (mutation) => {

        if (mutation.type == 'childList') {

          await this.checkForNodeChange(mutation.addedNodes, async (addedNode) => {
        
            const nodeName = addedNode.nodeName.toLowerCase();
    
            if (switchboardConfig.hasOwnProperty(nodeName)) {

              switchboardConfig[nodeName](addedNode);
            }
          });
          await this.checkForNodeChange(mutation.removedNodes, async (removedNode) => {
        
            const nodeName = removedNode.nodeName.toLowerCase();
  
            if (switchboardConfig.hasOwnProperty(nodeName)) {
              
              this.removeCallbacksForElement(nodeName);
            }
          });
        }
      });
    });

    observer.observe(document, {
      childList: true,
      subtree: true
    });
  }

  private async checkForNodeChange(nodeList: NodeList, changeHandler: Function) {

    if (!nodeList) { return; }

    nodeList.forEach(async (node) => {

      await changeHandler(node);

      if (node.childNodes) {
        await this.checkForNodeChange(node.childNodes, changeHandler);
      }
    });
  }

}

export const Switchboard = new SwitchboardController();