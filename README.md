# reaction-cli

A command line tool for [Reaction Commerce](https://reactioncommerce.com)

[![bitHound Overall Score](https://www.bithound.io/github/reactioncommerce/reaction-cli/badges/score.svg)](https://www.bithound.io/github/reactioncommerce/reaction-cli)
[![bitHound Dependencies](https://www.bithound.io/github/reactioncommerce/reaction-cli/badges/dependencies.svg)](https://www.bithound.io/github/reactioncommerce/reaction-cli/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/reactioncommerce/reaction-cli/badges/devDependencies.svg)](https://www.bithound.io/github/reactioncommerce/reaction-cli/master/dependencies/npm)

[![CircleCI](https://circleci.com/gh/reactioncommerce/reaction-cli.svg?style=svg)](https://circleci.com/gh/reactioncommerce/reaction-cli)

## Install

Before you can use Reaction or `reaction-cli`, you'll need to make sure you [install the base requirements for your operating system](https://docs.reactioncommerce.com/reaction-docs/master/requirements).

After that, you can now install `reaction-cli` with...

```sh
npm install -g reaction-cli
# or
yarn global add reaction-cli
```

## Usage

```sh
$ reaction --help

  reaction <command> [options]

  Commands:
    init        Create a new Reaction app (will create a new folder)
    run         Start Reaction in development mode
    debug       Start Reaction in debug mode
    test [unit] Run integration or unit tests
    pull        Pull Reaction updates from Github and reinstall NPM packages
    update, up  Update Atmosphere and NPM packages
    plugins     Manage your Reaction plugins
    styles      Manage your Reaction styles (css, less, stylus, scss)
    reset       Reset the database and (optionally) delete build files
    build       Build a production Docker image

    [Managed Platform Commands]
    register    * Register an account with Reaction
    login       * Login to Reaction
    logout      * Logout of Reaction
    account     * Manage your Reaction Platform account
    apps        * Manage your app deployments
    deploy      * Deploy an app
    domains     * Add a custom domain name to a deployment
    env         * Manage environment variables for an app deployment
    keys        * Manage your SSH keys
    open        * Open an app deployment in your browser
    whoami      * Check which account you are logged in as

  Options:
    -v, --version  Show app and CLI version numbers
    -h, --help     Show reaction-cli help
```

Note: Commands marked with `*` require being logged into the managed platform. Learn more: https://reactioncommerce.com/features#get-a-demo

## Development

**Install**

```sh
git clone https://github.com/reactioncommerce/reaction-cli.git

cd reaction-cli

yarn
```

**Developing**

To start a live reloading watcher that recompiles the code on file changes:

```sh
yarn run watch
```

Keep in mind that if you previously installed `reaction-cli` from npm, you will need to uninstall it before that command will work.  This is because it runs `npm link` every time and that adds a symlink to the executable that goes in the same place as the npm install (which will throw an error).

## Tracking

This app reports anonymous, aggregate usage data to help us improve and debug Reaction Commerce. View our [Privacy Policy](https://reactioncommerce.com/legal/privacy).
