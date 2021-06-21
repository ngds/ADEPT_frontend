FROM node:12.18.1
 
WORKDIR /app
 
COPY . .
WORKDIR /app/src/

RUN npm install
 
EXPOSE 80

ENTRYPOINT [ "node", "adept-app.js" ]
