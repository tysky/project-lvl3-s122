# web-page-loader
[![Code Climate](https://codeclimate.com/github/tysky/project-lvl3-s122/badges/gpa.svg)](https://codeclimate.com/github/tysky/project-lvl3-s122)
[![Test Coverage](https://codeclimate.com/github/tysky/project-lvl3-s122/badges/coverage.svg)](https://codeclimate.com/github/tysky/project-lvl3-s122/coverage)
[![Issue Count](https://codeclimate.com/github/tysky/project-lvl3-s122/badges/issue_count.svg)](https://codeclimate.com/github/tysky/project-lvl3-s122)
[![Build Status](https://travis-ci.org/tysky/project-lvl3-s122.svg?branch=master)](https://travis-ci.org/tysky/project-lvl3-s122)

Utility for async downloading web pages.

## Installation
* `npm install web-page-loader`

## Usage
* `page-loader --output [output directory] <url>`

## Example of use
```
$ page-loader --output /var/tmp https://hexlet.io/courses

✔ https://ru.hexlet.io/lessons.rss
✔ https://ru.hexlet.io/assets/application.css
✔ https://ru.hexlet.io/assets/favicon.ico
✔ https://ru.hexlet.io/assets/favicon-196x196.png
✔ https://ru.hexlet.io/assets/favicon-96x96.png
✔ https://ru.hexlet.io/assets/favicon-32x32.png
✔ https://ru.hexlet.io/assets/favicon-16x16.png
✔ https://ru.hexlet.io/assets/favicon-128.png

Page was downloaded as 'ru-hexlet-io-courses.html'
```
