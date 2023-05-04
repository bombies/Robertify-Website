import AbstractDashboardHandler, {
    AbstractDashboardFields
} from '@/app/dashboard/[id]/(categories)/abstract-dashboard-handler';
import Card from "@/components/card";
import React from "react";
import {TableColumn} from "@/app/commands/command-table";
import BadgeWrapper from "@/components/BadgeWrapper";
import {DiscordRole} from "@/utils/discord-types";
import {Table} from "@nextui-org/react";

enum Permissions {
    ROBERTIFY_ADMIN,
    ROBERTIFY_DJ,
    ROBERTIFY_POLLS,
    ROBERTIFY_BAN,
    ROBERTIFY_THEME,
    ROBERTIFY_8BALL
}

const parsePermission = (id: String): Permissions => {
    switch (id) {
        case '0':
            return Permissions.ROBERTIFY_ADMIN
        case '1':
            return Permissions.ROBERTIFY_DJ
        case '2':
            return Permissions.ROBERTIFY_POLLS
        case '3':
            return Permissions.ROBERTIFY_BAN
        case '4':
            return Permissions.ROBERTIFY_THEME
        case '5':
            return Permissions.ROBERTIFY_8BALL
        default:
            throw new Error(`Invalid permission ID: ${id}`)
    }
}

type RolePermissionMetaData = {
    id: string,
    name: string
}

type RolePermission = {
    id: string,
    name: string,
}

type RolePermissionCell = {
    role: RolePermissionMetaData,
    permissions: RolePermission[]
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
        if (permissionObj['0']?.length) allRoles.set(Permissions.ROBERTIFY_ADMIN, permissionObj['0']);
        if (permissionObj['1']?.length) allRoles.set(Permissions.ROBERTIFY_DJ, permissionObj['1']);
        if (permissionObj['2']?.length) allRoles.set(Permissions.ROBERTIFY_POLLS, permissionObj['2']);
        if (permissionObj['3']?.length) allRoles.set(Permissions.ROBERTIFY_BAN, permissionObj['3']);
        if (permissionObj['4']?.length) allRoles.set(Permissions.ROBERTIFY_THEME, permissionObj['4']);
        if (permissionObj['5']?.length) allRoles.set(Permissions.ROBERTIFY_8BALL, permissionObj['5']);
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

    public generateTableForRolePermissions() {
        const rolePermissions = this.getAllRolePermissions();
        if (!rolePermissions || rolePermissions.size === 0)
            return <Card size='sm'
                         title='No Permissions Set'
                         description="You don't have any role permissions set! Click on the button below to add some."
            />

        const columns: TableColumn[] = [
            {name: 'ROLE', uid: 'roles_col'},
            {name: 'PERMISSIONS', uid: 'perms_col'},
        ]

        let parsedPerms: RolePermissionCell[] = []
        const findRoleFromId = (id: string): DiscordRole | undefined => this.getDiscordGuild()?.roles.find(role => role.id === id);
        const parsedPermsHasRole = (role: RolePermissionMetaData): boolean => !!parsedPerms.find(perm => perm.role.id === role.id)
        rolePermissions.forEach((v, k) => {
            v?.forEach(role => {
                const actualRole = findRoleFromId(role)
                if (actualRole) {
                    const roleObj: RolePermissionMetaData = {
                        id: role,
                        name: actualRole?.name
                    }

                    if (!parsedPermsHasRole(roleObj))
                        parsedPerms.push({
                            role: roleObj,
                            permissions: [{
                                id: k.toString(),
                                name: Permissions[k]
                            }]
                        })
                    else {
                        const oldObj = parsedPerms.find(perm => perm.role.id === roleObj.id)
                        oldObj!.permissions.push({
                            id: k.toString(),
                            name: Permissions[k]
                        })
                        const newPerms = parsedPerms.filter(perm => perm.role.id === roleObj.id)
                        newPerms.push(oldObj!)
                        parsedPerms = newPerms
                    }
                }
            })
        })

        const renderCell = (response: RolePermissionCell, key: React.Key) => {
            switch (key) {
                case 'roles_col': {
                    return <p className='dark:text-white text-black'>{response.role.name}</p>
                }
                case "perms_col": {
                    const permElements = response.permissions.map(permission => <BadgeWrapper
                        key={permission.id}
                        onClick={() => {
                        }}
                        css={{
                            cursor: 'pointer',
                            opacity: '0%',
                            transition: 'all ease-in-out 300ms',
                            '&:hover': {
                                opacity: '100%'
                            }
                        }}
                        color="error"
                        content={"x"}
                    >
                        <p className='w-fit p-2 h-7 rounded-xl bg-neutral-700/50 text-white text-xs'>
                            {permission.name}
                        </p>
                    </BadgeWrapper>)
                    return <div className='flex gap-3'>{permElements}</div>
                }
            }
        }

        return (
            <Table
                bordered
                aria-label="Role Permissions Table"
                color='primary'
                css={{
                    height: 'auto',
                    minWidth: "50%",
                }}
            >
                <Table.Header columns={columns}>
                    {(column) => (
                        <Table.Column key={column.uid}>
                            {column.name}
                        </Table.Column>
                    )}
                </Table.Header>
                <Table.Body items={parsedPerms}>
                    {(perm) => (
                        <Table.Row
                            key={perm.role.id}
                        >
                            {(columnKey) => (
                                <Table.Cell
                                    css={{
                                        zIndex: 2
                                    }}
                                >
                                    {renderCell(perm, columnKey)}
                                </Table.Cell>
                            )}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        )
    }
}