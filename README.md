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

## Requirements

- **Node.js:** 24.0.0 or higher
- **npm:** 10.0.0 or higher

Use `nvm use` to automatically switch to the correct Node version (defined in `.nvmrc`).

---

## Directory Structure

The directory structure below is **intentional and mandatory**, as defined in
`service-design-principles.md`.

```
service-name/
│
├── src/
│   ├── models/              # Domain data structures
│   ├── logic/               # Pure business logic
│   ├── controllers/         # Use case orchestration
│   ├── diplomat/            # External interactions
│   │   ├── http/            # HTTP server/routes
│   │   ├── client/          # HTTP clients
│   │   ├── producer/        # Kafka producers
│   │   └── consumer/        # Kafka consumers
│   ├── adapters/            # Wire ↔ Model translation
│   ├── wire/                # External contracts
│   │   ├── in/              # Input schemas
│   │   └── out/             # Output schemas
│   └── infrastructure/      # Cross-cutting technical concerns
│       ├── ports.ts         # Technical interfaces (Logger, etc)
│       ├── logger.ts        # Structured logging (Winston)
│       ├── config.ts        # Environment configuration
│       └── correlation.ts   # Correlation ID management
│
├── tests/
│   ├── unit/                # Pure logic tests
│   └── integration/         # Wiring and I/O tests
│
├── scripts/
│   └── dev.sh               # Development startup
│
├── .env.example
├── .nvmrc                   # Node version specification
├── package.json
├── tsconfig.json            # Dev + test TypeScript config
├── tsconfig.build.json      # Production build config
├── jest.config.js
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

### infrastructure/
- Cross-cutting technical concerns
- Port & Adapter pattern for technical dependencies
- Used by all layers

Includes:
- **Logger** - Structured logging with Winston and correlation ID support
- **Config** - Environment variable management with type safety
- **Correlation** - Request correlation ID tracking across services

---

## Infrastructure Layer

The template includes a **pre-configured infrastructure layer** with:

### Logger

Structured logging using Winston with:
- JSON format in production
- Pretty-printed format in development
- Automatic correlation ID injection
- Log levels from environment (`LOG_LEVEL`)

**Usage:**
```typescript
import { logger } from "@infrastructure/logger"

logger.info("User created", { userId: "123" })
logger.error("Payment failed", { orderId: "456", error })
```

### Correlation ID

Automatic request tracking across distributed services:

**Usage:**
```typescript
import { generateCorrelationId, getCorrelationId } from "@infrastructure/correlation"

// In HTTP middleware
const cid = generateCorrelationId()

// In any subsequent operation
logger.info("Processing request")  // Includes cid automatically
```

### Configuration

Centralized environment variable management:

**Usage:**
```typescript
import { config } from "@infrastructure/config"

const port = config.port
const serviceName = config.serviceName
```

---

## Test Structure

The template includes a preconfigured test environment using **Jest** with TypeScript support.

```
tests/
  unit/
    infrastructure/
      correlation.test.ts    # 25 tests covering correlation module
  integration/
```

### Unit Tests
- Test pure logic and adapters
- No I/O
- No Kafka
- Fast and deterministic
- Example: Correlation module (25 tests, 100% coverage)

### Integration Tests
- Validate wiring and boundaries
- May involve Kafka or HTTP
- Focus on orchestration, not business rules

### Running Tests

```bash
npm test              # Run all tests
npm run test:unit     # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:watch    # Watch mode
npm run test:coverage # Generate coverage report
```

**Note:** Tests require **Node 24+**. Run `nvm use` to switch to the correct version.

---

## Technology Stack

### Core Dependencies
- **Fastify** - Fast and low overhead HTTP framework
- **KafkaJS** - Modern Kafka client for Node.js
- **Winston** - Structured logging library
- **dotenv** - Environment variable management

### Development Tools
- **TypeScript** - Strict type checking enabled
- **ESLint** - Strict linting with typescript-eslint
- **Jest** - Testing framework with ts-jest
- **tsx** - TypeScript execution with hot reload

### Code Quality
- Path aliases for clean imports (`@models/*`, `@infrastructure/*`, etc.)
- 80% test coverage threshold
- Strict TypeScript configuration
- Comprehensive linting rules

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

### 1. Clone and Setup
```bash
# Use this template to create a new repository
git clone <your-new-repo-url>
cd <your-new-repo>

# Use correct Node version
nvm use

# Install dependencies
npm ci

# Copy environment file
cp .env.example .env
```

### 2. Configure Your Service
```bash
# Update package.json
# - Change "name" field
# - Update "description"

# Update .env
# - Set SERVICE_NAME
# - Configure Kafka connection (if needed)
# - Set LOG_LEVEL
```

### 3. Start Development
```bash
# Start in watch mode
npm run dev

# Run tests
npm test

# Check linting
npm run lint

# Type check
npm run typecheck
```

### 4. Implement Your Service
- Add domain models in `src/models/`
- Implement business logic in `src/logic/`
- Create controllers in `src/controllers/`
- Add HTTP routes in `src/diplomat/http/`
- Configure Kafka consumers/producers in `src/diplomat/consumer|producer/`
- Define data contracts in `src/wire/in/` and `src/wire/out/`
- Write unit tests in `tests/unit/`

---

## What's Already Implemented

This template includes working implementations of:

### ✅ Infrastructure Layer
- **Logger** - Production-ready Winston logger with:
  - Structured JSON logging
  - Correlation ID support
  - Environment-based log levels
  - Pretty-print in development
  - TypeScript interfaces for testability

- **Correlation ID** - Request tracking utilities:
  - UUID v4 generation
  - Thread-local storage pattern
  - Automatic propagation to logs
  - Full test coverage (25 unit tests)

- **Configuration** - Type-safe environment management:
  - Centralized env var access
  - Fallback defaults
  - TypeScript const assertions

### ✅ Development Environment
- TypeScript strict mode enabled
- ESLint with strict rules
- Jest configured with path aliases
- Hot reload with `tsx`
- Separate build and dev configs

### ✅ Code Quality
- Path aliases for all layers
- EditorConfig and VSCode settings
- npm scripts for common tasks
- Git hooks ready (if needed)

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

## Best Practices

### Logging
- Use structured logging with metadata: `logger.info("message", { key: "value" })`
- Correlation IDs are added automatically when set
- Avoid `console.log` - use the logger instead
- Log at appropriate levels: debug, info, warn, error

### Testing
- Write unit tests for all logic and adapters
- Use integration tests for diplomats and controllers
- Maintain 80%+ coverage
- Keep tests isolated and deterministic

### Code Organization
- Keep logic pure (no side effects)
- Put all I/O in diplomat layer
- Use adapters to translate between wire and model
- Respect dependency rules (domain ← boundary)

---

## Summary

The EventFlow Service Template ensures that every backend service starts with:

- A clear architectural contract
- Explicit boundaries and responsibilities
- Production-ready infrastructure (logging, config, correlation)
- A runnable and testable environment
- Consistency across the EventFlow ecosystem

This allows services to evolve independently without architectural drift.
