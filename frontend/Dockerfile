FROM node:16-alpine

EXPOSE 4000

COPY . /app
WORKDIR /app

RUN corepack enable
RUN yarn install && yarn build
CMD ["yarn", "start"]