# adept-docker-deploy



## Prerequisites
- docker: https://docs.docker.com/install/
- node.js
- 


## Installation
- installing the express generator
  `npm install express-generator -g`
 `express docker-app`
  `npm install`
- `git clone https://github.com/ngds/ADEPT_frontend.git`



### Start

Building Docker images

`sudo docker build -t node-adept` 

Running a Docker image

`sudo docker run -d --publish 8000:8000 --publish 5480:5432 node-adept`
 
Access a shell and run custom commands inside a container

`sudo docker exec -it CONTAINER_ID /bin/sh`

`node adept-app.js`


## Deploy and publish 


SSL/certificates

`sudo docker build -t node-adept-ssl`

`sudo docker run -d --add-host= [URL]:[IP address] -p 80:80 -p 443:443 -p 5432:5432 node-adept-ssl`
