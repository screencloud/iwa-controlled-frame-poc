# IWA Controlled Frame POC

## Starting Guide

1. Install Chrome Dev for macos
2. pnpm i
3. Run any commands

To start `js-crasher`

```bash
pnpm start:crasher
```

To start `controlled-frame-wrapper`

```bash
pnpm start:wrapper
```

To start `controlled-frame-wrapper` with Chrome Dev

```bash
pnpm start:wrapper:with-chrome
```

### js-crasher

A project that can crash or unresponsive itself

### controlled-frame-wrapper

An IWA wrapper for any site including js-crasher

With `controlled-frame-wrapper` can detect and resurrect `js-crasher` when crashed or unresponsive

#### Notes

```bash
Chrome Dev should have this flag, otherwise IWA won't run
```

![Chrome DEV](/chrome.png)
