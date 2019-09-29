# gplaybadge  [![CI Status](https://github.com/maxcanna/gplaybadge/workflows/CI/badge.svg)](https://github.com/maxcanna/gplaybadge/actions) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/maxcanna/gplaybadge/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/maxcanna/gplaybadge/?branch=master) [![](https://img.shields.io/github/license/maxcanna/gplaybadge.svg)](https://github.com/maxcanna/gplaybadge/blob/master/LICENSE)

Easily create a badge to promote your own android application in a single step. [Demo](http://gplay.ws).

## How do I get set up?

You've several way to get gplaybadge running:

* You can easily create an Heroku application:

  [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

* You can use now:

  [![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/maxcanna/gplaybadge&env=RAPIDAPI_KEY&env=UA)

* Or manually:

  * Install composer via ``` curl -sS https://getcomposer.org/installer | php ```
  * Install project dependencies via ```php composer.phar install```
  * Test locally via ``` php -S 0.0.0.0:3000 -t web/ ```
  * Deploy wherever you like

In either case remember to set these two env vars:
* `RAPIDAPI_KEY` to your [GPlay API key](https://api.gplay.ws/)
* `UA` to your [Google Analytics Tracking ID](https://support.google.com/analytics/answer/1032385)
