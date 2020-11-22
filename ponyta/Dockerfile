FROM node:14.5-alpine
WORKDIR /ponyta
RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 10077
ENTRYPOINT [ "node" ]
CMD ["index.js"]