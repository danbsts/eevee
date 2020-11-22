FROM node:14.5-alpine
WORKDIR /gyarados
COPY package.json package-lock.json ./
RUN npm install
COPY test-data/. .
COPY . .
EXPOSE 10130
ENTRYPOINT [ "node" ]
CMD ["sender.js"]