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

# FROM node:lts-alpine as runner
# 
# ARG APP=/app
# 
# ENV APP_USER=runner
# RUN addgroup -S $APP_USER \
#     && adduser -S $APP_USER -G $APP_USER \
#     && mkdir -p ${APP}
# 
# RUN chown -R $APP_USER:$APP_USER ${APP}
# 
# WORKDIR /app
# 
# COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

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
