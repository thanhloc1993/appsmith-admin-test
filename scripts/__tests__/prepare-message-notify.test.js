// eslint-disable-next-line @typescript-eslint/no-var-requires
const { notifyMessage } = require('../prepare-message-notify');

describe('notifyMessage', () => {
    const OLD_ENV = process.env;

    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });
    it("should send notify to squad's channel", () => {
        process.env = {
            ...OLD_ENV,
            STATUS: 'success',
            RUN_ID: 'runId',
            ACTOR: 'actor',
            ACTOR_ICON: 'actorIcon',
            E2E_SLACK_WEBHOOKS: JSON.stringify({ syllabus: 'syllabus-hook' }),
        };
        const exportVariable = jest.fn();
        notifyMessage({
            core: { exportVariable },
            runners: [
                {
                    squad: 'syllabus',
                    tagString: '@syllabus and (@syllabus-1)',
                    organization: 'manabie',
                    env: 'staging',
                },
            ],
        });
        expect(exportVariable).toBeCalledWith('INCOMING_WEBHOOK_URL', 'syllabus-hook');
        expect(exportVariable).toBeCalledWith('TITLE', `Hi syllabus team :wave:`);
        expect(exportVariable).toBeCalledWith('BODY', [
            {
                author_icon: 'actorIcon',
                author_name: 'actor',
                color: 'good',
                fields: [
                    {
                        title: 'E2E Report',
                        value: '<https://mana-e2e.web.app/?runId=runId|runId>',
                    },
                    {
                        title: 'Github action',
                        value: '<https://github.com/manabie-com/eibanam/actions/runs/runId|runId>',
                    },
                ],
            },
        ]);
    });
    it('should send notify message to automation channel', () => {
        process.env = {
            ...OLD_ENV,
            STATUS: 'failure',
            RUN_ID: 'runId',
            ACTOR: 'actor',
            ACTOR_ICON: 'actorIcon',
            E2E_SLACK_WEBHOOKS: JSON.stringify({
                syllabus: 'syllabus-hook',
                automation: 'automation-hook',
            }),
        };
        const exportVariable = jest.fn();
        notifyMessage({
            core: { exportVariable },
            runners: [
                {
                    squad: 'syllabus',
                    tagString: '@syllabus and (@syllabus-1)',
                    organization: 'manabie',
                    env: 'staging',
                },
                {
                    squad: 'lesson',
                    tagString: '@lesson and (@lesson-1)',
                    organization: 'manabie',
                    env: 'staging',
                },
            ],
        });
        expect(exportVariable).toBeCalledWith('INCOMING_WEBHOOK_URL', 'automation-hook');
        expect(exportVariable).toBeCalledWith('TITLE', `Hi syllabus, lesson team :wave:`);
        expect(exportVariable).toBeCalledWith('BODY', [
            {
                author_icon: 'actorIcon',
                author_name: 'actor',
                color: 'danger',
                fields: [
                    {
                        title: 'E2E Report',
                        value: '<https://mana-e2e.web.app/?runId=runId|runId>',
                    },
                    {
                        title: 'Github action',
                        value: '<https://github.com/manabie-com/eibanam/actions/runs/runId|runId>',
                    },
                ],
            },
        ]);
    });
});
