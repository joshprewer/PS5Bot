FROM buildkite/puppeteer:latest
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome-stable"
RUN mkdir /app
WORKDIR /app
COPY . /app