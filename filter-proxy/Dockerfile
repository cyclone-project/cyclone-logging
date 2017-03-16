FROM node:7

RUN mkdir -p /usr/src/app &&\
	wget https://download.elasticsearch.org/kibana/kibana/kibana-3.1.2.tar.gz &&\
    tar xvzf kibana-3.1.2.tar.gz &&\
    rm -f kibana-3.1.2.tar.gz &&\
    mv kibana-3.1.2 /usr/src/app/kibana
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

EXPOSE 8080

USER node
CMD ["npm", "start"]

