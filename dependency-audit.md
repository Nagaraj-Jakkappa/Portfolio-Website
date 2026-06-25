# Dependency Audit Report

## Frontend (Client)

### 1. `esbuild` via `vite`
- **Severity:** Moderate
- **Status:** **Accepted / Unresolved**
- **Why it remains:** The vulnerability originates from `esbuild`, which is a transitive dependency of `vite` (version 5). The only officially available fix requires upgrading `vite` to `^8.1.0`. Upgrading to Vite v8 is a major, breaking change that would involve migrating configuration files, updating plugins, and potentially resolving other breaking changes within the frontend ecosystem.
- **Exploitability in this project:** **Not shipped in the frontend runtime bundle.** Both `vite` and `esbuild` are exclusively development dependencies used solely for bundling the React application locally and in CI/CD pipelines. They are completely stripped from the final static build artifacts produced by `npm run build`. Therefore, this vulnerability has extremely low production runtime risk on the live, deployed portfolio website.
- **Recommended future fix:** Scheduled for future planned upgrade to safely migrate the frontend tooling from Vite v5 to Vite v8 and resolve this warning permanently.

## Backend (Server)

### 1. `nodemailer`
- **Severity:** High
- **Status:** **Accepted / Unresolved**
- **Why it remains:** A vulnerability exists in the version of `nodemailer` currently installed, requiring an update to version `9.0.1`. However, version 9 introduces breaking changes. Rather than blindly force-upgrading the major version (`npm audit fix --force`) and risking broken email functionality on the production server, the existing stable version is retained.
- **Exploitability in this project:** **Low production runtime risk.** The vulnerabilities described (e.g., SSRF via `List-*` headers or raw option) typically require the application to be taking arbitrary email configuration parameters or untrusted raw payloads directly from an unauthenticated user to form the transport object. In the context of the portfolio contact form, only predefined sender logic and structured input fields are utilized, mitigating this risk.
- **Recommended future fix:** Scheduled for future planned upgrade. Manually review the `nodemailer` v9 migration guide, upgrade the package explicitly, and test the email transport code in a separate pull request.
