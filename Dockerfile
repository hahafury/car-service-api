FROM node:hydrogen-alpine AS builder
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm ci && npm run build

FROM node:hydrogen-alpine
COPY --from=builder /usr/src/app/dist /usr/src/app
COPY package*.json /usr/src/app
WORKDIR /usr/src/app
RUN npm ci --omit=dev
EXPOSE 5000
ENTRYPOINT ["node", "src/main.js"]
