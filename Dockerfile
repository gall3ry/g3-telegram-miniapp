# FROM node:20-slim AS base
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable

# FROM base AS builder
# WORKDIR /app
# RUN pnpm install -g turbo
# COPY . .
# RUN turbo prune --scope=worker --docker
# # use tree to log all files
# RUN 

# # RUN pnpm build --filter my-node-app --filter worker

# # FROM base AS my-node-app
# # WORKDIR /app
# # COPY .gitignore .gitignore
# # COPY --from=builder /app/out/json/ .
# # COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# # RUN apt-get update \
# #     && apt-get install --assume-yes --no-install-recommends --quiet \
# #     python3 \
# #     python3-pip \
# #     make \
# #     build-essential \
# #     && apt-get clean all
# # RUN pnpm install --frozen-lockfile
# # COPY --from=builder /app/out/worker /app/out/worker
# # # CMD [ "pnpm", "start" ]
# # CMD ["tail", "-f", "/dev/null"]

# # FROM base AS worker
# # COPY --from=build /prod/worker /prod/worker
# # WORKDIR /prod/worker
# # EXPOSE 8001
# # CMD [ "pnpm", "start" ]

FROM node:20 as base
# Update apt-get and install the necessary libraries
# This is mainly so that the `canvas` package can be installed
# RUN apt-get update && \
#     apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

RUN apt-get update \
    && apt-get install --assume-yes --no-install-recommends --quiet \
    python3 \
    python3-pip \
    make \
    build-essential

FROM base AS builder
WORKDIR /app

ENV APP_NAME=worker

# This might be necessary when switching to alpine
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat

RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=${APP_NAME} --docker


FROM base as installer
WORKDIR /app
ENV APP_NAME=worker

RUN npm install -g pnpm
RUN npm install -g turbo

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN turbo run build --filter=${APP_NAME}...

FROM base AS runner
WORKDIR /app
ENV APP_NAME=worker


RUN npm install -g pnpm

# Don't run production as root
# RUN addgroup --system --gid 1001 expressjs
# RUN adduser --system --uid 1001 expressjs

# USER expressjs
COPY --from=installer /app .

# TODO: Maybe use the npm script?
# CMD pnpm --filter "${APP_NAME}" run start
# tail
CMD ["tail", "-f", "/dev/null"]
