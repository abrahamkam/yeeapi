FROM node:17-alpine3.14

ENV MYSQL_ROOT_PASSWORD=password

RUN mkdir -p /home/dserve
RUN cd /home/dserve
WORKDIR /home/dserve
COPY . /home/dserve
RUN npm install


CMD ["node","."]