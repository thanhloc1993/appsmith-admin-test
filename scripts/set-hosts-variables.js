function setHostVariables(core) {
    const { ORGANIZATION, ENV } = process.env;
    const hosts = generateHosts(ENV, ORGANIZATION);

    // if manual trigger has inputs for branches
    // skip adding hosts variables to build and run test locally
    if (!process.env.FE_REF) {
        core.exportVariable('BO_HOST', hosts.bo_host);
    }
    if (!process.env.ME_REF) {
        core.exportVariable('TEACHER_HOST', hosts.teacher_host);
        core.exportVariable('LEARNER_HOST', hosts.learner_host);
    }
    core.exportVariable('TEACHER_FLAVOR', `${ORGANIZATION}_teacher_${ENV}`);
    core.exportVariable('LEARNER_FLAVOR', `${ORGANIZATION}_learner_${ENV}`);
    core.exportVariable('CMS_FLAVOR', `.env.${ORGANIZATION}.${ENV}`);
}

function generateHosts(env, org) {
    if (org === 'manabie') {
        return {
            bo_host: `https://backoffice.${env}.manabie.io/`,
            teacher_host: `https://teacher.${env}.manabie.io/`,
            learner_host: `https://learner.${env}.manabie.io/`,
        };
    }

    return {
        bo_host: `https://backoffice.${env}.${org}.manabie.io/`,
        teacher_host: `https://teacher.${env}.${org}.manabie.io/`,
        learner_host: `https://learner.${env}.${org}.manabie.io/`,
    };
}

module.exports = {
    setHostVariables,
    generateHosts,
};
