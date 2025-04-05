FROM node:20-alpine

RUN apk update && apk add tzdata && apk add bash
RUN apk update && apk upgrade --no-cache libcrypto3 libssl3 busybox-binsh busybox

# Create app directory
WORKDIR /
#RUN chown -R node:node /usr/src/app
#USER node

# Config port
ENV PORT 56343
EXPOSE 56343

# Install app dependencies
COPY package.json .
COPY package-lock.json .

RUN npm install --legacy-peer-deps 

# Bundle app source
COPY . .

# Build the application
RUN npm run build

CMD ["npm", "run", "start:prod"]
