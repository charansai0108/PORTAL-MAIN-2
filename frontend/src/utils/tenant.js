
/**
 * Tenant identification utility
 * Detects the organization slug from the current URL subdomain
 */

export const getTenantSlug = () => {
    // 1) Check pathname first: support /:tenantSlug/... style URLs
    try {
        const pathname = window.location.pathname || '';
        const segments = pathname.split('/').filter(Boolean); // remove empty
        if (segments.length > 0) {
            const candidate = segments[0].toLowerCase();
            // Avoid common app routes that are not tenant slugs
            const reserved = new Set(['admin', 'student', 'recruiter', 'super-admin', 'login', 'signup', 'auth', 'api', 'interview', 'job', 'jobs']);
            if (!reserved.has(candidate)) {
                return candidate;
            }
        }
    } catch (e) {
        // ignore
    }

    // 2) Fallback to subdomain detection for subdomain-based tenants
    const host = window.location.host || '';
    const parts = host.split('.');

    // For localhost or single domain like portal.com, no subdomain slug
    if (parts.length <= 2 && !host.includes('localhost:')) {
        return null;
    }

    // Handle localhost:3000 -> slug.localhost:3000
    if (host.includes('localhost:')) {
        if (parts.length > 1 && parts[0] !== 'localhost') {
            return parts[0];
        }
        return null;
    }

    // sub.domain.com -> parts = ['sub', 'domain', 'com']
    // We assume the first part is the tenant slug
    return parts[0];
};

export const clearTenantStorage = () => {
    localStorage.removeItem('tenantInfo');
};
