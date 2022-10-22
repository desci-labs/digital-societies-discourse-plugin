import Controller from "@ember/controller";
import { action, computed } from "@ember/object";
import ModalFunctionality from "discourse/mixins/modal-functionality";
import { bufferedProperty } from "discourse/mixins/buffered-content";


export default Controller.extend(
  ModalFunctionality,
  bufferedProperty("badge"),
  {
    onShow() {
      console.log("this", this.badge);
      this.setProperties({
        props: null,
      });
    },

    @computed
    get desocLink() {
      return `https://soulbound-tdlic3cws-de-sci-labs.vercel.app/orgs/attestations/${this.badge.type}?address=${this.badge.org}`;
    },
  }
);
