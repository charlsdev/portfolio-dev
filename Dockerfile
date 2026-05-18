# Portfolio SvelteKit (adapter-node) — para Dokploy con Dockerfile (NO Nixpacks).
# Env vars SOLO en runtime (Dokploy las inyecta), nunca en build.

FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
# Deja node_modules solo con deps de producción (adapter-node las necesita en runtime)
RUN pnpm prune --prod

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# adapter-node escucha en 0.0.0.0:3000 por defecto
ENV PORT=3000
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
   CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

# 'node build' (no pnpm): pnpm es solo build-time. Las env vars vienen del entorno.
CMD ["node", "build"]
