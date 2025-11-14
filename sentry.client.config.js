import * as Sentry from "@sentry/astro";

Sentry.init({
    dsn: "https://c085d86c67c47d3a3cc5b210836a1ce5@o4507463116193792.ingest.us.sentry.io/4510361537085440",
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
});