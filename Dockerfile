FROM node:12.18.0-buster-slim

RUN mkdir -p /payphones
WORKDIR /payphones
COPY . .

RUN npm install

RUN npm install -g .

RUN aus-payphones