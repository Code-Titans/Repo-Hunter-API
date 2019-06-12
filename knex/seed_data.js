// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');

// eslint-disable-next-line
const n = 20;

function getRandomInt(min, max) {
  const minimum = Math.ceil(min);
  const maximum = Math.floor(max);
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

module.exports = {
  generateUsers() {
  // eslint-disable-next-line no-plusplus
    const users = [];

    for (let i = 0; i < n; i++) {
      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        password: faker.internet.password(),
        picture: faker.image.imageUrl(),
        company: faker.company.companyName(),
        bio: faker.lorem.sentence(),
        website: faker.internet.url(),
      };

      users.push(user);
    }
    return users;
  },

  generateRepos() {
    const repos = [];

    for (let i = 0; i < n; i++) {
      const repo = {
        repo_link: `https://github.com/${faker.internet.userName()}/${faker.lorem.slug()}`,
        description: faker.lorem.sentence(),
        author_id: getRandomInt(1, n),
      };

      repos.push(repo);
    }
    return repos;
  },
};
