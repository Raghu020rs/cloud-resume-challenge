# Cloud Resume Challenge

A serverless resume website with a visitor counter implemented using AWS services.

## Cloud Resume Challenge ☁️

A serverless resume website built on AWS as part of the
[Cloud Resume Challenge](https://cloudresumechallenge.dev/).

## Live Site

[View Resume](https://d1vubmsmsdi473.cloudfront.net)

## Project Overview

This repository contains the static frontend and the serverless backend used for the visitor counter:

- `frontend/` — static website (HTML, CSS, JavaScript). Open `frontend/index.html` to view locally.
- `lambda/` — Lambda function code (`counter.py`) that updates/reads the visitor count.
- `tests/` — unit tests for the counter logic (`tests/test_counter.py`).

## Architecture

User → CloudFront (CDN) → S3 (HTML/CSS/JS)
								↓
				 API Gateway (REST)
								↓
				 Lambda (Python)
								↓
				 DynamoDB (visitor count)

High-level flow:
1. User opens the resume site (served from S3 + CloudFront).
2. The frontend calls the API to get/update the visitor count.
3. API Gateway forwards the request to the Lambda function.
4. Lambda reads/updates the count in DynamoDB and returns the value.

## ☁️ AWS Services

| Service | Purpose |
|---|---|
| S3 | Static website hosting |
| CloudFront | CDN + HTTPS |
| API Gateway | REST endpoint |
| Lambda | Serverless function |
| DynamoDB | Visitor counter (NoSQL) |
| IAM | Permissions and least-privilege roles |

## 🔧 Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Python 3.x (AWS Lambda)
- CI/CD: GitHub Actions
- IaC: (Terraform / CloudFormation — optional)

## 🧪 Tests

Install test dependencies and run the test suite:

```bash
pip install pytest boto3
pytest tests/ -v
```

There is a working test in `tests/test_counter.py` — running `pytest` should exercise the counter logic.

## 🚀 CI/CD (GitHub Actions)

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that can:
1. Run `pytest` on every push.
2. If tests pass, deploy the frontend to S3.
3. Invalidate CloudFront cache for the distribution.

## Project Structure

- `frontend/`
	- `index.html`
	- `style.css`
	- `counter.js`
- `lambda/`
	- `counter.py`
- `tests/`
	- `test_counter.py`
- `.github/workflows/deploy.yml`
- `README.md`

## Local usage

Frontend (local):

1. Open `frontend/index.html` in a browser to preview the site.
2. The counter frontend logic is in `frontend/counter.js` and will call the API when configured with the live endpoint.

Lambda & tests:

1. Optionally create a virtual environment and install dependencies.

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt  # add this file if you add dependencies
```

2. Run tests locally:

```bash
pytest tests/ -v
```

## Deployment notes

- Create an S3 bucket for the static site and upload the files from `frontend/`.
- Create a DynamoDB table to store a single counter item (e.g. primary key `id` = `counter`).
- Deploy the Lambda function and configure API Gateway to invoke it.
- Use CloudFront in front of the S3 bucket for HTTPS and caching.
- Configure IAM roles with least-privilege for Lambda to access DynamoDB and for deployment to S3.




