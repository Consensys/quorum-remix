![quorum](docs/images/quorum_logo.png "screenshot")

# Quorum Plugin for Remix

<a href="https://bit.ly/quorum-slack" target="_blank" rel="noopener"><img title="Quorum Slack" src="https://clh7rniov2.execute-api.us-east-1.amazonaws.com/Express/badge.svg" alt="Quorum Slack" /></a>

The Quorum plugin for Ethereum's Remix IDE adds support for creating and interacting with private contracts on a Quorum network.

![screenshot](docs/images/quorum-remix.png "screenshot")

## Getting Started

Just go to the [Remix IDE](https://remix.ethereum.org) and activate the **Quorum Network** plugin on the plugins page. For step-by-step instructions, go to the [Getting Started](docs/getting_started.md) doc.

## Common Issues
**Firefox CORS Issues:**
- Firefox seems to be a little more strict than Chrome at the moment about making cross-origin http requests on https pages. Remix currently loads our plugin in an iframe from an HTTPS url, but our users are frequently running their Quorum node on an HTTP localhost url. The latest Chrome release seems to allow these calls, but Firefox will block them and report a CORS error. We are tracking this issue in #8, but until that is fixed please use Chrome or another browser that doesn't block these requests. 

**Tessera Keys Endpoint:**
- To auto-populate the Private For field with all the public keys in the network, you need to provide the path to tessera's keys endpoint.
- For Tessera v10.1 and below, this is on the P2P API at /partyinfo
- For Tessera v10.2 and up, this is on the 3rd Party API at /partyinfo/keys
- For either of these to work, you will need to add a CORS config value to allow the plugin to make requests. [See here](http://docs.goquorum.com/en/latest/Privacy/Tessera/Configuration/Configuration%20Overview/#cors-server-sub-config) 

## Contributing
Quorum Plugin for Remix is built on open source and we invite you to contribute enhancements. Upon review you will be required to complete a Contributor License Agreement (CLA) before we are able to merge. If you have any questions about the contribution process, please feel free to send an email to [info@goquorum.com](mailto:info@goquorum.com).

## Development Setup

- Clone the repo and run:

```
yarn install
yarn start
```

- This will start the webpack development server and serve the plugin at http://localhost:3000
- Go to the [Remix IDE](https://remix.ethereum.org) or [Remix Alpha](https://remix-alpha.ethereum.org), click on the plugins icon, and click "Connect to a local plugin".
- Plugin Name and Display Name can be anything.
- Url is http://localhost:3000
- Location is **Side Panel**
- The smiley face icon on the left side is the quorum plugin’s tab
- The extension should automatically reload with any changes you make.

## Building

`yarn build` to run a production build of the plugin. The output is in the build/ directory.
