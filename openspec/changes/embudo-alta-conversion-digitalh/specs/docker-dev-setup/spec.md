## ADDED Requirements

### Requirement: Docker development environment for PHP backend
The project SHALL provide a Docker-based development environment that replicates the production PHP+MySQL stack.

#### Scenario: Developer starts local environment
- **WHEN** the developer runs `docker-compose up`
- **THEN** the system starts: PHP-Apache container (port 8080), MySQL container (port 3306), phpMyAdmin (port 8081)
- **AND** the frontend is accessible at http://localhost:3000 (via Vite dev server)
- **AND** the PHP API is accessible at http://localhost:8080/api/

#### Scenario: Database is initialized automatically
- **WHEN** the MySQL container starts for the first time
- **THEN** the system automatically creates the database schema from `database/digitalh_schema.sql`
- **AND** seeds with minimal test data if provided

### Requirement: Elimination of Express backend
The Express backend SHALL be completely removed from the project.

#### Scenario: Express files removed
- **WHEN** the change is implemented
- **THEN** the following files are removed: `server.ts`, `src/db.ts`
- **AND** the following dependencies are removed from package.json: `express`, `mysql2`, `nodemailer`, `cors`, `express-rate-limit`, `dotenv`
- **AND** the following devDependencies are removed: `@types/express`, `@types/cors`, `@types/express-rate-limit`, `@types/nodemailer`

#### Scenario: Frontend uses PHP API exclusively
- **WHEN** the frontend needs to save a diagnostic
- **THEN** it calls `./api/diagnostic.php` (relative to deployment path)
- **AND** never attempts to connect to an Express server

### Requirement: Development scripts updated
The npm scripts SHALL be updated to reflect the new architecture.

#### Scenario: npm run dev starts frontend only
- **WHEN** the developer runs `npm run dev`
- **THEN** only the Vite React dev server starts (port 3000)
- **AND** the developer is informed to start Docker separately for backend

#### Scenario: Docker documented clearly
- **WHEN** a developer joins the project
- **THEN** the README includes a "Local Development" section with copy-paste Docker commands
- **AND** explains that frontend (npm) and backend (Docker) run independently
