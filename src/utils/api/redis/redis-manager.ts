import Redis from "ioredis";

export class RedisManager {
    private static readonly redis = new Redis({
        host: process.env.REDIS_HOSTNAME,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
    });
    protected cacheID: string;

    public constructor(cacheID: string) {
        this.cacheID = cacheID + "#";
    }

    protected async setex(identifier: string, value: Object | any[], seconds: number) {
        return RedisManager.redis.setex(this.cacheID + identifier, seconds, JSON.stringify(value));
    }

    protected async set(identifier: string, value: Object | any[]) {
        return RedisManager.redis.set(this.cacheID + identifier, JSON.stringify(value));
    }

    protected async get<T>(identifier: string): Promise<T> {
        const str = await RedisManager.redis.get(this.cacheID + identifier)
        if (!str)
            throw new Error('Invalid identifier!');
        return str ? JSON.parse(str) : {};
    }

    protected async getAll<T>() {
        const keys = await this.keys(`*${this.cacheID}*`)
        if (keys.length === 0)
            return [];
        const entries = (await this.mget<T>(keys)).values();
        const ret: T[] = [];

        let currentEntry = entries.next();
        while (currentEntry.value) {
            ret.push(currentEntry.value);
            currentEntry = entries.next();
        }

        return ret;
    }

    protected async mget<T>(identifiers: string[]): Promise<Map<string, T>> {
        const strArr = await RedisManager.redis.mget(identifiers);
        const retMap = new Map<string, T>();
        strArr.forEach((str, i) => {
            if (str) retMap.set(identifiers[i], JSON.parse(str))
        })
        return retMap;
    }

    protected async keys(filter: string) {
        return RedisManager.redis.keys(filter);
    }

    protected async getRaw<T>(identifier: string): Promise<T> {
        const str = await RedisManager.redis.get(identifier)
        if (!str)
            throw new Error('Invalid identifier!');
        return JSON.parse(str);
    }

    protected async del(identifier: string) {
        return RedisManager.redis.del(this.cacheID + identifier);
    }
}