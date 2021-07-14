const factories = [
  'AuthCode',
  'RefreshToken',
  'User',
];

factories.map((f) => require(`./${f}`));
