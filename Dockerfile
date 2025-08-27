FROM node:20.16.0-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20.16.0-slim AS production
WORKDIR /app
COPY --from=build /app ./
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "4173"]
