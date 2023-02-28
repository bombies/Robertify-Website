import {RedisManager} from "@/utils/api/redis/redis-manager";
import {DiscordInfo} from "@/app/_components/discord-data-context";

export default class DiscordAccessRedisManager extends RedisManager {
    constructor() {
        super('discord-access');
    }

    public async putOne(id: string, info: any) {
        return await this.setex(id, info, 86400);
    }

    public async findOne(id: string) {
        return await this.get<any>(id);
    }

    public async deleteOne(id: string) {
        return await this.del(id);
    }
}