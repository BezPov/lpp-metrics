Building the Docker image: 

`docker image build -t lpp-metrics:1.0.0 .`

Running the Docker image:

`docker container run --publish 8050:8050 --detach --name lpp-metrics lpp-metrics:1.0.0`

Removing the Docker image:

`docker container remove --force lpp-metrics`