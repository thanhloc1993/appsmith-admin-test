// eslint-disable-next-line @typescript-eslint/no-var-requires
const parsingEibanamBlock = require('../parsing-body');

describe('parsing-body', () => {
    it('parsing body', () => {
        const result = parsingEibanamBlock(`
            **Trigger eibanam?** (fill this from before run automation test)
            <-- Start eibanam trigger -->

            - ME ref: release/20211117
            - FE ref: release/20211117
            - Eibanam ref: release/20211117
            - Environment: staging
            - Tags: \`@teacher-info\`
            - Feature files: features/user-management/modify-parent-of-student.feature

            <-- End eibanam trigger -->
        `);
        expect(result).toEqual({
            args: '',
            tags: '@teacher-info',
            featureFiles: 'features/user-management/modify-parent-of-student.feature',
            organization: 'manabie',
            meRef: 'release/20211117',
            feRef: 'release/20211117',
            eibanamRef: 'release/20211117',
            environment: 'staging',
        });
    });
});
