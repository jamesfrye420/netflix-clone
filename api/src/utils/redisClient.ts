import * as redis from 'redis';

// connecting to redis client, for more refference visit 'https://redis.js.org/'

const redis_client = redis.createClient();
redis_client.on('error', (err) => console.log('Redis Client Error', err));
redis_client
  .connect()
  .then()
  .catch((err) => console.log(err));

export default redis_client;
