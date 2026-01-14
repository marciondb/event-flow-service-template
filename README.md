# EventFlow Service Template

This repository provides the **standard starting point** for backend services in the EventFlow ecosystem.

It encapsulates architectural conventions and development tooling defined in the EventFlow documentation, ensuring that all services start from a **consistent and predictable baseline**.

This template contains **no business logic** and is not intended to be deployed as-is.

---

## Purpose

The EventFlow Service Template exists to:

- Standardize service structure
- Reduce setup and configuration overhead
- Enforce architectural boundaries
- Provide a runnable and testable baseline
- Reflect the rules defined in `service-design-principles.md`

All backend services in EventFlow are expected to be bootstrapped from this template unless explicitly documented otherwise.

---

## Architectural Alignment

This template is a **direct implementation** of the architecture defined in:

- `service-design-principles.md`
- `service-bootstrap.md`

It does not introduce new concepts or abstractions.

---

## Directory Structure

The directory structure below is **intentional and mandatory**, as defined in
`service-design-principles.md`.

```
service-name/
│
├── src/
│   ├── models/
│   ├── logic/
│   ├── controllers/
│   ├── diplomat/
│   │   ├── http/
│   │   ├── client/
│   │   ├── producer/
│   │   └── consumer/
│   ├── adapters/
│   └── wire/
│       ├── in/
│       └── out/
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── scripts/
│   └── dev.sh
│
├── .env.example
├── package.json
├── tsconfig.json
├── jest.config.ts
├── README.md
└── CONTRIBUTING.md
```

---

## Layer Responsibilities

### models/
- Pure domain data structures
- No behavior
- No dependencies

### logic/
- Pure business logic
- Deterministic and side-effect free
- Depends only on models

### controllers/
- Orchestrate use cases
- Coordinate logic and boundary interactions
- Do not implement business rules

### diplomat/
- Handle all external interactions and side effects
- Entry point for infrastructure concerns

Includes:
- HTTP servers
- HTTP clients
- Message producers
- Message consumers

### adapters/
- Translate data between wire formats and domain models
- No business logic
- No side effects

### wire/
- Define external data contracts

Subfolders:
- `wire/in/` — schemas for incoming data
- `wire/out/` — schemas for outgoing data

---

## Test Structure

The template includes a preconfigured test environment using **Jest**.

```
tests/
  unit/
  integration/
```

### Unit Tests
- Test pure logic and adapters
- No I/O
- No Kafka
- Fast and deterministic

### Integration Tests
- Validate wiring and boundaries
- May involve Kafka or HTTP
- Focus on orchestration, not business rules

---

## Kafka Configuration

Services connect to an **existing Kafka infrastructure** via environment variables.

The service is responsible for:
- Consuming messages from Kafka topics
- Producing messages to Kafka topics

The service is **not** responsible for:
- Running or managing Kafka infrastructure
- Provisioning topics or brokers

Configure connection details in `.env`:

```bash
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=your-service-name
KAFKA_GROUP_ID=your-service-group
```

---

## How to Use This Template

1. Create a new repository using this template
2. Rename the service and update the README
3. Adjust environment variables if needed
4. Start implementing domain logic following the defined structure

---

## What You Should Change

- Service name
- README content
- Domain models
- Business logic
- Event definitions

---

## What You Should Not Change

- Directory structure
- Layer responsibilities
- Separation between domain and boundary
- Test structure (unit vs integration)

Any deviation should be intentional and documented.

---

## Summary

The EventFlow Service Template ensures that every backend service starts with:

- A clear architectural contract
- Explicit boundaries and responsibilities
- A runnable and testable environment
- Consistency across the EventFlow ecosystem

This allows services to evolve independently without architectural drift.
