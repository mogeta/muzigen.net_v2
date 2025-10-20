import type { ServiceAccount } from "firebase-admin";
import { initializeApp, cert, getApps } from "firebase-admin/app";

const activeApps = getApps();

// Helper function to clean environment variables (remove unwanted newlines and whitespace)
const cleanEnvVar = (value: string | undefined): string | undefined => {
	return value?.trim().replace(/\r?\n/g, '');
};

const serviceAccount = {
	type: "service_account",
	project_id: cleanEnvVar(import.meta.env.FIREBASE_PROJECT_ID),
	private_key_id: cleanEnvVar(import.meta.env.FIREBASE_PRIVATE_KEY_ID),
	private_key: cleanEnvVar(import.meta.env.FIREBASE_PRIVATE_KEY),
	client_email: cleanEnvVar(import.meta.env.FIREBASE_CLIENT_EMAIL),
	client_id: cleanEnvVar(import.meta.env.FIREBASE_CLIENT_ID),
	auth_uri: cleanEnvVar(import.meta.env.FIREBASE_AUTH_URI),
	token_uri: cleanEnvVar(import.meta.env.FIREBASE_TOKEN_URI),
	auth_provider_x509_cert_url: cleanEnvVar(import.meta.env.FIREBASE_AUTH_CERT_URL),
	client_x509_cert_url: cleanEnvVar(import.meta.env.FIREBASE_CLIENT_CERT_URL),
};

const initApp = () => {
	// Check if we have all required environment variables
	const hasEnvConfig = serviceAccount.project_id &&
						 serviceAccount.private_key &&
						 serviceAccount.client_email;

	if (hasEnvConfig) {
		console.info('Loading service account from env.')
		return initializeApp({
			credential: cert(serviceAccount as ServiceAccount)
		})
	}

	// Only use default credentials if explicitly in Firebase Functions environment
	// Note: When building static sites, PROD is true but we're not in Firebase Functions
	throw new Error('Firebase configuration not found. Please set environment variables.')
}

export const app = activeApps.length === 0 ? initApp() : activeApps[0];
