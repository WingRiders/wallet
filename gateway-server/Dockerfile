FROM oven/bun:alpine AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
COPY common/package.json /temp/dev/common/package.json
COPY dapp-plugin/package.json /temp/dev/dapp-plugin/package.json
COPY example-app/package.json /temp/dev/example-app/package.json
COPY gateway/package.json /temp/dev/gateway/package.json
COPY gateway-server/package.json /temp/dev/gateway-server/package.json
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
COPY common/package.json /temp/prod/common/package.json
COPY dapp-plugin/package.json /temp/prod/dapp-plugin/package.json
COPY example-app/package.json /temp/prod/example-app/package.json
COPY gateway/package.json /temp/prod/gateway/package.json
COPY gateway-server/package.json /temp/prod/gateway-server/package.json
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY package.json package.json
COPY turbo.json turbo.json
COPY common common
COPY gateway gateway
COPY gateway-server gateway-server

ENV NODE_ENV=production
RUN bun test
RUN bun run build --filter=./gateway

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/gateway/dist /usr/src/gateway/dist
COPY --from=prerelease /usr/src/app/gateway-server .

# run the app
USER bun
EXPOSE 4000/tcp
ENTRYPOINT [ "bun", "run", "start" ]