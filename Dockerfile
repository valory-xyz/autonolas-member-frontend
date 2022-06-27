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
# # ---- Base Node ----
# FROM node:16.14.0 AS base
# HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1
# EXPOSE 3000
# WORKDIR /app
# 
# 
# COPY package.json yarn.lock ./
# RUN yarn --pure-lockfile
# 
# COPY . .
# RUN yarn build
# CMD yarn start
# 
# FROM python:3.10-alpine
# COPY --from=base /build/site /site
# 
# WORKDIR /site
# CMD ["python3", "-m", "http.server"]
#  
