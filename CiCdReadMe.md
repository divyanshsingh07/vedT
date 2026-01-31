# CI/CD — What I did

This section documents the Continuous Integration and Continuous Deployment (CI/CD) pipeline I implemented for this repository. It explains the goals, the pipeline stages, how the workflows run, what files/secrets are required, and how to reproduce or extend the setup.

> NOTE: This is a generic, well-documented template tailored for GitHub Actions. If you used a different CI/CD provider (GitLab CI, CircleCI, Jenkins, etc.)

## Summary / Goals

The CI/CD pipeline I implemented automates the following for every push and pull request (and on demand for deployments):

- Run fast automated checks (linting, formatting).
- Run unit and integration tests.
- Build production artifacts (bundles, containers, or static outputs).
- Cache dependencies and build outputs to speed up runs.
- Optionally run security checks (dependency scanning / SCA).
- Publish artifacts or deploy to an environment (staging/production) when appropriate.
- Notify the team on failure or success (via GitHub status, Slack, PR comments).

This gives us:
- Faster feedback for contributors,
- Reproducible builds,
- Safer, auditable deployments.

---

## Where the pipeline lives

The pipeline configuration is in the repo under:
- `.github/workflows/` (GitHub Actions workflows)

Key workflow files (examples):
- `.github/workflows/ci.yml` — CI: lint, test, build
- `.github/workflows/release.yml` — Release/Publish or container build
- `.github/workflows/deploy.yml` — Deploy to cloud / hosting (staging/production)

(If your repo already has workflow files, replace the filenames above with the actual ones.)

---

## When the workflows run

Typical triggers used:
- `push` to main (or protected branches) — runs CI and may trigger deployment
- `pull_request` — runs CI for PR validation (lint/tests)
- `workflow_dispatch` — manually triggerable from the Actions tab
- `schedule` — periodic jobs (dependency updates, security scans)

Example trigger snippet (GitHub Actions):
```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:
  schedule:
    - cron: '0 3 * * 1'  # weekly dependency scan on Monday 03:00
```

---

## Pipeline stages and what each does

1. Checkout
   - Uses `actions/checkout` to fetch repository code at the current ref.

2. Setup runtime / dependencies
   - Installs the required language/runtime (Node/NPM, Python, Java, Go, etc.)
   - Uses caching for dependency managers (e.g., actions/cache for `~/.npm`, `~/.cache/pip`, `~/.m2`)

3. Lint & Format
   - Runs linters (ESLint, flake8, golangci-lint) and format checkers (prettier, black)
   - Fails fast so code style errors are addressed before test runs

4. Tests
   - Runs unit tests and integration tests as configured
   - Uses caching where applicable (test caches, compiled artifacts)
   - Uploads test reports and, optionally, code coverage artifacts

5. Build
   - Produces the build artifacts (static bundle, jar, binary, Docker image)
   - Fails on build errors
   - Saves artifacts as workflow artifacts or pushes containers to a registry

6. Security/Scanning (optional)
   - Dependency scanning (Snyk, GitHub Dependabot alerts, Trivy)
   - Static analysis as configured

7. Deploy / Release
   - Deploy to staging automatically or to production on tagged release merges
   - Uses secrets for credentials (cloud provider tokens, docker registry credentials)
   - Applies rollout strategy if supported (blue/green, canary) — otherwise simple push

8. Notifications & cleanup
   - Notifies via PR checks, Slack, or other channels
   - Cleans up temporary resources or artifacts if needed

---

## Example: GitHub Actions CI workflow (explanatory example)

