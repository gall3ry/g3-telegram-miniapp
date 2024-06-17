# G3MiniappV2
 
## Ports
Worker: 3100
Backend: 3200

## Development server

Running local registry

```bash
pnpm exec nx run @gall3ry/source:local-registry
```

Generate types

```bash
pnpm exec nx run-many --target=generate-types
```

Running the backend

```bash
pnpm exec nx run g3-backend:serve
```
