import { AccountRoles } from '@supports/app-types';

type RolePrefix = 'teacher' | 'student';

export const transformToAccountRoles = (rawNames: string, prefix: RolePrefix) => {
    return rawNames.split(',').map((name) => `${prefix} ${name}`) as AccountRoles[];
};
