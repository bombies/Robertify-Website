import Redis from 'ioredis'
export let redis = new Redis(process.env.REDIS_URL)