// src/components/Can.js
import { AbilityContext } from '@casl/react';
import { useContext } from 'react';

const Can = ({ perform, on, children }) => {
    const ability = useContext(AbilityContext);
    const allowed = ability.can(perform, on);
    return allowed ? children : null;
};

export default Can; // Make sure to export as default
