# To build and run with Docker:
#
#  $ docker build -t ng2-quickstart .
#  $ docker run -it --rm -p 3000:3000 -p 3001:3001 ng2-quickstart
#
FROM node:latest

RUN mkdir -p /flapclient /home/nodejs && \
    groupadd -r nodejs && \
    useradd -r -g nodejs -d /home/nodejs -s /sbin/nologin nodejs && \
    chown -R nodejs:nodejs /home/nodejs

WORKDIR /flapclient
COPY package.json typings.json /flapclient/
RUN npm install --unsafe-perm=true

COPY . /flapclient
RUN chown -R nodejs:nodejs /flapclient
USER nodejs

CMD npm start
