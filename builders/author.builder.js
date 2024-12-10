module.exports.Builder = {
  author: ({ name = 'Author Test', user_register = 'idtest123456' } = {}) => ({
    name,
    user_register,
  }),
};
