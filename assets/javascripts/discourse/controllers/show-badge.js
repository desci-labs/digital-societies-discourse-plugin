import Controller from "@ember/controller";
import { action, computed } from "@ember/object";
import ModalFunctionality from "discourse/mixins/modal-functionality";
import { bufferedProperty } from "discourse/mixins/buffered-content";


export default Controller.extend(
  ModalFunctionality,
  bufferedProperty("badge"),
  {
    badge: null,

    onShow() {
      this.setProperties({
        badge: null,
      });
    },

    onClose() {
      this.set("badge", null);
    },
  }
);
