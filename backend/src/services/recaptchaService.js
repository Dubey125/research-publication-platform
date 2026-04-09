const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export const verifyRecaptchaToken = async ({ token, remoteIp }) => {
  const secret = (process.env.GOOGLE_RECAPTCHA_SECRET_KEY || '').trim();

  if (!secret) {
    return {
      success: false,
      errorCode: 'missing-secret'
    };
  }

  if (!token) {
    return {
      success: false,
      errorCode: 'missing-input-response'
    };
  }

  const body = new URLSearchParams({
    secret,
    response: token
  });

  if (remoteIp) {
    body.append('remoteip', remoteIp);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let response;
  try {
    response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: controller.signal
    });
  } catch (_error) {
    clearTimeout(timeout);
    return {
      success: false,
      errorCode: 'verification-request-failed'
    };
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    return {
      success: false,
      errorCode: 'verification-request-failed'
    };
  }

  const result = await response.json();

  return {
    success: Boolean(result?.success),
    hostname: result?.hostname || '',
    score: typeof result?.score === 'number' ? result.score : null,
    action: result?.action || '',
    errorCodes: Array.isArray(result?.['error-codes']) ? result['error-codes'] : []
  };
};