Below is a commonly used, explanatory GitHub Actions `ci.yml` that demonstrates the flow. Replace specific commands and versions to match your project.

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x]   # adjust per project
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Cache node modules
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: Install dependencies
        run: npm ci

      - name: Run linters
        run: npm run lint

      - name: Run tests
        run: npm test -- --ci --reporter=jest-junit

      - name: Upload test results (JUnit)
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: ./test-results.xml

      - name: Build
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
```

Explanation:
- The workflow checks out code, sets up Node.js, restores and caches dependencies, runs lint and tests, saves the test artifact, and builds the project.
- `if: always()` ensures test artifacts are uploaded even if tests fail (useful for debugging failures).

---

## Example: Deployment job (explanatory)

A simple deploy-to-environment job (using secrets) that runs only on `push` to `main`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Configure cloud CLI
        run: |
          echo "$CLOUD_CREDENTIALS" > creds.json
          # login to provider using creds.json
        env:
          CLOUD_CREDENTIALS: ${{ secrets.CLOUD_CREDENTIALS }}

      - name: Deploy to staging
        run: ./scripts/deploy.sh staging
        env:
          DEPLOY_ENV: staging
          API_KEY: ${{ secrets.STAGING_API_KEY }}
```

Notes:
- Use GitHub Secrets (`Settings → Secrets and variables`) to store credentials safely.
- `needs: build-and-test` ensures deployment only runs when build/test job completes successfully.

---

## Secrets & variables used

Put the following (example) secrets in the repository settings when you want deployments or private registry pushes:

- DOCKER_USERNAME / DOCKER_PASSWORD (or DOCKERHUB_TOKEN)
- GITHUB_TOKEN (provided automatically in Actions; used for status updates and API calls)
- CLOUD_CREDENTIALS or specific provider secrets (GCP_SERVICE_ACCOUNT_KEY, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AZURE_CREDENTIALS)
- STAGING_API_KEY / PROD_API_KEY
- SLACK_WEBHOOK_URL (optional, for notifications)

Never commit secrets into the repository. Always use GitHub Secrets or your CI secrets store.

---

## Caching strategy & performance

- Cache dependency files (`node_modules` alt `~/.npm`, `~/.cache/pip`, `~/.m2`) using `actions/cache`.
- Cache build outputs between steps in a job using `actions/cache` or persist artifacts between jobs via `upload-artifact` + `download-artifact`.
- Parallelize tests using matrix strategies or parallel job partitions if tests are slow.
- Use lightweight base runners or self-hosted runners for heavy builds if needed.

---

## Artifacts, containers and release

- Artifacts: Use `actions/upload-artifact` to store build outputs, logs, or test reports for inspection.
- Containers: To publish Docker images, authenticate to the registry and run `docker build` → `docker push`, or use `crazy-max/ghaction-docker-buildx` or `docker/build-push-action`.
- Releases: Use `actions/create-release` and `actions/upload-release-asset` to create a GitHub Release on tag creation.

---

## Notifications & observability

- Use GitHub Checks + PR status to show pass/fail directly on PRs.
- Send Slack/Teams notifications on failure/success with `8398a7/action-slack` or custom webhook steps.
- Persist logs and test reports as artifacts to help debugging failed runs.

---

## How to run the pipeline locally (reproduce CI)

- For most node/python projects:
  - Install the same runtime version as the workflow.
  - Run the same commands you put in your `ci.yml`, e.g. `npm ci && npm run lint && npm test && npm run build`.
- For containerized pipelines:
  - Use Docker locally to build/test using the same Dockerfile or runner container.
- Consider using `act` (https://github.com/nektos/act) to run GitHub Actions locally (note: not all actions or secrets behave exactly the same locally).

---

## Troubleshooting common failures

- Dependency cache invalidation: update cache key when dependencies change (e.g., hash package-lock.json).
- Flaky tests: isolate and run locally, add retries for flaky external calls, stub network calls.
- Missing secrets: errors like authentication failures — add secrets in repository settings and mask in logs.
- Permissions: ensure the Action runner has required permissions (token scopes or cloud roles).

---

## Future improvements (suggestions)

- Add test coverage and publish coverage reports (Codecov, Coveralls).
- Add security scanning (Dependabot + code scanning).
- Add canary or blue/green deploy strategy for production.
- Add performance tests / smoke tests after deployments.
- Add automatic semantic release on tags with `semantic-release`.

---


