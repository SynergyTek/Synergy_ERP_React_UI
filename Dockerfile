FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:6780
ENV NEXT_PUBLIC_DMS_API_BASE_URL=http://localhost:6780/dmsapi

COPY package*.json ./
COPY .npmrc ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]