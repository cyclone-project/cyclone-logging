# Cyclone Logging
This repository contains the cyclone logging components responsible for consolidating the various logs in the cyclone ecosystem. To this end, it uses the __ELK__ stack ([Elasticsearch](https://github.com/elastic/elasticsearch), [Logstash](https://github.com/elastic/logstash), [Kibana3](https://github.com/elastic/kibana/tree/kibana3)).

The __filter-proxy__ filters requests on the index level with regard to certain attributes of the user, e.g. schacHomeOrganization, and serves the kibana frontend to the user.

Authentication is provided by the [cyclone federation provider](https://github.com/cyclone-project/cyclone-federation-provider) using [keycloak-nodejs-connect](https://github.com/keycloak/keycloak-nodejs-connect).


## Configure
__Elasticsearch__ can be configured by editing `elasticsearch.yml`, `es-logging.yml` and `es-template.yml`. Data is persisted (by default) in `es-data`.

__Logstash__ configuration is in `logstash.conf`.

The __filter proxy__ can be configured by editing `config.js` or `log.js` inside the filter proxy folder.


## Deploy
__Prerequisites:__ Create an openid-connect client in the cyclone-federation-provider and configure the filter-proxy to use it.

Then deploy with [docker-compose](https://docs.docker.com/compose/)
```
docker-compose up
```


## CYCLONE Filter Proxy
This involves Kibana. It has two tasks:
- Accept login via the Federation Provider(Keycloak)
- Depending on the claims of the user in the JWT that Kibana receives from the Federation Provider, it shows only logs assigned to the organization of the user. 

The filter image defined in docker-compose.yml includes both the filter and the Kibana image.
