// @ts-ignore
import * as reporter from 'multiple-cucumber-html-reporter';
import { join, basename } from 'path';

const prefixPath = process.env.PREFIX_PATH || process.cwd();
const jsonReports = join(prefixPath, 'report/json');
const historiesDir = join('histories', `${process.env.RUN_ID || 'run-id'}`);
const htmlReports = join(prefixPath, 'report', historiesDir);

const projectName = basename(join(__dirname, '../../'));

const reportGenerationTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
const commitHash = process.env.COMMIT_HASH;
const branch = process.env.BRANCH;
const username = process.env.USERNAME;
const email = process.env.EMAIL;
const cmsBranch = process.env.BRANCH_CMS;
const studentAppBranch = process.env.BRANCH_STUDENT_APP;
const cmsCommitHash = process.env.COMMIT_HASH_CMS;
const studentCommitHash = process.env.COMMIT_HASH_STUDENT_APP;
const env = process.env.ENV || 'staging';

const customData: any = {
    title: 'Run info',
    data: [
        {
            label: 'Project',
            value: `<a href="https://github.com/manabie-com/${projectName}.git" ' + 'target="_blank">${projectName}</a>`,
        },
        {
            label: 'Author username',
            value: `<a href="https://github.com/${username}" ' + 'target="_blank">${username}</a>`,
        },
        { label: 'Author mail', value: email },
        {
            label: 'Commit hash',
            value: `<a href="https://github.com/manabie-com/eibanam/commit/${commitHash}" ' + 'target="_blank">${commitHash}</a>`,
        },
        {
            label: 'Branch',
            value: `<a href="https://github.com/manabie-com/eibanam/tree/${branch}" ' + 'target="_blank">${branch}</a>`,
        },
        {
            label: 'Environment',
            value: `${env}`,
        },
        {
            label: 'CMS commit hash',
            value: `<a href="https://github.com/manabie-com/school-portal-admin/commit/${cmsCommitHash}" ' + 'target="_blank">${cmsCommitHash}</a>`,
        },
        {
            label: 'CMS branch',
            value: `<a href="https://github.com/manabie-com/school-portal-admin/tree/${cmsBranch}" ' + 'target="_blank">${cmsBranch}</a>`,
        },
        {
            label: 'Student-app commit hash',
            value: `<a href="https://github.com/manabie-com/student-app/commit/${studentCommitHash}" ' + 'target="_blank">${studentCommitHash}</a>`,
        },
        {
            label: 'Student-app branch',
            value: `<a href="https://github.com/manabie-com/student-app/tree/${studentAppBranch}" ' + 'target="_blank">${studentAppBranch}</a>`,
        },
        { label: 'Report Generation Time', value: reportGenerationTime },
    ],
};

reporter.generate({
    jsonDir: jsonReports,
    reportPath: htmlReports,
    openReportInBrowser: !process.env.CI,
    displayReportTime: true,
    displayDuration: true,
    metadata: {
        platform: {
            name: process.platform,
        },
    },
    customData: customData,
});
