# Contributing to EventFlow Service Template

Thank you for your interest in contributing to the EventFlow Service Template.

This document provides guidelines for contributing to this project.

---

## Code of Conduct

Please be respectful and constructive in all interactions.

---

## How to Contribute

### Reporting Issues

1. Check if the issue already exists
2. Create a new issue with a clear description
3. Include steps to reproduce (if applicable)
4. Add relevant labels

### Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes following the project conventions
4. Write or update tests as needed
5. Ensure all tests pass (`npm test`)
6. Commit your changes with clear messages
7. Push to your fork
8. Open a Pull Request

---

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env`
4. Start Kafka: `docker-compose -f docker/kafka/docker-compose.yml up -d`
5. Run tests: `npm test`

---

## Code Standards

### Directory Structure

Do not modify the directory structure defined in `service-design-principles.md`.

### Layer Responsibilities

Respect the separation of concerns:

- **models/** - Pure data structures, no behavior
- **logic/** - Pure business logic, no side effects
- **controllers/** - Orchestration only, no business rules
- **diplomat/** - External interactions only
- **adapters/** - Data transformation only
- **wire/** - Contract definitions only

### Testing

- Unit tests go in `tests/unit/`
- Integration tests go in `tests/integration/`
- All new logic must have corresponding unit tests
- Aim for 80%+ code coverage

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add user validation logic
fix: correct event serialization
docs: update contributing guidelines
test: add unit tests for adapter
```

---

## Pull Request Process

1. Ensure your PR has a clear description
2. Link related issues
3. Wait for code review
4. Address feedback promptly
5. Squash commits if requested

---

## Questions?

Open an issue or reach out to the maintainers.
