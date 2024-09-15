const Redis = require("ioredis")
const redis= new Redis({
    port: 17722, // Redis port
    host: "redis-17722.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com",
    username: "default", // needs Redis >= 6
    password: "u9IBR4MQb6Q4eq4ncHdeN8UxP5nXuyGv",
    db: 0, // Defaults to 0
  });

  redis.on('connect', () => {
    console.log('Connected to Redis');
  });
  
  redis.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
    
module.exports = redis