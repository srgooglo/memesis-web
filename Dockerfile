FROM node:16-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

USER node
EXPOSE 9001

COPY package.json ./
COPY --chown=node:node . .

RUN chmod -R 777 /home/node/app && npm install

CMD [ "node", "app.js", "9004"]