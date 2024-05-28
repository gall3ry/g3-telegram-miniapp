# FROM node:20-slim AS base
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# COPY . /app 
# WORKDIR /app/apps/my-node-app

# RUN apt-get update \
#     && apt-get install --assume-yes --no-install-recommends --quiet \
#     python3 \
#     python3-pip \
#     make \
#     build-essential \
#     && apt-get clean all

# FROM base AS prod-deps
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# FROM base AS build
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm run build

# FROM base
# COPY --from=prod-deps /app/node_modules /app/node_modules
# COPY --from=build /app/apps/my-node-app/dist /app/dist
# EXPOSE 8000

# # change directory
# FROM prod-deps
# WORKDIR /app
# # CMD [ "pnpm", "start" ]
# # CMD [ "tail ", "dist/main.js" ]

# # make it stops so I can use terminal to access it

FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

RUN pnpm deploy --filter=my-node-app --prod /prod/my-node-app
RUN pnpm deploy --filter=worker --prod /prod/worker

FROM base AS my-node-app
COPY --from=build /prod/my-node-app /prod/my-node-app
WORKDIR /prod/my-node-app
# CMD [ "pnpm", "start" ]
CMD ["tail", "-f", "/dev/null"]

FROM base AS worker
COPY --from=build /prod/worker /prod/worker
WORKDIR /prod/worker
EXPOSE 8001
CMD [ "pnpm", "start" ]