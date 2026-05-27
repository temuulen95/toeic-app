<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Security Rules

## Sensitive Files
- Never read, display, or log the contents of `.env*` files, API keys, or credentials
- API keys must only be managed via environment variables — never hardcode secrets

## Code Security
- Validate all user input at system boundaries (API routes, form inputs)
- Never introduce SQL injection, XSS, or command injection vulnerabilities
- Use `Response.json({ error: ... }, { status: 4xx/5xx })` for error responses — never expose raw stack traces

## Development Process (TDD)
- Write tests before implementation code: test → code → refactor
- Run `npm run build` before committing to catch type errors early
- Security-sensitive changes (auth, API keys, data access) require manual review before deploy
