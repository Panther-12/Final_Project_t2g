FROM node:18.19.0 AS build-step
WORKDIR /home/event
RUN rm -rf /home/event/*
COPY package.json ./
# RUN npm install
COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.25.3
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /home/event/dist /usr/share/nginx/html
EXPOSE 80


