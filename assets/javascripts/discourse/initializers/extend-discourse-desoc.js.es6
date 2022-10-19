import { withPluginApi } from "discourse/lib/plugin-api";

function initWithApi(api) {
  console.log('init with api', api);
  window.withWeb3 = function () {
    if (window.ethereum) {
      return window.ethereum
        .enable()
        .then(() => {
          return window.ethereum;
        })
        .catch((error) => {
          console.log("User denied account access...", error);
          throw error;
        });
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying Metamask!"
      );
      return Promise.reject("No web3 detected");
    }
  };
}

export default {
  name: "extend-discourse-desoc",
  initialize() {
    // alert("alert boxes are annoying!");
    console.log("debug plugin");
    withPluginApi("0.1", initWithApi);
  },
};
