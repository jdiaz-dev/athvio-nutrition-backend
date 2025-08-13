
rm -rf dist
npx swc src -d dist --config-file .swcrc
npx swc configuration -d dist --config-file .swcrc
dotenvx run -f .env.development -- npx nest start --watch -b swc --type-check

# dotenvx run -f .env.development -- node dist/src/main.js