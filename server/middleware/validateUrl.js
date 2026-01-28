const validateDestinationUrl = (req, res, next) => {
    let { destination_url } = req.body;

    // Skip validation if no destination_url in request
    if (!destination_url) {
        return next();
    }

    // Normalize URL: add https:// if no protocol is present
    const trimmed = destination_url.trim();
    if (trimmed && !/^https?:\/\//i.test(trimmed)) {
        destination_url = `https://${trimmed}`;
        // Update the request body with normalized URL
        req.body.destination_url = destination_url;
    }

    const ALLOWED_PROTOCOLS = ['http:', 'https:'];

    try {
        const parsed = new URL(destination_url);

        // Check protocol
        if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
            return res.status(400).json({
                error: 'Invalid URL protocol. Only HTTP and HTTPS are allowed.',
                details: {
                    provided_protocol: parsed.protocol,
                    allowed_protocols: ALLOWED_PROTOCOLS
                }
            });
        }

        // In production, block localhost and internal IPs
        if (process.env.NODE_ENV === 'production') {
            const hostname = parsed.hostname.toLowerCase();

            // Block localhost
            if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
                return res.status(400).json({
                    error: 'Localhost URLs are not allowed in production'
                });
            }

            // Block private IP ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x)
            if (hostname.startsWith('10.') ||
                hostname.startsWith('192.168.') ||
                /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) {
                return res.status(400).json({
                    error: 'Private IP addresses are not allowed in production'
                });
            }
        }

        // URL is valid
        next();
    } catch (error) {
        return res.status(400).json({
            error: 'Invalid URL format',
            details: {
                message: 'Please provide a valid HTTP or HTTPS URL',
                example: 'https://example.com'
            }
        });
    }
};

module.exports = validateDestinationUrl;
