# Discourse Desoc Badges

**Discourse plugin to display badges for Desoc SBT recipient or members**

For more information, please see: [Form discussion](https://sbt.desci.com/t/to-view-sbts-click-on-user-avatars/16)
### Installation

Follow the [plugin installation guide](https://meta.discourse.org/t/install-a-plugin/19157).

### Prerequisites
Install the [discourse-siwe-auth](https://github.com/spruceid/discourse-siwe-auth) to enable sign-in-with-ethereum on the 
### Desoc Badges

<!-- Assign badges to your users based on GitHub contributions. -->
Assign badges to your users by issuing attestations on the [Desoc SBT manager app](https://soulbound-git-dev-de-sci-labs.vercel.app/)

#### How to use:
- ##### Enable plugin

  1. Enable `desoc badges enabled` in Settings -> Plugins.
- ##### Configure plugin
  🚫 - Do not change
  ✅ - Optional
  ⚠️ - Required

  1. <b>desoc ipfs gateway ⚠️ :</b> This is the ipfs gateway used for resolving metadata and images on ipfs
  2. <b>desoc app url 🚫 :</b> This is the Desoc manager app url
  3. <b>desoc factory contract 🚫:</b> This is the contract address of the deployed
  4. <b>desoc contracts ✅ :</b> List of Desoc contracts to only display their badges. Limit the scope of badges displayed to the contracts provided (used as a censor to prevent display spam badges)
  5. <b>desoc chain ID 🚫 :</b> This is used to specify what chain the contracts are deployed on.
  5. <b>desoc json rpc ⚠️ :</b> The node rpc url to query blockchain events from.
  5. <b>desoc mainnet rpc ⚠️ :</b> Add an ethereum mainnet rpc url (used to resolve ens names)

