async function notifyMessage({ core, runners }) {
    let squads = [];
    runners.forEach((runner) => {
        if (!squads.includes(runner.squad)) {
            squads.push(runner.squad);
        }
    });
    const { RUN_ID, STATUS, ACTOR, ACTOR_ICON, E2E_SLACK_WEBHOOKS, TAG_EXPRESSION } = process.env;
    const webhooks = JSON.parse(E2E_SLACK_WEBHOOKS || '{}');
    let webhook = webhooks['automation'];

    if (squads.length === 1 && webhooks[squads[0]]) {
        webhook = webhooks[squads[0]];
    }

    core.exportVariable('INCOMING_WEBHOOK_URL', webhook);
    const attachments = [
        {
            color: STATUS == 'failure' ? 'danger' : 'good',
            author_name: ACTOR,
            author_icon: ACTOR_ICON,
            fields: [
                {
                    title: 'E2E Report',
                    value: `<https://mana-e2e.web.app/?runId=${RUN_ID}|${
                        TAG_EXPRESSION || RUN_ID
                    }>`,
                },
                {
                    title: 'Github action',
                    value: `<https://github.com/manabie-com/eibanam/actions/runs/${RUN_ID}|${RUN_ID}>`,
                },
            ],
        },
    ];

    core.exportVariable('TITLE', `Hi ${squads.join(', ')} team :wave:`);
    core.exportVariable('BODY', attachments);
}

module.exports = {
    notifyMessage,
};
