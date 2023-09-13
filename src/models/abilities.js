import { AbilityBuilder, Ability } from '@casl/ability';

export const defineAbilitiesFor = (user) => {
    const { can, cannot, build } = new AbilityBuilder(Ability);
    if (user.role.name === 'Admin') {
        can('manage', 'all');
    } else if (user.role.name === 'Moderator') {
        can('view', ['Products', 'Orders', 'Settings']);
    } else {
        can('read', 'all');
    }
    return build();
};
