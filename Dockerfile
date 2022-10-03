FROM python:3.8-slim-buster


RUN apt-get -y update &&\
    apt-get install apt-utils -y &&\
    apt-get install curl -y


RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs


# --> 1. Install dependencies
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# --> 2. Copy Interface
WORKDIR /app
COPY ./. /app

# --> 3. Run container
CMD npm run dev
















