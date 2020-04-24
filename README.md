# ALMA 4 Code

This extension allows to retrieve learning material related to a selected piece of code from the ALMA repository.

Currently supported languages:
* Swift (5.2)

## Features

In a code editor window, select a piece of code you want to know more about (from a syntactical point of view speaking). Now, hit `Ctrl+Shift+A` (macOS: `⌘+Shift+A`). If a related concept could be found, your default browser will open and show related learning material in the ALMA repository.

![Demo](img/Demo.mp4)

## Installation

```bash
npm install
vsce package
code --install-extension alma4code-0.0.1.vsix
```

## Requirements

This extension relies on `swift-semantic`. Please install it from [this repository](https://ds-git.fstc.uni.lu/christian.grevisse/swift-semantic).
