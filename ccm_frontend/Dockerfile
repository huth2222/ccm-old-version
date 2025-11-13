FROM node:20.11-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
RUN npm run build
COPY . .
CMD ["npm","start"]