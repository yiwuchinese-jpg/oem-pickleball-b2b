/**
 * Returns the PayPal REST API base URL based on the current environment.
 * - When NEXT_PUBLIC_PAYPAL_CLIENT_ID contains "sandbox" → use sandbox URL
 * - Otherwise → use production (live) URL
 */
export function getPaypalBaseUrl(): string {
  const mode = process.env.NEXT_PUBLIC_PAYPAL_MODE || 'sandbox';
  return mode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

/**
 * Generates a PayPal OAuth2 access token using the Client ID and Secret.
 */
export async function generatePaypalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal credentials");
  }

  const baseUrl = getPaypalBaseUrl();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to generate PayPal token: ${data.error_description || data.error}`);
  }
  return data.access_token;
}
