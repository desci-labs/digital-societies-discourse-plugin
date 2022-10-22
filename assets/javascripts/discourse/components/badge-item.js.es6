import Component from "@ember/component";
import showModal from "discourse/lib/show-modal";
import { action } from "@ember/object";

export default class DesocBadges extends Component {
  tagName = "div";
  classNames = ["badge-item"];

  init() {
    super.init(...arguments);
    console.log('badge item', this.badge);
  }

  @action
  showDetails() {
    showModal("login");
  }
}
