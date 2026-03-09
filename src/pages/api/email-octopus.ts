export const prerender = false;
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const json = (status: number, body: object) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Invalid request body.' });
  }

  const { name, email, role, municipality, teamSize, referral } = body;

  if (!name || !email || !municipality) {
    return json(400, { error: 'Missing required fields.' });
  }

  const runtime = (locals as any).runtime;
  const apiKey = (import.meta.env.EMAIL_OCTOPUS_API_KEY || 
                  process.env.EMAIL_OCTOPUS_API_KEY || 
                  runtime?.env?.EMAIL_OCTOPUS_API_KEY) as string | undefined;

  if (!apiKey) {
    console.error('Missing EmailOctopus API key in any source (import.meta, process.env, or runtime.env)');
    return json(500, { error: 'Server configuration error.' });
  }

  const listId = 'ed364f62-1bd5-11f1-a557-ed50c1110101';
  const url = `https://emailoctopus.com/api/1.6/lists/${listId}/contacts`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        email_address: email,
        fields: {
          FirstName: String(name),
          Role: String(role || ''),
          Municipality: String(municipality),
          TeamSize: String(teamSize || ''),
          Referral: String(referral || '')
        },
        status: 'SUBSCRIBED'
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error('EmailOctopus Error:', data);
      return json(500, { error: 'Failed to subscribe. Please try again later.' });
    }

    return json(200, { ok: true });
  } catch (err) {
    console.error('submit-to-emailoctopus error:', err);
    return json(500, { error: 'Server error. Please try again.' });
  }
};
