FROM node:15.2
WORKDIR /ponyta
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 10077
ENTRYPOINT [ "node" ]
CMD ["index.js"]