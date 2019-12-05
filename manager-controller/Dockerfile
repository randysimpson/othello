FROM golang:1.12 as builder
WORKDIR /go/src
RUN mkdir manager-controller
WORKDIR /go/src/manager-controller
ADD . .
RUN go get github.com/gorilla/mux
RUN go get go.mongodb.org/mongo-driver/mongo
RUN go get github.com/gomodule/redigo/redis
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags "-static"' -o main .
FROM scratch
COPY --from=builder /go/src/manager-controller/main /app/
WORKDIR /app
EXPOSE 9090
CMD ["./main"]
