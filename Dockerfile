FROM mhart/alpine-node:11 AS builder
WORKDIR /app
COPY . .
RUN npm install react-scripts -g --silent
RUN npm install
RUN npm run build

FROM mhart/alpine-node
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/build .
CMD ["serve", "-p", "3000", "-s", "."]doc

