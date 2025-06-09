declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: string;
            JWT_EXPIRES_IN: string;   // ex: "1h"
            PORT?: string;
            DATABASE_URL?: string;
            POINTS_PER_TREE?: string;
        }
    }
}

export { }; 