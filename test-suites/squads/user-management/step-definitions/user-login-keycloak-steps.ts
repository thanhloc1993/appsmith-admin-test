import { aSchoolAdminAlreadyLoginSuccessInCMS } from '@legacy-step-definitions/school-admin-email-login-definitions';

import { Given, Then, When } from '@cucumber/cucumber';

import {
    checkSchoolAdminLoginOnJPREPPartner,
    loginKeyCloakAuthPage,
    syncStudentAndTeacherFromJPREPPartner,
} from './user-login-keycloak-definitions';

enum AccountSchoolAdminJPREP {
    USERNAME = 'product.test+jprep.staging@manabie.com',
    PASSWORD = 'manabie',
}

Given('system has synced student and teacher from partner', async function (this) {
    const cms = this.cms;

    await cms.instruction('School admin waits for sync data', async function () {
        await syncStudentAndTeacherFromJPREPPartner(cms);
    });
});

// TODO: Implement login on leaner and teacher JPREP after fix bug auto login account test on both app

// When('student logins with valid username or password from partner', async function (this) {
//     const leaner = this.learner!;
// });

// When('teacher logins with valid username or password from partner', async function (this) {
//     const teacher = this.teacher!;
// });

When('school admin logins with valid username or password from partner', async function (this) {
    const cms = this.cms;

    await cms.instruction('School admin goes to login page', async function () {
        await Promise.all([cms.page?.waitForEvent('load'), cms.selectAButtonByAriaLabel(`Log in`)]);
    });

    await loginKeyCloakAuthPage(
        cms,
        AccountSchoolAdminJPREP.USERNAME,
        AccountSchoolAdminJPREP.PASSWORD
    );
});

Then('school admin logins by Keycloak successfully', async function (this) {
    const cms = this.cms;
    await this.cms.instruction('Logged in by Keycloak, see home page', async function () {
        await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
        await checkSchoolAdminLoginOnJPREPPartner(cms);
    });
});
