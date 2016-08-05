# reaction-cli

A command line tool for managing your [Reaction Commerce](https://reactioncommerce.com) commerce application.

[![bitHound Overall Score](https://www.bithound.io/github/reactioncommerce/reaction-cli/badges/score.svg)](https://www.bithound.io/github/reactioncommerce/reaction-cli)
[![bitHound Dependencies](https://www.bithound.io/github/reactioncommerce/reaction-cli/badges/dependencies.svg)](https://www.bithound.io/github/reactioncommerce/reaction-cli/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/reactioncommerce/reaction-cli/badges/devDependencies.svg)](https://www.bithound.io/github/reactioncommerce/reaction-cli/master/dependencies/npm)

[![CircleCI](https://circleci.com/gh/reactioncommerce/reaction-cli.svg?style=svg)](https://circleci.com/gh/reactioncommerce/reaction-cli)

## Install

```sh
npm install -g reaction-cli
```

## Usage

This tool is under heavy development. More usage docs coming soon.

```sh
$ reaction --help

  reaction <command> [options]

  Commands:
    init        Create a new Reaction app (will create a new folder)
    run         Start Reaction in development mode
    debug       Start Reaction in debug mode
    test [unit] Run integration or unit tests
    pull        Pull Reaction updates from Github and install NPM packages
    update,up   Update Atmosphere and NPM packages
    reset       Reset the database and (optionally) delete build files

  Options:
    -v, --version  Show app and CLI version numbers            
    -h, --help     Show help
```
