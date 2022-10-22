import Component from "@ember/component";
import showModal from "discourse/lib/show-modal";
import { action } from "@ember/object";

export default class DesocBadges extends Component {
  tagName = "div";
  classNames = ["badge-item"];

  init() {
    super.init(...arguments);
  }

  @action
  showDetails() {
    const controller = showModal("show-badge", { badge: this.badge });
    controller.setProperties({
      badge: this.badge,
      props: this.badge,
    });
  }
}
