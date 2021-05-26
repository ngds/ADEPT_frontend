# adept-docker-deploy



## Prerequisites
- docker: https://docs.docker.com/install/
- node.js
- 


## Installation
- `git clone https://github.com/ngds/ADEPT_frontend.git`



### Start
 
Access a shell and run custom commands inside a container

`sudo docker exec -it CONTAINER_ID /bin/sh`

`node adept-app.js`


## Deploy and publish 

`sudo docker build -t node-adept-ssl`

`sudo docker run -d --add-host= [URL]:[IP address] -p 80:80 -p 443:443 -p 5432:5432 node-adept-ssl`
