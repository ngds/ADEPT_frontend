FROM node:12.18.1
 
WORKDIR /app
 
COPY package.json package.json
COPY adept-app.js adept-app.js
COPY adept-app-ssl.js adept-app-ssl.js
COPY adept-routes.js adept-routes.js

COPY public/. /public/
COPY log/. /log/

COPY . .

RUN npm install
 
EXPOSE 8000
EXPOSE 8082
EXPOSE 80
EXPOSE 443
EXPOSE 5432

ENTRYPOINT [ "node", "adept-app.js" ]
