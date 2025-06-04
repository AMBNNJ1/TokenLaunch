# Improvement Plan

This plan identifies short term enhancements to improve the project quality and developer experience.

## 1. Package cleanup
- **Deduplicate `scripts`** in `package.json` – the file contains two `scripts` objects which can confuse tooling.
- **Remove `token-launch/` subpackage** if no longer used or document its role.
- **Run `npm audit`** and address the reported high severity vulnerabilities.

## 2. Documentation updates
- Expand `README.md` with instructions on installing dependencies, running the dev server and tests.
- Document required environment variables using `.env.example` as reference.
- Fix the truncated `implementation-plan.md` to preserve the final steps.

## 3. Code improvements
- Replace remaining TODOs such as the token creation logic inside `TokenLaunchModal.tsx` with actual implementations or stub functions.
- Add error boundaries and user notifications for API failures.
- Consider extracting configuration constants from components into dedicated modules.

## 4. Testing
- Add unit tests for the Twitter API service functions.
- Set up integration tests for the token launch flow once backend endpoints are available.
- Ensure mocks/stubs do not rely on external APIs for repeatable test runs.

## 5. Styling and UI
- Review usage of custom utility classes like `crypto-circuit` and remove unused styles.
- Provide light/dark theme toggles using Tailwind's theming capabilities.
- Improve mobile responsiveness of the tweet feed and modal dialogs.

These tasks can be addressed incrementally. Prioritising package cleanup and documentation will make it easier for new contributors to run the project, while additional tests and UI refinements will improve stability and user experience.
