#!/bin/sh
set -x #echo on
git add *
git commit -m "heroku"
git push heroku master
