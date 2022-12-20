import Component from "@ember/component";
import loadScript from "discourse/lib/load-script";
import KeyValueStore from "discourse/lib/key-value-store";

const GetUserTokensQuery = `
    query getTokens($owner: String) {
  tokens(where: {owner: $owner}) {
    id
    tokenId
    owner {
      id
    }
    active
    issuedBy
    issuedAt
    revokedBy
    revokedAt
    society {
      id
      metadataUri
      transactionHash
    }
    attestation {
      id
      metadataUri
    }
  }
}
    `;
const config = {
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
};
async function fetchUserTokens(url, owner) {
  const params = { query: GetUserTokensQuery, variables: { owner } };

  const queryConfig = Object.assign(
    {},
    {
      ...config,
      body: JSON.stringify(params),
    }
  );
  const f = fetch(url, queryConfig)
    .then((res) => res.json())
    .then((res) => {
      if (!res.error && res.data) {
        return res;
      } else {
        return res.error;
      }
    });

  return f;
}

const keyValueStore = new KeyValueStore("");

const blockExplorers = {
  5: "https://goerli.etherscan.io/",
  1: "https://etherscan.io/",
};
export default class DesocBadges extends Component {
  tagName = "div";
  classNames = ["desoc-badges"];

  init() {
    super.init(...arguments);
    this.startUp();
  }

  getExplorerLink(hash) {
    const chainId = this.siteSettings.desoc_chain_id;
    return `${blockExplorers[chainId]}tx/${hash}`;
  }

  getSiweAccount() {
    const associated_accounts = this.model.associated_accounts;
    if (!associated_accounts) return null;
    const siwe_account = associated_accounts.find(
      (account) => account.name === "siwe"
    );
    return siwe_account;
  }

  renderCachedBadges(account) {
    const cached = keyValueStore.getObject(account);
    this.setProperties({ credentials: cached });

    if (!cached) return;
    if (cached && cached?.length > 0) this.setProperties({ loading: false });
  }

  async startUp() {
    this.setProperties({ loading: true });
    const siwe_account = this.getSiweAccount();
    this.desoc_user_key = `desoc-badges-${this.model.id}`;
    this.renderCachedBadges(this.desoc_user_key);

    if (!siwe_account)
      this.setProperties({ loading: false, credentials: null });

    const isAddress =
      siwe_account &&
      siwe_account.description.startsWith("0x") &&
      siwe_account.description.length === 42;

    await this.loadScripts();

    const { ethers } = window.ethers;
    this.ethers = ethers;

    const mainnetProvider = new ethers.providers.JsonRpcProvider(
      this.siteSettings.desoc_mainnet_json_rpc
    );

    this.account = siwe_account.description;

    try {
      if (!isAddress) {
        this.account = await mainnetProvider.resolveName(
          siwe_account.description
        );
      }
    } catch (e) {}

    if (!this.account) {
      this.setProperties({ loading: false });
      return;
    }

    this.desoc_key = `desoc-badges-${this.account}`;
    this.renderCachedBadges(this.desoc_key);

    this.queryDesocTokens();
  }

  async queryDesocTokens() {
    const { data } = await fetchUserTokens(
      this.siteSettings.desoc_subgraph_url || "",
      this.account
    );
    const tokens = data.tokens;
    if (!tokens || tokens.length === 0) this.setProperties({ loading: false });
    const validTokens = tokens.filter((t) => !!t.active);

    let credentials = await Promise.all(
      validTokens.map(this.parseDesocToken.bind(this))
    );
    credentials = credentials.filter(Boolean).flat();
    keyValueStore.setObject({ key: this.desoc_key, value: credentials });
    keyValueStore.setObject({ key: this.desoc_user_key, value: credentials });
    this.setProperties({ credentials: credentials });
    this.setProperties({ loading: false });
  }

  async parseDesocToken(token) {
    try {
      const orgMetadata = await this.queryIpfsURL(token.society.metadataUri);
      const metadata = await this.queryIpfsURL(token.attestation.metadataUri);
      if (!metadata) return null;
      let parts = metadata.image.split("/");
      return {
        tokenId: token.tokenId,
        attestation: {
          id: token.attestation.id,
          metadata: {
            ...metadata,
            image: `https://${parts[parts.length - 1]}.ipfs.w3s.link`,
          },
        },
        cid: token.attestation.metadataUri,
        txLink: this.getExplorerLink(token.society.transactionHash),
        desocLink: `${this.siteSettings.desoc_app_url}attestations/${token.attestation.id}?address=${token.society.id}`,

        society: { id: token.society.id, metadata: orgMetadata },
      };
    } catch (e) {
      console.log("Error: ", e);
      return null;
    }
  }

  async queryIpfsHash(cid) {
    try {
      const res = await fetch(this.resolveIpfsURL(cid));
      const data = res.json();
      return data;
    } catch (e) {
      return null;
    }
  }

  async queryIpfsURL(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data;
    } catch (e) {
      return null;
    }
  }

  async asyncMap(arr, predicate) {
    const results = await Promise.all(arr.map(predicate));
    return results;
  }
  async loadScripts() {
    return Promise.all([
      loadScript("/plugins/desoc-badges/javascripts/ethers-5.5.4.umd.min.js"),
    ]);
  }
}
