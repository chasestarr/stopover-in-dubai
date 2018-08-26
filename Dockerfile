FROM golang:1.10.0

EXPOSE 8080

ENV JWT_SECRET=${JWT_SECRET}
ENV POSTGRES_URI=${POSTGRES_URI}
ENV TMDB_KEY=${TMDB_KEY}

RUN mkdir -p /go/src/github.com/chasestarr/stopover-in-dubai
WORKDIR /go/src/github.com/chasestarr/stopover-in-dubai

COPY . /go/src/github.com/chasestarr/stopover-in-dubai

RUN curl https://glide.sh/get | sh
RUN glide install

RUN go build -o main

CMD ./main
