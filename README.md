Cyclone Logging
===============

[![Build Status](https://travis-ci.org/cyclone-project/cyclone-logging.svg?branch=master)](https://travis-ci.org/cyclone-project/cyclone-logging)

This repository contains the cyclone filter proxy and base configuration for deploying the cyclone logging system. It provides an endpoint to consolidate and view the logs from the various components in the cyclone ecosystem and filtering access to them. It uses the ELK stack ([Elasticsearch](https://github.com/elastic/elasticsearch), [Logstash](https://github.com/elastic/logstash), [Kibana3](https://github.com/elastic/kibana/tree/kibana3)) for log consolidation, filtering and viewing, and [docker and docker-compose](https://www.docker.com) for all deployments. We provide pre-built docker images tagged with cycloneproject/imageName on [docker hub](https://hub.docker.com).

## Structure

Cyclone logging consists of 4 components:

  - [Elasticsearch](https://github.com/elastic/elasticsearch) for storing and searching
  - [Logstash](https://github.com/elastic/logstash) for input and preprocessing.
  - [Kibana3](https://github.com/elastic/kibana/tree/kibana3) for viewing. It is included with and served by the filter-proxy component.
  - __filter-proxy__ is a small nodejs application for access control with authentication provided by the [cyclone federation provider](https://github.com/cyclone-project/cyclone-federation-provider), for serving the kibana frontend and proxying requests to elasticsearch.

Logs are stored and accessed in this schema: `%{client-id}-%{+YYYY.MM.dd}`, i.e. a `client-id` followed by a dash followed by a date. The client-id needs to be set by the component sending the logs. A date is set automatically by elasticsearch. The filter proxy limits access by first requiring authentication and then limiting the indexes a user may access to those starting with a client-id that matches the user's `schacHomeOrganization` attribute.

## How to use
Create an openid-connect client in the cyclone-federation-provider (or your IDP) and configure the filter-proxy to use it. Deploy using docker-compose
```shell
# OPTIONAL: build images
docker-compose build

docker-compose up
```
and go to `http://localhost:8080/kibana`. This will redirect you to the federation provider. Logging in will send you back to kibana. Congratulations, now you should see the logs dashboard.

## Configure

This repository has a flat structure. Configuration for Elasticsearch and Logstash is provided in the root directory and for the filter-proxy (+ sources) in the filter-proxy directory. Configuration is only provided where it differs from the default.

Elasticsearch data is (by default) persisted in `es-data`.For configuring elasticsearch, there are three configuration files:

 - `elasticsearch.yml` general elasticsearch configuration. Currently used for disallowing indexes in query request bodies and disabling dynamic scripting, both for security reasons and to enable the functionality of the filter-proxy.
 - `es-logging.yml` for logging format and destination.
 - `es-template.json` for initial formatting, parsing and indexing of received logs.

Logstash can be configured by editing `logstash.conf`. It contains inputs, filters and outputs. By default, it expects elasticsearch to be reachable at the host `elasticsarch`. This can be changed in `logstash.conf` and the new host should be provided to the container through the `ES_HOST` environment variable.

Kibana configuration is provided dynamically by the filter-proxy (see `filter-proxy/kibana.js`). The filter-proxy configuration is in `filter-proxy/config.js`. It can be configured using the environment variables specified there as well.

