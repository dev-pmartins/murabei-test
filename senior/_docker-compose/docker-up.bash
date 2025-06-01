docker-compose rm -f
COMPOSE_HTTP_TIMEOUT=200 docker-compose up -d --force-recreate --remove-orphans > docker.log
