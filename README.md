# Gall3ry Telegram Miniapp

## Run with filter

### App

```
pnpm dev --filter app 
```

### Bot

```
pnpm dev --filter my-node-app
```

### Worker

```
pnpm dev --filter worker
```

### Migration

```bash
pnpm db:migrate -- --name map_payload_to_tonproof
```

#### Reset
 
```
pnpm db:reset
```

