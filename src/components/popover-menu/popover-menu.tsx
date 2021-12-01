import { Component, Prop } from "@stencil/core";

@Component({
  tag: 'popover-menu'
})
export class PopoverMenu {

  @Prop() content: any;

  render() {
    return this.content;
  }
}