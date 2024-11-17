FROM node:18-alpine

RUN apk update && apk add tzdata && apk add bash
RUN apk update && apk upgrade --no-cache libcrypto3 libssl3 busybox-binsh busybox

# Create app directory
WORKDIR /
#RUN chown -R node:node /usr/src/app
#USER node

# Config port
ENV PORT 57343
EXPOSE 57343

# Install app dependencies
COPY package.json .
COPY package-lock.json .

RUN npm install --legacy-peer-deps --omit=dev

# Bundle app source
COPY . .

CMD [ "node", "dist/src/main.js" ]
