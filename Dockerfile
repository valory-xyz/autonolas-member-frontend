FROM node:lts-alpine as dependencies
RUN apk add --no-cache git
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --pure-lockfile

FROM node:lts-alpine as builder


WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn build

# Need some guidance on how to get this to run out of dev mode.
CMD ["yarn", "dev"]
