# BMAD 2.0

**A [Mnemosyne OS](https://github.com/yaka0007/Mnemosyne-Neural-OS) cartridge** — a guided, multi-step wizard that turns an idea into a structured project blueprint: **B**usiness · **M**apping · **A**rchitecture · **D**elivery.

It walks you through foundations, flow, architecture, and validation, then compiles your answers into a ready-to-use blueprint with generated documents and diagrams. Because it runs on the sovereign OS, it reads and writes your memory vaults and uses on-device inference — your project context stays yours.

Built with React, fully localized (EN · FR · ES), and MIT-licensed. Fork it, improve it, ship it back. 💚

## Install

From the **MnemoHub** store inside Mnemosyne OS, find **BMAD 2.0** and click *Get App*. The store installs this cartridge for you — no manual steps.

## Develop

```bash
npm install
npm run dev      # Vite dev server (loads the cartridge in dev mode)
npm run build    # produces dist/ — what the installed cartridge serves
```

The cartridge talks to the OS over the secure memory bridge (`src/sdk/mnemo-sdk.ts`).
See the [Bridge API](https://github.com/yaka0007/Mnemosyne-Neural-OS/blob/main/packages/sdk/docs/BRIDGE_API.md) and the [manifest reference](https://github.com/yaka0007/Mnemosyne-Neural-OS/blob/main/packages/sdk/docs/MANIFEST.md).

> **Note** — the committed `dist/` is what the store installs (the installer clones this repo, it does not build). After changing the source, run `npm run build` and commit the updated `dist/` so installed cartridges reflect your changes.

## Contributing

Issues and pull requests are welcome — this is the open, improvable flagship cartridge. Keep all UI strings localized (EN/FR/ES) and comments in English.

## License

[MIT](./LICENSE) © 2026 yaka0007
