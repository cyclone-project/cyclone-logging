# Cyclone Logging

This repository contains the cyclone logging components, responsible for consolidating the various logs in the cyclone ecosystem, consisting of the ELK stack ([Elasticsearch](https://github.com/elastic/elasticsearch), [Logstash](https://github.com/elastic/logstash), [Kibana3](https://github.com/elastic/kibana/tree/kibana3)) and a filter-proxy utilizing [keycloak-nodejs](https://github.com/keycloak/keycloak-nodejs). Authentication is provided by the [cyclone federation provider](https://github.com/cyclone-project/cyclone-federation-provider).

# Configuration
__Elasticsearch__ can be configured by editing the files in config/elasticsearch/. 

The __Logstash__ configuration file is in config/logstash. Further information regarding this file is provided [here](https://www.elastic.co/guide/en/logstash/2.0/configuration.html). Logstash supports various [input](https://www.elastic.co/guide/en/logstash/2.0/input-plugins.html), [filter](https://www.elastic.co/guide/en/logstash/2.0/filter-plugins.html), [codec](https://www.elastic.co/guide/en/logstash/2.0/codec-plugins.html) and [output](https://www.elastic.co/guide/en/logstash/2.0/output-plugins.html) plugins. 

The __cyclone logging filter proxy__ can be configured by editing the source files in components/cyclone-logging-filter-proxy/ directly, specifically app.js and logging.js. 

__Kibana__ is configured by editing kibana_config_template.js and kibana_dashboard_template.js in components/cyclone-logging-filter-proxy/.

# How to run

__Prerequisites:__ Create an openid-connect client in the cyclone-federation-provider and export the client adapter configuration in the Keycloak JSON format to keycloak.json. Put this file into the cyclone-logging-filter-proxy directory. 

Then deploy with [docker-compose](https://docs.docker.com/compose/), i.e. `docker-compose up`. 