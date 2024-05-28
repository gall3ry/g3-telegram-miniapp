# Create T3 App


## Run with filter

```
pnpm dev --filter app # my-node-app/worker
```

```
pnpm dev --filter app my-node-app
```

## Docker

```
docker build . --target my-node-app --tag my-node-app:latest
docker build . --target app2 --tag app2:latest
```
