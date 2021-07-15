FROM node:12.22.3

RUN mkdir /src
RUN npm install pm2@3.5.1 -g

CMD cd /src && npm install &&\
   pm2 start processes.json &&\
   pm2 logs