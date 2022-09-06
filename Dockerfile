FROM python:3.8-slim-buster


ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}


RUN apt-get -y update &&\
    apt-get install apt-utils -y &&\
    apt-get install curl -y


RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs


# --> 1. Copy Interface
WORKDIR /app
COPY ./. /app

RUN npm install

CMD npm run dev
















