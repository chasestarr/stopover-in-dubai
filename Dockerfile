FROM golang:1.10.0

RUN curl https://glide.sh/get | sh

RUN mkdir -p /go/src/stopover-in-dubai
WORKDIR /go/src/stopover-in-dubai

EXPOSE 8080
