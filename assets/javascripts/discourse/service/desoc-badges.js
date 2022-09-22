import Service, { inject as service } from "@ember/service";

export default class DesocBadgesService extends Service {
  @service presence;
  @service appEvents;

  init() {
    super.init(...arguments);
    console.log('desoc service');
  }

  get factoryContract() {
    return this.siteSettings.desoc_factory_contract;
  }

}
