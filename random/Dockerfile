FROM golang:1.12 as builder
WORKDIR /go/src
RUN mkdir random
WORKDIR /go/src/random
ADD . .
RUN go get github.com/gorilla/mux
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags "-static"' -o main .
FROM scratch
COPY --from=builder /go/src/random/main /app/
WORKDIR /app
EXPOSE 10000
CMD ["./main"]