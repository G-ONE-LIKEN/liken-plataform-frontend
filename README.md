# liken-plataform-frontend

Frontend de la plataforma LIKEN (inversión en proyectos de energía renovable
tokenizados): Next.js 16 (App Router) + wagmi/viem para la interacción on-chain
con MetaMask.

## Arquitectura

- **Backend**: consume el [api-gateway](https://github.com/G-ONE-LIKEN/liken-plataform-backend)
  vía `apiClient` ([shared/lib/api-client.ts](shared/lib/api-client.ts)) con
  refresh automático del access token (cookie HttpOnly).
- **On-chain**: las transacciones (approve/buy/refund/claim) las firma el
  usuario con MetaMask vía wagmi; el backend solo proyecta los eventos
  (ADR-0017 del backend). ABIs en [features/web3/lib/abis.ts](features/web3/lib/abis.ts).
- **Estructura por features**: `features/{auth,projects,invest,wallet,web3,admin,notifications}`,
  páginas en `app/`, UI compartida en `shared/` y `components/ui` (shadcn).

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completar valores (ver tabla)
npm run dev                  # http://localhost:3000
```

Requiere el backend corriendo (`docker compose up` en el repo backend).

## Variables de entorno (`NEXT_PUBLIC_*`)

Se **hornean en el bundle durante el build** — cambiarlas exige rebuild
(en prod: editar la GitHub Variable y re-correr el workflow).

| Variable | Local | Producción | Nota |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8090` | `/` | `/` = same-origin: rutas relativas `/api/...`; el ingress enruta al gateway bajo el mismo dominio. Sin CORS. |
| `NEXT_PUBLIC_WC_PROJECT_ID` | — | — | WalletConnect/Reown project id |
| `NEXT_PUBLIC_LKN_ADDRESS` / `REGISTRY` / `DISTRIBUTOR` / `USDC` | — | — | Addresses de los contratos globales en Sepolia |
| `NEXT_PUBLIC_CHAIN_ID` | `11155111` | `11155111` | Sepolia |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | — | — | Login con Google |

## Despliegue

GitHub Actions (`.github/workflows/build-push-frontend.yml`): push a
`main`/`master` → build de imagen (standalone) → Artifact Registry →
`kubectl set image` + `rollout restart` en GKE (el restart cubre re-runs
sobre el mismo commit, donde el tag no cambia).

Dominio canónico: `https://www.liken.lat` — `liken.lat` redirige 301 al www
(redirect por host en [next.config.ts](next.config.ts); el LB de GCE no
soporta redirects por host).

## Decisiones a tener en cuenta

- El gate de KYC es **fail-closed**: sin `kycStatus = APPROVED` confirmado no
  se muestra el flujo de compra (el backend valida igual).
- Las invalidaciones de React Query tras confirmar una tx van en `useEffect`
  (nunca en render: loop de invalidaciones).
- El claim de dividendos se deshabilita si la wallet conectada en MetaMask no
  coincide con la vinculada a la cuenta (el monto mostrado es de la vinculada).
