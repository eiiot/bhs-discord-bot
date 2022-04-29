#!/bin/bash
cd ~/bhs-discord-bot/ || exit
node --loader ts-node/esm --experimental-specifier-resolution=node ./index.ts