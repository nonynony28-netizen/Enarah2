# Project Security Rules (قواعد أمان الموقع)

## Security Hardening Directives:
1. **Sanitize Inputs:** All user input parameters in API endpoints must be sanitized with `sanitizeString()` to prevent XSS and NoSQL injection attacks.
2. **Rate Limiting:** Protect form submission endpoints against spam and DoS with `checkRateLimit()`.
3. **Security Headers:** Enforce `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security` on API responses.
4. **Environment Isolation:** Keep database connection strings (`MONGODB_URI`) and cloud storage keys isolated in server environment variables.
