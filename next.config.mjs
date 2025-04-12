import withPWA from "next-pwa";

// Generate a unique cache name per build (YYYY-MM-DD-HH format)
const now = new Date();
const BUILD_TIME = `${now.toISOString().split("T")[0]}-${now
	.getUTCHours()
	.toString()
	.padStart(2, "0")}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Enables React Strict Mode for better debugging and development practices
	reactStrictMode: true,
	// Removes console logs in production for better performance
	compiler: {
		removeConsole: process.env.NODE_ENV !== "development",
	},
};

// Export Next.js configuration wrapped with PWA settings
export default withPWA({
	// Specifies where to generate PWA assets (service worker, manifest, etc.)
	dest: "public",

	// Disable PWA features during development to prevent caching issues
	disable: process.env.NODE_ENV === "development",

	// Automatically register the service worker for the PWA
	register: true,

	// Forces the new service worker to activate immediately, without waiting for all tabs to be closed
	skipWaiting: true,

	// Ensures all open tabs use the updated service worker without requiring a reload
	clientsClaim: true,

	// Deletes outdated caches automatically to free up space and avoid stale data
	cleanupOutdatedCaches: true,

	// Runtime caching strategies
	runtimeCaching: [
		// Cache static assets (e.g., CSS, JS, images, fonts) using StaleWhileRevalidate strategy
		{
			// Match common static file types (images, fonts, stylesheets, etc.)
			urlPattern:
				/.*\.(html|css|js|ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$/,
			// Serve from cache while updating the cache in the background (StaleWhileRevalidate)
			handler: "CacheFirst",
			options: {
				// Cache name specific to static assets
				cacheName: `static-${BUILD_TIME}`,
				expiration: {
					// Limit the number of cached static assets (max 50 entries)
					maxEntries: 50,
					// Cache duration: 30 days
					maxAgeSeconds: 60 * 60 * 24 * 30,
				},
			},
		},
		// Background Sync for API requests (Ensures failed requests retry when the user goes back online)
		{
			// Match all API requests (e.g., /api/*)
			urlPattern: /^https?.*\/api\/.*/,
			// Use NetworkFirst strategy for API requests to ensure the latest data
			handler: "NetworkFirst",
			options: {
				// Dynamic cache name specific to API requests
				cacheName: `api-${BUILD_TIME}`,
				// Timeout before falling back to cache (faster failover)
				networkTimeoutSeconds: 3,
				expiration: {
					// Limits the number of cached API entries (max 50 entries)
					maxEntries: 50,
					// Cache duration: 1 day
					maxAgeSeconds: 60 * 60 * 24,
				},
				// Enables Background Sync for failed API requests
				backgroundSync: {
					name: "api-queue",
					options: {
						// Retry failed API requests for up to 1 hour
						maxRetentionTime: 60 * 60,
					},
				},
			},
		},
	],

	// Exclude the Next.js middleware manifest from being cached (prevents issues with routing/middleware)
	buildExcludes: [/middleware-manifest\.json$/],
})(nextConfig);
