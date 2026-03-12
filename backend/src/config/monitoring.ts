import * as Sentry from "@sentry/node";
import dotenv from "dotenv";

dotenv.config();

export const initMonitoring = () => {
    const dsn = process.env.SENTRY_DSN;

    if (!dsn) {
        console.warn("⚠️ SENTRY_DSN not found. Sentry monitoring is disabled.");
        return;
    }

    Sentry.init({
        dsn,
        environment: process.env.NODE_ENV || "development",
        tracesSampleRate: 1.0,
    });

    console.log("✅ Sentry initialized successfully");
};
