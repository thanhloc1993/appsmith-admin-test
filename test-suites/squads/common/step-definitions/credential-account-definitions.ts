import {
    AccountRoles,
    CMSInterface,
    IMasterWorld,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    loadAccountJprepConfiguration,
    loadJprepKeyCloakConfiguration,
} from 'configurations/load-environment';
import { ByValueKey } from 'flutter-driver-x';
import { aliasStudentJPREP, aliasTeacherJPREP } from 'test-suites/squads/common/alias-keys/jprep';
import {
    appbarHeader,
    loginButton,
    submitButton,
} from 'test-suites/squads/common/cms-selectors/login-page';
import { defaultKeyCloakUserPassword } from 'test-suites/squads/common/constants/jprep';
import { AccountKeyCloakAdmin } from 'test-suites/squads/common/enums/jprep';
import {
    createRandomUserOnKeyCloak,
    syncStudentAndTeacherJPREP,
} from 'test-suites/squads/common/services/jprep-service/jprep-service';
import { UserKeyCloak } from 'test-suites/squads/common/services/jprep-service/types';

export function getCMSInterfaceByRole(masterWorld: IMasterWorld, role: AccountRoles) {
    switch (role) {
        case 'school admin':
        case 'school admin 1':
            return masterWorld.cms;

        case 'teacher':
        case 'school admin 2':
            return masterWorld.cms2;

        case 'teacher T1':
            return masterWorld.cms3;

        case 'teacher T2':
            return masterWorld.cms4;

        default:
            return masterWorld.cms;
    }
}

export function getTeacherInterfaceFromRole(
    master: IMasterWorld,
    role: AccountRoles
): TeacherInterface {
    return role !== 'teacher T2' ? master.teacher : master.teacher2;
}

export function getLearnerInterfaceFromRole(
    master: IMasterWorld,
    role: AccountRoles
): LearnerInterface {
    switch (role) {
        case 'parent P1': {
            return master.parent;
        }
        case 'parent P2': {
            return master.parent2;
        }
        case 'student S2': {
            return master.learner2;
        }
        case 'student S3': {
            return master.learner3;
        }
        default: {
            return master.learner;
        }
    }
}

async function gotoAdminKeyCloakAuthPageAndGetToken(cms: CMSInterface) {
    const newPage = await cms.page!.context().newPage();
    const config = loadJprepKeyCloakConfiguration(process.env.ENV);

    await newPage.goto(config.URL_AUTH);

    await newPage.click('text=Administration Console');
    await newPage.fill('#username', AccountKeyCloakAdmin.USERNAME);
    await newPage.fill('#password', AccountKeyCloakAdmin.PASSWORD);
    await newPage.click('#kc-login');

    const resp = await newPage.waitForResponse((resp) => resp.url() === config.URL_TOKEN);

    const respBody = await resp.json();
    const accessToken: string = respBody?.access_token || '';
    await newPage.close();

    return accessToken;
}

export async function syncStudentAndTeacherFromJPREPPartner(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
}) {
    const { cms, scenarioContext } = params;

    const accessToken = await gotoAdminKeyCloakAuthPageAndGetToken(cms);
    const student = await createRandomUserOnKeyCloak(accessToken, 'student');
    const teacher = await createRandomUserOnKeyCloak(accessToken, 'teacher');
    await syncStudentAndTeacherJPREP({ student, teacher });

    scenarioContext.set(aliasTeacherJPREP, teacher);
    scenarioContext.set(aliasStudentJPREP, student);
}

export async function schoolAdminLoginToCMSJprep(cms: CMSInterface) {
    const page = cms.page!;
    await page.locator(loginButton).click();

    const config = loadAccountJprepConfiguration(process.env.ENV);

    await page.locator('#username').fill(config.USERNAME);
    await page.locator('#password').fill(config.PASSWORD);

    await page.locator(submitButton).click();
    await page.waitForSelector(appbarHeader);
}

export async function teacherLoginToTeacherAppJprep(params: {
    teacher: TeacherInterface;
    scenarioContext: ScenarioContext;
}) {
    const { teacher, scenarioContext } = params;

    const page = teacher.page!;
    const flutterDriver = teacher.flutterDriver!;
    const loginButton = new ByValueKey('loginPage.loginButtonKey');

    const [jprepLoginPopup] = await Promise.all([
        page.waitForEvent('popup'),
        flutterDriver.tap(loginButton),
    ]);

    await jprepLoginPopup.waitForLoadState();

    const teacherInfo = scenarioContext.get<UserKeyCloak>(aliasTeacherJPREP);

    await jprepLoginPopup.locator('#username').fill(teacherInfo.username);
    await jprepLoginPopup.locator('#password').fill(defaultKeyCloakUserPassword);
    await jprepLoginPopup.locator(submitButton).click();

    await jprepLoginPopup.locator('#password-new').fill(defaultKeyCloakUserPassword);
    await jprepLoginPopup.locator('#password-confirm').fill(defaultKeyCloakUserPassword);
    await jprepLoginPopup.locator(submitButton).click();

    const homePage = new ByValueKey('Your Course');
    await flutterDriver.waitFor(homePage, 60000);
}
