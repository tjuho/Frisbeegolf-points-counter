#!/bin/sh
set -x #echo on
cd frontend
npm run build
cd ..
rm -rf ./backend/build
mv ./frontend/build ./backend/
cd backend
git add *
git commit -m "heroku"
git push heroku master
