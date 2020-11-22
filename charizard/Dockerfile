FROM node:14.5-alpine
WORKDIR /charizard
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENTRYPOINT [ "node" ]
CMD ["charizard.js"]
