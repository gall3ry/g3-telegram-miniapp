# G3MiniappV2
 
## Ports

| Service                   | Port |
|---------------------------|------|
| Nextjs (frontend/backend) | 3000 |
| Worker (complex tasks)    | 3100 |
| Capturing Worker (heavy tasks)          | 3200 |

## Development server

Generate types

```bash
pnpm exec nx run-many --target=generate-types
```

## How to start an app

```bash
pnpm nx serve <app-name>
```

Or if you are using nextjs

```bash
pnpm nx dev <app-name>
```

## How to build an app

```bash
pnpm nx build <app-name>
```

