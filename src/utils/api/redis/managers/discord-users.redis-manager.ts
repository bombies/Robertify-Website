import { DiscordInfo } from "../../../../app/_components/discord-data-context";
import { RedisManager } from "../redis-manager";


export class DiscordUsersRedisManager extends RedisManager {
    constructor() {
        super('discordDataHash');
    }

    public async putOne(id: string, user: DiscordInfo) {
        return this.setex(id, user, 3600)
    }

    public async findOne(id: string) {
        return this.get<DiscordInfo>(id);
    }

    public async deleteOne(id: string) {
        return this.del(id);
    }
}