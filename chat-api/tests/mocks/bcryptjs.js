module.exports = {
  hash: async (s) => 'hashed_' + s,
  hashSync: (s) => 'hashed_' + s,
  compare: async (s, h) => 'hashed_' + s === h,
  compareSync: (s, h) => 'hashed_' + s === h,
  genSalt: async () => 'salt',
  genSaltSync: () => 'salt'
};
