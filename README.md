# 🎭 Playwright & TypeScript UI Testing Playground Framework

![Playwright Tests](https://github.com/tk33/playwright-ui-testing-playground/actions/workflows/playwright.yml/badge.svg)

This repository contains an End-to-End (E2E) Test Automation Framework built with Playwright and TypeScript, targeting complex UI components and dynamic challenges from [UI Testing Playground](http://www.uitestingplayground.com/), integrated with a **GitHub Actions CI/CD pipeline**.

🚀 Features
- Dynamic Waiting Strategies: Custom polling mechanisms and robust explicit waits (e.g., handling variable progress bar states) to eliminate test flakiness.
- Cross-Browser Testing: Automated execution against Chromium, Firefox, and WebKit.
- CI/CD Integration: Automated workflow triggered on `push` and `pull_request` events via GitHub Actions.
- Reporting: Detailed HTML reporting generated and stored as artifacts on CI runs.
- Resilient Test Cases: Clean, modular, and reliable test code interacting securely with dynamic DOM structures and hidden layers.

🛠️ Tech Stack
- Framework: [Playwright](https://playwright.dev/)
- Language: TypeScript
- CI/CD: GitHub Actions
- Version Control: Git & GitHub

📦 Setup & Installation

  1. Clone the repository:
  ```bash
  git clone [https://github.com/tk33/playwright-ui-testing-playground.git](https://github.com/tk33/playwright-ui-testing-playground.git)
  cd playwright-ui-testing-playground
  ```
 
