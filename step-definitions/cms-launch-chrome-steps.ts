import { When, Then, DataTable } from '@cucumber/cucumber';

const someOrigins = [
    `https://google.com/`,
    'https://jprep-school-portal.web.app/notifications',
    `https://rethinkdb.com/`,
    `https://hemingwayapp.com/`,
    `https://developer.mozilla.org/en-US/`,
];
When(
    'school admin opens more browsers',
    { timeout: 200000 },
    async function (dataTable: DataTable): Promise<void> {
        const args = dataTable.hashes()[0];
        console.log('args', args);

        let i = 0;
        do {
            await this.cms.instruction(
                `school admin opens ${i + 1} browsers ${args.type}`,
                async function (cms) {
                    return await cms.connectPlaywrightDriver({
                        origin: someOrigins[i % someOrigins.length],
                        timeout: 30000,
                        browser: cms.browser!,
                    });
                }
            );
            i++;
        } while (i < args.size);
    }
);

Then(`school admin views all browsers`, async function () {
    console.log('school admin views all browsers');
});
