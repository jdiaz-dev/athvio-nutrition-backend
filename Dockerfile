FROM node:18-alpine

RUN apk update && apk add tzdata && apk add bash
RUN apk update && apk upgrade --no-cache libcrypto3 libssl3 busybox-binsh busybox

RUN TZ=America/Argentina/Cordoba && cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && apk del tzdata

# Create app directory

WORKDIR /usr/src/app
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

CMD [ "npm", "run", "start:prod" ]
