## Continuous Integration

Our CI pipeline is configured using GitLab CI and consists of several stages that ensure code quality, security, and functionality.

#### CI Workflow File
- [.gitlab-ci.yml](https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/blob/main/.gitlab-ci.yml?ref_type=heads)

#### Tools Used in CI

1. **Docker**:
    - Used to build container images for the application
    - Handles image tagging and pushing to our Harbor registry

2. **ESLint** (via `npm run lint`):
    - Static code analysis for JavaScript/TypeScript
    - Enforces coding standards and identifies potential errors

3. **Jest/Vitest** (via `npm run test:unit` and `npm run test:integration`):
    - JavaScript testing framework for unit and integration tests
    - Verifies component functionality and integration

4. **Trivy**:
    - Container scanning for vulnerabilities (in `container_scanning` job)
    - Filesystem security scanning (in `security_scan` job)
    - Identifies security vulnerabilities in dependencies and container images

5. **Lighthouse** (in `performance-test` job):
    - Performance testing tool
    - Measures web app performance, accessibility, and best practices

6. **Supabase Type Generator**:
    - Generates TypeScript types from Supabase database schema
    - Ensures type safety when interacting with the database

#### CI Workflow Runs
All CI pipeline runs can be viewed in the [GitLab CI/CD Pipelines](https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/pipelines) section.
### Continuous Deployment

We use Vercel for continuous deployment.

- Every push to the main branch triggers a redeployment of the production version.
- Vercel is directly connected to our GitHub repository.
- CI/CD runs and deployments can be managed via the private Vercel dashboard connected to our GitHub repository.


- Live deployment: [https://make-your-choice.vercel.app/](https://make-your-choice.vercel.app/)
