# Spotlight Gulp Tool

## Getting Started

First you need to ensure you have the correct dependencies installed
locally.

The core dependencies for Spotlight are:

- Node & NPM
- Gulp

If you haven't installed Gulp already then please follow the [getting started instructions](https://gulpjs.com/docs/en/getting-started/quick-start) on the Gulp website.

**Please note that we are using Gulp 4 for Spotlight.**

These are the commands currently available with this version of the Spotlight tool:

- `compileViews`: This command is to be used to complile the nunjucks templates to plain html.
- `server`: This command is used to start up a simple local web server for development.
- `assets`: This command is used to compile all of the assets (styles, scripts and eventually images).
- `local`: This command executes all of the above in parallel so that you can work on the project locally.
- `default` The default command is what should be executed on a CI server to generate production ready code.

### So, when you are ready run `gulp local` and start building something awesome!