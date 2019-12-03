FROM golang:1.12 as builder
WORKDIR /go/src
RUN mkdir solution-generator
WORKDIR /go/src/solution-generator
ADD . .
RUN go get github.com/gorilla/mux
RUN go get github.com/pkg/errors
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags "-static"' -o main .
FROM scratch
COPY --from=builder /go/src/solution-generator/main /app/
WORKDIR /app
EXPOSE 8080
CMD ["./main"]
