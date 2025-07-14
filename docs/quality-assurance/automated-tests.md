## Automated tests
This document describes the automated tests that are performed within the CI/CD (GitLab Pipeline), on the client side (Lighthouse) and on the dev side (unit/integration tests)

---

## CI/CD pipeline   
### Build
**Description**

Automated assembly of the Docker-image of the application and publication to the container registry

**Technical details**

**Tools:** [Docker v24.0.5](https://gitlab.pg.innopolis.university/n.askarbekuly/demo_docker_ci_cd/-/blob/master/README.md#conclusion), plugin Docker Buildx  
**Target registry:** harbor.pg.innopolis.university   
**Image tags:**
- $CI_COMMIT_SHORT_SHA (hash)
- latest (for the last successful build)

**Characteristics**
- Base image: ubuntu:latest (from cached harbor)
- Installed packages: nginx
- Time: ~9 secs

**Launch** [.gilab-ci.yml](https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/blob/main/.gitlab-ci.yml?ref_type=heads)
```.gitlab-ci.yml
build:
  stage: build
  image: docker:24.0.5
  services:
    - docker:24.0.5-dind
  before_script:
    - docker info
    - echo "$HARBOR_PASSWORD" | docker login -u "$HARBOR_USERNAME" "$HARBOR_HOST" --password-stdin
  script:
    - docker build -t $APP .
    - docker tag $APP $HARBOR_HOST/$HARBOR_PROJECT/$APP:$CI_COMMIT_SHORT_SHA
    - docker tag $APP $HARBOR_HOST/$HARBOR_PROJECT/$APP:latest
    - docker push $HARBOR_HOST/$HARBOR_PROJECT/$APP:$CI_COMMIT_SHORT_SHA
    - docker push $HARBOR_HOST/$HARBOR_PROJECT/$APP:latest
  tags:
    - docker
```
### Security scan   
**Description**

Comprehensive review of the code and configurations on:
- Vulnerabilities in dependencies (npm, pip)
- Configuration errors in Dockerfile
- Potential security issues

**Technical details**

**Tool:** [Trivy v0.64](https://trivy.dev/latest/)  
**Types of checks:**                                                                       
- vuln: Scanning for vulnerabilities in dependencies
- config: Misconfiguration analysis (Dockerfile)

#### Checking files: (example from the latest commit)
| Target | Type       | Vulnerabilities | Misconfigurations         |
|------|------------|-----------------|---------------------------|
| frontend/package-lock.json | npm        | 0               | -                         |
| frontend/requirements.txt | pip        | 0               | -                         |
| package-lock.json   | npm        | 0               | -                         |
|   Dockerfile                    | dockerfile | -               | 3 (medium and low levels) |
Legend:
- '-': Not scanned
- '0': Clean (no security findings detected)

**Launch** [.gilab-ci.yml](https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/blob/main/.gitlab-ci.yml?ref_type=heads)
```.gitlab-ci.yml
security_scan:
  stage: test
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  script:
    - trivy fs --security-checks vuln,config .
```

### Container scan
**Description**

Automated checking of Docker-images for vulnerabilities in dependencies and the base OS.

**Technical details**

**Tool:** [Trivy v0.64](https://trivy.dev/latest/)  
**Vulnerability database:** Updated daily (last update: 13/07/2025)

#### Checking files: (example from the latest commit)
| Target | Type       | Vulnerabilities            | Secrets |
|------|------------|----------------------------|---------|
| harbor.pg.innopolis.university/makeyourchoice/my-app:latest| ubuntu         | 25 (medium and low levels) | -       |
Legend:
- '-': Not scanned
- '0': Clean (no security findings detected)

**Launch** [.gilab-ci.yml](https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/blob/main/.gitlab-ci.yml?ref_type=heads)
```.gitlab-ci.yml
container_scanning:
  stage: test
  image:
    name: $HARBOR_HOST/docker-hub-cache/aquasec/trivy:latest
    entrypoint: [""]
  variables:
    TRIVY_USERNAME: "$HARBOR_USERNAME"
    TRIVY_PASSWORD: "$HARBOR_PASSWORD"
    TRIVY_AUTH_URL: "$HARBOR_HOST"
    FULL_IMAGE_NAME: $HARBOR_HOST/$HARBOR_PROJECT/$APP:latest
  script:
    - trivy --version
    - time trivy clean --scan-cache
    - time trivy image --download-db-only --no-progress --cache-dir .trivycache/
    - time trivy image --exit-code 0 --cache-dir .trivycache/ --no-progress --format template --template "@/contrib/gitlab.tpl" --output "$CI_PROJECT_DIR/gl-container-scanning-report.json" "$FULL_IMAGE_NAME"
    - time trivy image --exit-code 0 --cache-dir .trivycache/ --no-progress "$FULL_IMAGE_NAME"
    - time trivy image --exit-code 1 --cache-dir .trivycache/ --severity CRITICAL --no-progress "$FULL_IMAGE_NAME"
  cache:
    paths:
      - .trivycache/
  artifacts:
    when: always
    reports:
      container_scanning: gl-container-scanning-report.json
  tags:
    - docker
  needs:
    - build
```

### Performance test (Lighthouse)
**Description**

Automated performance testing of the frontend using Lighthouse, including:
- Performance score
  - FCP (First Contentful Paint)
  - LCP (Largest Contentful Paint)
  - TBT (Total Blocking Time)
  - CLS (Cumulative Layout Shift)
  - SI (Speed index)
- Accessibility
- Best practices
- SEO

**Technical details**

**Tool:** [Lighthouse v10.3.0](https://developer.chrome.com/docs/lighthouse/overview?hl=ru)     
**Browser:** Chrome

#### Checking files (example from the latest commit)
**Target URL:** https://make-your-choice.vercel.app/    
**Report format:** JSON (lighthouse-report.json)

![lighthouse](docs/lighthouse.png)

**Launch** [.gilab-ci.yml](https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/blob/main/.gitlab-ci.yml?ref_type=heads)
```.gitlab-ci.yml
performance-test:
  stage: test
  image: cypress/browsers:node-22.17.0-chrome-138.0.7204.92-1-ff-140.0.2-edge-138.0.3351.65-1
  script:
    - npm install -g lighthouse
    - lighthouse --chrome-flags="--no-sandbox --headless" https://make-your-choice.vercel.app/ --output=json --output-path=./lighthouse-report.json
```
### Lint
**Description**

Static analysis of the frontend application code to identify:
- Syntax errors
- Code style discrepancies
- Potential bugs
- Unused code

**Tools:** ESLint + React plugin

**Checking files**
- .jsx and .js from frontend/src/
- tests from frontend/tests/

**Launch** [.gilab-ci.yml](https://gitlab.pg.innopolis.university/makeyourchoice-team-17/makeyourchoice/-/blob/main/.gitlab-ci.yml?ref_type=heads)
```.gitlab-ci.yml
lint:
  stage: test
  image: node:20
  script:
    - cd frontend
    - npm install
    - npm run lint
    - npm run test
  artifacts:
    reports:
      junit: frontend/reports/eslint-report.xml
    paths:
      - frontend/reports/
```