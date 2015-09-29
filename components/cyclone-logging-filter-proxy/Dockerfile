FROM node

RUN wget https://download.elasticsearch.org/kibana/kibana/kibana-3.1.2.tar.gz &&\
    tar xvzf kibana-3.1.2.tar.gz &&\
    rm -f kibana-3.1.2.tar.gz &&\
    mv kibana-3.1.2 /opt/kibana

ENTRYPOINT ["node", "app.js"]

EXPOSE 3003

ADD . /opt/cyclone-logging-filter-proxy
WORKDIR /opt/cyclone-logging-filter-proxy
RUN mv /opt/kibana /opt/cyclone-logging-filter-proxy/kibana &&\
    npm install
