FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .

FROM base AS deps
RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY .env.production .env.production

RUN pnpm build --output-standalone

FROM node:22-slim AS runner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY --from=build /app/.next/standalone ./  
COPY --from=build /app/.next/static ./.next/static  
COPY --from=build /app/public ./public  
COPY --from=build /app/package.json ./package.json  
COPY --from=build /app/.env.production ./.env.production  

EXPOSE 3000

CMD ["node", "server.js"]