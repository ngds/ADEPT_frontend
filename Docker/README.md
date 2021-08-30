# adept-docker-deploy


## Installation

Download or clone github repo

  `git clone https://github.com/ngds/ADEPT_frontend.git`

Edit and save adept-routes.js 
  	
    Enter correct postgres connection info into the pool object.
	user - database user
	host - ip address is preferred
	database - dbname 
	password - 

	The gdURl is url for geoDeepDive access. Verify that this is current and accurate.
	
	Enter in Email user and  password on line 358, 359 and 535, 536	
	let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
            user: "user", // enter username
            pass: "xxxxxxxx", // enter password
            },
        });

	Enter From and Receivers Email on lines 369,370 and 546, 547
        let info = await transporter.sendMail({
            from: '"uwxdd contact" <uwxdd.contact@gmail.com>', // sender address
            to: "email@email.com", // list of receivers
            subject: "New Application Registration request", // Subject line
            text: "", 
            html: es
	
  
##  Create a Docker ignore file (.dockerignore)
  	node_modules
   	npm-debug.log
  
## SSL/certificates

1. Create ssl folder

2. Update the ssl directory with current, authentic ssl certificate files that match the dns access.



## Start

1 - Build command in the directory with the docker file.

    sudo docker build -t <user-id>/node-adept-ssl

2 - Run Command

    sudo docker run -d --add-host=adept.<your-domain>:172.17.0.2 -p 80:80 -p 443:443 -p 5432:5432 <user-id>/node-adept-ssl

3 - Get the Container ID and login

	sudo docker container ls

	Login to container:

	sudo docker exec -ti <container-id>   /bin/bash

4 - In the docker container - add the following to /etc/hosts

	172.17.0.2      adept.<your-domain>
	172.17.0.2      <container-id>

5 - Exit (ctrl-D), then restart the image.

	sudo docker container <container-id> stop

	sudo docker container <container-id> start

6 - Local Test

	curl -k https://adept.<your-domain>

 
Access a shell and run custom commands inside a container

`sudo docker exec -it CONTAINER_ID /bin/sh`

`node adept-app.js`






