const _config = {
    server: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5001',
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'localhost',
};

export const config = Object.freeze(_config);