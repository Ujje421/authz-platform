# AuthZ: Relationship-Based Access Control (ReBAC) Platform

AuthZ is a production-grade, cloud-native authorization platform inspired by Google Zanzibar. It is designed to provide globally consistent, fine-grained access control for distributed systems and microservices. Applications no longer need to implement authorization logic—they simply query AuthZ.

## 🚀 Key Features

- **Relationship-Based Access Control (ReBAC):** Model permissions as graphs and traverse them natively via PostgreSQL Recursive CTEs.
- **Microservices Architecture:** Independently scalable services communicating internally via gRPC.
- **High Throughput & Low Latency:** A two-tier caching strategy (In-Memory L1 + Redis L2) designed to achieve <10ms p95 latency for permission checks.
- **Event-Driven:** Utilizes the Transactional Outbox pattern with Kafka to ensure zero-data-loss event streaming across the ecosystem.
- **Multi-Tenant:** Built from the ground up to support isolated tenant schemas, users, and relationships.
- **Cloud-Native Observability:** Instrumented with OpenTelemetry for distributed tracing (Jaeger).

## 🏗️ Architecture

The platform is structured as a `pnpm` monorepo utilizing `turborepo` for optimized builds.

### Microservices
- **Authorization Service:** The core graph engine. Exposes gRPC endpoints for `Check`, `Expand`, and `WriteRelationships`.
- **API Gateway:** The public-facing edge service that proxies REST requests to the internal gRPC services.
- **Schema Service:** Manages tenant-specific relation definitions and parses YAML DSL configurations.
- **Identity Service:** Manages Tenant and User onboarding and authentication (JWT).
- **Audit Service:** Maintains an immutable ledger of all authorization decisions and relationship changes.
- **Analytics Service:** Aggregates system metrics and usage statistics asynchronously.

### Shared Packages
- `@nexus-authz/common`: Application-wide types, errors, and constants (e.g., consistency tokens).
- `@nexus-authz/kafka`: Shared wrapper around `kafkajs` for pub/sub.
- `@nexus-authz/observability`: OpenTelemetry configuration for distributed gRPC tracing.

## 🛠️ Tech Stack

- **Backend:** Node.js, NestJS, TypeScript, gRPC
- **Database:** PostgreSQL (TypeORM)
- **Cache:** Redis (Keyv)
- **Message Broker:** Apache Kafka (Zookeeper)
- **Tooling:** pnpm, Turborepo, k6 (Load Testing)

## 📦 Getting Started

### Prerequisites
- Node.js (v20+)
- pnpm (v10+)
- Docker & Docker Compose

### Installation

1. Install dependencies across the monorepo:
   ```bash
   pnpm install
   ```

2. Start the infrastructure (PostgreSQL, Redis, Kafka, Jaeger):
   ```bash
   cd infrastructure
   docker-compose up -d
   ```

3. Run the development servers:
   ```bash
   pnpm dev
   ```

### Load Testing
A `k6` load test is included to verify the performance requirements of the `/check` endpoint.
```bash
k6 run tests/load-test.js
```

## 🗺️ Roadmap (Upcoming Phases)

- **Phase 4:** Full Event Integration (Kafka Consumers), Dockerization of all Node services, and End-to-End integration testing.
- **Phase 5:** Kubernetes orchestration (Helm charts) and CI/CD pipelines.
