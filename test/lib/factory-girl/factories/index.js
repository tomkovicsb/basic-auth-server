const factories = [
  'AuthCode',
  'RefreshToken',
  'User',
  'BlacklistedToken',
];

factories.map((f) => require(`./${f}`));
