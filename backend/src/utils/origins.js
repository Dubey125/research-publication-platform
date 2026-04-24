const stripTrailingSlash = (value) => value.replace(/\/+$/, '');

const isAbsoluteOrigin = (value) => /^https?:\/\//i.test(value);

const isLocalHostLike = (value) => /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(value);

export const expandConfiguredOrigins = (rawValue, options = {}) => {
  const { allowHttpForBareHost = true } = options;

  return Array.from(
    new Set(
      String(rawValue || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
        .flatMap((origin) => {
          const normalized = stripTrailingSlash(origin);

          if (isAbsoluteOrigin(normalized)) {
            return [normalized];
          }

          if (isLocalHostLike(normalized)) {
            return [`http://${normalized}`, `https://${normalized}`];
          }

          if (allowHttpForBareHost) {
            return [`https://${normalized}`, `http://${normalized}`];
          }

          return [`https://${normalized}`];
        })
    )
  );
};

export const normalizeOrigin = (origin) => {
  if (!origin || typeof origin !== 'string') {
    return '';
  }
  return stripTrailingSlash(origin.trim());
};
