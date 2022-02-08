FROM node:17-alpine3.14


RUN mkdir -p /home/dserve
RUN cd /home/dserve
WORKDIR /home/dserve
COPY . /home/dserve
RUN npm install express
RUN npm install path
RUN npm install cors
RUN npm install mysql2


CMD ["node","."]