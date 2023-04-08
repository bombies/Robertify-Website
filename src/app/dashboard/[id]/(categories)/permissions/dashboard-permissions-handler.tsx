import AbstractDashboardHandler, {
    AbstractDashboardFields
} from '@/app/dashboard/[id]/(categories)/abstract-dashboard-handler';

enum PermissionHolder {
    ROLE, USER
}

enum Permissions {
    ROBERTIFY_ADMIN,
    ROBERTIFY_DJ,
    ROBERTIFY_POLLS,
    ROBERTIFY_BAN,
    ROBERTIFY_THEME,
    ROBERTIFY_8BALL
}

export default class DashboardPermissionsHandler extends AbstractDashboardHandler {

    constructor(opts: AbstractDashboardFields) {
        super(opts);
    }

    public getAllRolePermissions() {
        const permissionObj = this.getRobertifyGuild()?.permissions;
        if (!permissionObj)
            return;

        const allRoles: Map<Permissions, string[] | undefined> = new Map();
        allRoles.set(Permissions.ROBERTIFY_ADMIN, permissionObj['0']);
        allRoles.set(Permissions.ROBERTIFY_DJ, permissionObj['1']);
        allRoles.set(Permissions.ROBERTIFY_POLLS, permissionObj['2']);
        allRoles.set(Permissions.ROBERTIFY_BAN, permissionObj['3']);
        allRoles.set(Permissions.ROBERTIFY_THEME, permissionObj['4']);
        allRoles.set(Permissions.ROBERTIFY_8BALL, permissionObj['5']);
        return allRoles;
    }

    public getAllUserPermissions() {
        const permissionObj = this.getRobertifyGuild()?.permissions;
        if (!permissionObj)
            return;

        const usersObj = permissionObj.users;
        if (!usersObj)
            return;
        const keys = Object.keys(usersObj);
        const allUsers: Map<string, Permissions[] | undefined> = new Map();

        for (let key in keys)
            allUsers.set(key, usersObj[key]);
        return allUsers;
    }
}