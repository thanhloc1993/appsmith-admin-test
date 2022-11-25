import { calendarFullDateField } from '@user-common/cms-selectors/students-page';

import { IWorldOptions } from '@cucumber/cucumber';

import { ElementHandle, Page, Response } from 'playwright';

import { CMSInterface, ConnectOptions, DriverOptions } from '@supports/app-types';
import { Menu } from '@supports/enum';
import { MasterCategory } from '@supports/enum';
import BobImportService from '@supports/services/bob-import-service';
import {
    ActionOptions,
    CMSProfile,
    FileTypes,
    SelectActionOptions,
    SelectDatePickerParams,
    Timezone,
} from '@supports/types/cms-types';

import AbstractDriver from '../drivers/abstract-driver';
import {
    actionPanelTriggerButton,
    cancelDialogButton,
    closeDialogButton,
    dialogActions,
    fileChipName,
    formFilterAdvancedTextFieldSearchInput,
    getActionButtonSelector,
    moreActionAction,
    moreActionButton,
    saveDialogButton,
    snackbarContent,
} from '../step-definitions/cms-selectors/cms-keys';
import {
    clickOnOkButtonOnDatePickerFooter,
    genId,
    getExpectedMonthFromMonthDiff,
    goToPrevOrNextMonth,
    openDatePickerDialog,
    selectDateInDatePicker,
    sliceQueryNameFromGqlBody,
    toShortenStr,
} from '../step-definitions/utils';
import {
    GRAPHQL_SCHEMA_URL_BOB,
    GRAPHQL_SCHEMA_URL_EUREKA,
    GRAPHQL_SCHEMA_URL_FATIMA,
} from './packages/constants';
import GraphqlClient from './packages/graphql-client';
import createHttpClient from './packages/http-client';
import { ScenarioContext } from './scenario-context';
import { gRPCEndpoint } from './services/grpc/constants';
import { ContentBasic } from './types/cms-types';
import { Subject } from 'manabuf/common/v1/enums_pb';
import { aliasAttachmentFileNames } from 'step-definitions/alias-keys/file';
import { retry } from 'ts-retry-promise';

export class CMS extends AbstractDriver implements CMSInterface {
    origin = process.env.BO_HOST || 'http://localhost:3001';
    graphqlClient?: GraphqlClient;

    /**
     * constructor
     * @param options
     * @param driverOptions
     */
    constructor(options: IWorldOptions, driverOptions: DriverOptions) {
        super(options, driverOptions);
    }
    /**
     * connect
     * @param options
     * @returns {Promise<void>} connect
     */
    connect = async (options: ConnectOptions) => {
        this.browser = options.browser;

        await this.connectPlaywrightDriver({
            origin: this.origin,
            timeout: 900 * 1000,
            browser: this.browser,
        });
        this.graphqlClient = new GraphqlClient(createHttpClient());
    };

    /**
     * quit
     * @returns {Promise<void>} close
     */
    quit = async () => {
        await this.quitPlaywrightDriver();
    };

    /**
     * access local storage to get value
     * @param key local storage key
     * @returns {Promise<string>} value
     */
    getLocalStorage = async (key: string): Promise<string> => {
        if (!key) return '';

        const value = await this.page?.evaluate(
            ({ key }) => {
                return localStorage.getItem(key);
            },
            { key }
        );
        return value ?? '';
    };

    /**
     * get token of user logged in to CMS
     * @returns {Promise<string>} token
     */
    getToken = async () => {
        return this.getLocalStorage('manabie_TOKEN');
    };

    /**
     *
     * get profile of user logged in to CMS
     * @returns {Promise<CMSProfile>} CMSProfile
     */
    getProfile = async (): Promise<CMSProfile> => {
        try {
            const profile = await this.getLocalStorage('manabie_PROFILE');

            return JSON.parse(profile) as CMSProfile;
        } catch (err) {
            throw Error(`getProfile: ${err}`);
        }
    };

    /**
     * get base content to prepare data for content flow
     * @returns {Promise<ContentBasic>} return base content
     */
    getContentBasic = async (): Promise<ContentBasic> => {
        try {
            const userProfile = await this.getProfile();
            const { schoolId, country } = userProfile;

            return {
                id: genId(),
                schoolId,
                country,
                subject: Subject.SUBJECT_ENGLISH,
                iconUrl: '',
            };
        } catch (err) {
            throw Error(`getContentBasic: ${err}`);
        }
    };

    /**
     * get timezone of site
     * @returns {Promise<void>} instruction func
     */
    getTimezone = async (): Promise<Timezone> => {
        const timezoneJson = await this.getLocalStorage('manabie_TIMEZONE');
        const timezone: Timezone = JSON.parse(timezoneJson);

        return timezone;
    };

    /**
     * @example selectAButtonByAriaLabel("Create")
     *
     * click on a button find by aria-label
     * @param ariaLabel aria-label attr
     * @param options parent-selector attr
     * @returns {Promise<void>} instruction func
     */
    selectAButtonByAriaLabel = async (
        ariaLabel: string,
        options?: { onClickTimes?: number; parentSelector?: string }
    ) => {
        const page = this.page!;

        await this.instruction(
            `School admin clicks ${ariaLabel} button`,
            async function (this: CMSInterface) {
                const wrapper = await page.waitForSelector(options?.parentSelector || 'body');

                const button = await wrapper.waitForSelector(`button[aria-label="${ariaLabel}"]`);
                await button.scrollIntoViewIfNeeded();

                if (options?.onClickTimes && options?.onClickTimes > 1) {
                    for (let number = 0; number < options?.onClickTimes; number++) {
                        await button.click();
                    }
                } else {
                    await button.click();
                }
            }
        );
    };

    /**
     * we have [data-testid="Create"]
     * @example selectElementByDataTestId("Create")
     *
     * click on element by data-testid
     * @param dataTestId data-testid attr
     * @returns {Promise<void>} instruction func
     */
    selectElementByDataTestId = async (dataTestId: string) => {
        const page = this.page!;

        if (!dataTestId.includes('data-testid')) {
            dataTestId = `[data-testid='${dataTestId}']`;
        }

        await this.instruction(
            `School admin selects an element with ${dataTestId}`,
            async function () {
                await page.click(dataTestId);
            }
        );
    };

    /**
     * we have [data-value="some-table-id"]
     * @example selectElementByDataValue("some-table-id")
     *
     * click on element by data-value
     * @param dataValue data-value attr
     * @returns {Promise<void>} instruction func
     */
    selectElementByDataValue = async (dataValue: string) => {
        const page = this.page!;
        await this.instruction(
            `School admin selects an element with ${dataValue}`,
            async function () {
                await page.click(`[data-value='${dataValue}']`);
            }
        );
    };

    /**
     * @example selectActionButton('Rename', { target: 'moreAction'; wrapper: `[data-testid="LOAndAssignmentItem__root"]`})
     * @example selectActionButton('Download', { target: 'actionPanelTrigger'; wrapper: `[data-testid="BookTab__root"]`})
     * @example selectActionButton('Add')
     *
     * select action button: moreAction, actionPanelTrigger, action button by aria-label (with wrapper of button) then click action option on dropdown list
     * @param action: ActionOptions - action name by aria-label
     * @param options?: {target?: ActionButtonType; wrapperSelector?: string, suffix?: string } target: action button type or button by aria-label, wrapperSelector: avoid having many action buttons on the same screen
     * @property {string} options?.suffix to click action button base on the layout: :right-of(:has-text("Sign-in"))
     * @returns {Promise<void>} instruction func
     */
    selectActionButton = async (action: ActionOptions, options?: SelectActionOptions) => {
        const page = this.page!;

        await this.instruction(
            `School admin selects ${action} in ${options?.target} button`,
            async function () {
                switch (options?.target) {
                    case 'moreAction': {
                        const selector = getActionButtonSelector(options, moreActionButton);
                        await page.click(selector);
                        await page.click(`${moreActionAction}[aria-label="${action}"]`);
                        break;
                    }
                    case 'actionPanelTrigger': {
                        const selector = getActionButtonSelector(options, actionPanelTriggerButton);
                        await page.click(selector);
                        await page.click(`[role="menuitem"][aria-label="${action}"]`);
                        break;
                    }
                    default: {
                        await page.click(`button[aria-label="${action}"]`);
                        break;
                    }
                }
            }
        );
    };

    /**
     * @example selectMenuItemInSidebarByAriaLabel("Course")
     *
     * select menu item of sidebar by aria-label
     * @param ariaLabel aria-label attr
     * @returns {Promise<void>} instruction func
     */
    selectMenuItemInSidebarByAriaLabel = async (ariaLabel: string) => {
        const page = this.page!;

        await this.instruction(
            `School admin selects menu item ${ariaLabel} in sidebar`,
            async function () {
                await page.click(`[data-testid="MenuItemLink__root"][aria-label="${ariaLabel}"]`);
            }
        );
    };

    /**
     * @example selectElementWithinWrapper('[role="dialog"]', '[data-testid="Confirm__ok"]', {text: 'Warning'});
     *
     * select an element within wrapper (has text inside wrapper)
     * @param wrapperSelector
     * @param elementSelector
     * @param options?: { text?: string } text inside wrapper
     * @returns {Promise<void>} instruction func
     */
    selectElementWithinWrapper = async (
        wrapperSelector: string,
        elementSelector: string,
        options?: { text?: string }
    ) => {
        const page = this.page!;
        const self = this;
        const textWrapper = options?.text ? `has text ${options?.text}` : '';

        await this.instruction(
            `School admin selects ${elementSelector} within ${wrapperSelector} ${textWrapper}`,
            async function () {
                if (options?.text) {
                    const wrapperWithText = await self.waitForSelectorHasText(
                        wrapperSelector,
                        options.text
                    );

                    await (await wrapperWithText.waitForSelector(elementSelector)).click();
                } else {
                    const wrapper = await page.waitForSelector(wrapperSelector);

                    await (await wrapper.waitForSelector(elementSelector)).click();
                }
            }
        );
    };

    /**
     * @html <div aria-label='Create'>Create Account</div>
     * @example waitForSelectorWithText([aria-label='Create'], 'Create Account')
     *
     * find a selector with text context
     * @param selector {@link https://playwright.dev/docs/selectors/}
     * @param value
     * @returns {Promise<ElementHandle<SVGElement | HTMLElement>>} {@link https://playwright.dev/docs/api/class-elementhandle/}
     */
    waitForSelectorWithText = async (
        selector: string,
        value: string
    ): Promise<ElementHandle<SVGElement | HTMLElement>> => {
        const page = this.page!;
        const element = await page.waitForSelector(`${selector}:text-is("${value}")`);

        return element;
    };

    /**
     * @html <div data-testid='Appbar'><span data-testid='Appbar__username'>Manabie Admin</span></div>
     * @example waitForSelectorHasText([aria-label='Appbar'], 'Manabie Admin')
     *
     *
     * find a selector with text inside
     * @param selector {@link https://playwright.dev/docs/selectors/}
     * @param value
     * @returns {Promise<ElementHandle<SVGElement | HTMLElement>>} {@link https://playwright.dev/docs/api/class-elementhandle/}
     */
    waitForSelectorHasText = async (
        selector: string,
        value: string
    ): Promise<ElementHandle<SVGElement | HTMLElement>> => {
        const page = this.page!;
        const element = await page.waitForSelector(`${selector}:has-text("${value}")`);

        return element;
    };

    /**
     * @html <div data-testid='Appbar'><span data-testid='Appbar__username'>Manabie Admin</span></div>
     * @example waitForSelectorHasTextWithOptions([aria-label='Appbar'], 'Manabie Admin', { state: 'hidden' })
     *
     *
     * find a selector with text inside
     * @param selector {@link https://playwright.dev/docs/selectors/}
     * @param value
     * @param options
     * @returns {Promise<ElementHandle<SVGElement | HTMLElement>>} {@link https://playwright.dev/docs/api/class-elementhandle/}
     */
    waitForSelectorHasTextWithOptions = async (
        selector: string,
        value: string,
        options: Parameters<Page['waitForSelector']>[1]
    ): Promise<ElementHandle<SVGElement | HTMLElement> | null> => {
        const page = this.page!;
        const element = await page.waitForSelector(`${selector}:has-text("${value}")`, options);

        return element;
    };

    /**
     *
     * @html <div data-testid='Appbar'><</div>
     * @example waitForDataTestId('Appbar')
     *
     * @param dataTestId
     * @returns {Promise<ElementHandle<SVGElement | HTMLElement>>}  {@link https://playwright.dev/docs/api/class-elementhandle/}
     */
    waitForDataTestId = async (
        dataTestId: string
    ): Promise<ElementHandle<SVGElement | HTMLElement>> => {
        const page = this.page!;
        const element = await page.waitForSelector(`[data-testid="${dataTestId}"]`);

        return element;
    };

    /**
     *
     * @html <div data-value='Appbar'><</div>
     * @example waitForDataValue('Appbar')
     *
     * @param dataValue
     * @returns {Promise<ElementHandle<SVGElement | HTMLElement>>}  {@link https://playwright.dev/docs/api/class-elementhandle/}
     */
    waitForDataValue = async (
        dataValue: string
    ): Promise<ElementHandle<SVGElement | HTMLElement>> => {
        const page = this.page!;
        const element = await page.waitForSelector(`[data-value='${dataValue}']`);

        return element;
    };

    /**
     * assert title page in appbar
     * @example assertThePageTitle("Lesson Management")
     *
     * @param title
     * @returns {Promise<void>} instruction func
     */
    assertThePageTitle = async (title: string) => {
        const self = this;

        await this.instruction(
            `School admin asserts the title ${title} of a page`,
            async function () {
                await self.waitForSelectorWithText(`[aria-label="title"]`, title);
            }
        );
    };

    /**
     * assert title of a dialog
     * @example assertTheDialogTitleByDataTestId('DialogWithHeaderFooter__dialogTitle', 'Add Course')
     *
     * @param dataTestId
     * @param title
     * @returns {Promise<void>} instruction func
     */
    async assertTheDialogTitleByDataTestId(dataTestId: string, title: string) {
        await this.instruction(
            `School admin asserts the title ${title} of a dialog`,
            async function (cms) {
                await cms.waitForSelectorHasText(`[data-testid="${dataTestId}"]`, title);
            }
        );
    }

    /**
     * assert message notification
     * @example assertNotification('You have updated book successfully')
     *
     * @param message
     * @returns {Promise<void>} instruction func
     */
    assertNotification = async (message: string) => {
        const page = this.page!;

        await this.instruction(`School admin asserts the message ${message}`, async function () {
            await page.waitForSelector(`[role='alert']${snackbarContent}:has-text("${message}")`);
        });
    };

    /**
     * assert message notification
     * @example closeSnackbar()
     *
     * @returns {Promise<void>} instruction func
     */
    closeSnackbar = async () => {
        const page = this.page!;

        await this.instruction(`close snackbar`, async function () {
            await page.click(`[role='alert']${snackbarContent} button[aria-label='Close']`);
        });
    };

    /**
     * wait for skeleton loading hidden
     * @returns {Promise<void>} instruction func
     */
    waitForSkeletonLoading = async () => {
        const page = this.page!;

        const skeletonSelector = '.Manaverse-MuiSkeleton-pulse';

        await this.instruction('School admin is waiting to load skeleton', async function () {
            await page.waitForSelector(skeletonSelector, {
                state: 'hidden',
            });
        });
    };

    /**
     * wait for progress bar hidden
     *
     * @returns {Promise<void>} instruction func
     */
    waitingForProgressBar = async () => {
        const page = this.page!;

        const loadingProgressBarSelector = "[role='progressbar'][aria-hidden='false']";

        await this.instruction('School admin is waiting to load progress bar', async function () {
            await page.waitForSelector(loadingProgressBarSelector, {
                state: 'hidden',
            });
        });
    };

    /**
     * wait for loading icon hidden
     *
     * @returns {Promise<void>} instruction func
     */
    waitingForLoadingIcon = async () => {
        const page = this.page!;

        const loadingIconSelector = "[data-testid='Loading__root']";

        await this.instruction('School admin is waiting to load icon', async function () {
            await page.waitForSelector(loadingIconSelector, {
                state: 'hidden',
            });
        });
    };

    /**
     * wait for load more hidden
     *
     * @returns {Promise<void>} instruction func
     */
    waitingForLoadMoreButton = async () => {
        const page = this.page!;

        const loadingButtonSelector = "[data-testid='LoadMoreButton__loading']";

        await this.instruction('School admin is waiting to load more button', async function () {
            await page.waitForSelector(loadingButtonSelector, {
                state: 'hidden',
            });
        });
    };

    /**
     * wait for loading a auto complete hidden
     *
     * @param dataTestId
     * @returns {Promise<void>} instruction func
     */
    waitingAutocompleteLoading = async (dataTestId = '') => {
        const page = this.page!;

        const autocompleteSelector = `${dataTestId}[data-testid='AutocompleteBase__loading']`;

        await this.instruction('School admin is waiting to load autocomplete', async function () {
            await page.waitForSelector(autocompleteSelector, {
                state: 'hidden',
            });
        });
    };

    /**
     *
     * @param endpointOrPredicate enpoint or predicate
     * @param options
     * @returns {Promise<void>} instruction func
     */
    waitForGRPCResponse = async (
        endpointOrPredicate: string | ((response: Response) => boolean | Promise<boolean>),
        options?: Parameters<Page['waitForResponse']>[1]
    ): ReturnType<Page['waitForResponse']> => {
        const page = this.page!;

        if (typeof endpointOrPredicate === 'function') {
            // Instruction for this function without screenshot
            await this.attach(
                `Waiting for a response from gRPC endpoint ${endpointOrPredicate.name}`
            );

            return page.waitForResponse(endpointOrPredicate, options);
        }

        // Instruction for this function without screenshot
        await this.attach(
            `Waiting for a response from gRPC endpoint ${gRPCEndpoint}/${endpointOrPredicate}`
        );

        return page.waitForResponse((response) => {
            return (
                response &&
                response.request().method() === 'POST' &&
                response.url() === `${gRPCEndpoint}/${endpointOrPredicate}` &&
                response.ok()
            );
        }, options);
    };

    /**
     *
     * @param queryName The hasura query name need waitForResponse
     * @param options The parameter of waitForResponse
     * @returns The object contain the request and response information of the query
     */
    waitForHasuraResponse = async (
        queryName: string,
        options?: Parameters<Page['waitForResponse']>[1]
    ) => {
        const page = this.page!;

        const graphqlUrls = [
            GRAPHQL_SCHEMA_URL_BOB,
            GRAPHQL_SCHEMA_URL_FATIMA,
            GRAPHQL_SCHEMA_URL_EUREKA,
        ];

        try {
            const result = await page.waitForResponse(async (response) => {
                if (!graphqlUrls.includes(response.url())) return false;

                if (response.status() !== 200) throw new Error('Query status not success');

                const payload = await response.request().postDataJSON();
                if (!payload) throw new Error('Query name not found.');

                const entityName = sliceQueryNameFromGqlBody(payload.query);

                return entityName === `query${queryName}`;
            }, options);

            const payload = await result.request().postDataJSON();
            const dataJson = await result.json();

            return { req: payload, resp: dataJson };
        } catch (error: any) {
            console.log('[Hasura errors]', error);
            throw new Error(error);
        }
    };

    /**
     * choose option in auto complete dropdown list by text
     * @param text
     * @returns {Promise<void>} void
     */
    chooseOptionInAutoCompleteBoxByText = async (text: string) => {
        return await this.page!.click(`[role='listbox'] li:has-text("${text}")`, {
            force: true,
        });
    };

    /**
     * choose option in auto complete dropdown list by exact text
     * @param text
     * @returns {Promise<void>} void
     */
    chooseOptionInAutoCompleteBoxByExactText = async (text: string): Promise<void> => {
        return await this.page!.click(`[role='listbox'] li :text-is("${text}")`);
    };

    /**
     * choose option in auto complete dropdown list by order
     * @param nth
     * @returns {Promise<void>} void
     */
    chooseOptionInAutoCompleteBoxByOrder = async (nth: number) => {
        return await this.page!.click(`[role='listbox'] li:nth-child(${nth})`, {
            force: true,
        });
    };

    /**
     * choose option in auto complete dropdown list by data value
     * @param dataValue data value
     * @returns {Promise<void>} void
     */
    chooseOptionInAutoCompleteBoxByDataValue = async (dataValue: string) => {
        return await this.page!.click(`[role='listbox'] [data-value="${dataValue}"]`);
    };

    /**
     *
     * @param description
     * @param fn
     * @returns {Promise<void>} void
     */
    instruction = async (
        description: string,
        fn: (context: CMSInterface) => Promise<void>
    ): Promise<void> => {
        return await this.instructionDriver<CMSInterface>(description, fn);
    };

    /**
     *
     * @example schoolAdminIsOnThePage("Notification", "Notification Management")
     *
     * @param menu
     * @param title
     * @returns {Promise<void>} void
     */
    schoolAdminIsOnThePage = async (menu: Menu, title: string) => {
        await this.selectMenuItemInSidebarByAriaLabel(menu);
        await this!.assertThePageTitle(title);
    };

    /**
     *
     * get value of input field
     * ]
     * @param selector
     * @returns {Promise<string>} value of input field
     */
    getValueOfInput = async (selector: string): Promise<string> => {
        return this.page!.$eval(selector, (el: HTMLInputElement) => el.value);
    };

    // Action buttons for dialogs

    /**
     *
     * click confirm in dialogs
     * @returns {void}
     */
    confirmDialogAction = async () => {
        const dialogActionsSection = await this.page!.waitForSelector(dialogActions);
        const saveButton = await dialogActionsSection.waitForSelector(saveDialogButton);
        await saveButton.click();
    };

    /**
     *
     * click cancel in dialogs
     * @returns {void}
     */
    cancelDialogAction = async () => {
        const dialogActionsSection = await this.page!.waitForSelector(dialogActions);
        const cancelButton = await dialogActionsSection.waitForSelector(cancelDialogButton);
        await cancelButton.click();
    };

    /**
     *
     * click close in dialogs
     * @returns {void}
     */
    closeDialogAction = async () => {
        await this.selectElementByDataTestId(closeDialogButton);
    };

    /**
     *
     * upload attachment files on UI
     * @param filePaths as a string for 1 file or string[] for multiple files
     * @param fileTypes that accepted in input element
     * @param testid to input testid other than "UploadInput__inputFile"
     * @param scenario as scenario context for setting aliases
     * @returns {Promise<void>} instruction func
     */
    uploadAttachmentFiles = async (
        filePaths: string | string[],
        fileTypes?: FileTypes,
        testid?: string,
        scenario?: ScenarioContext
    ) => {
        await this.instruction(`School admin uploads ${filePaths}`, async function (cms) {
            const types = fileTypes ?? FileTypes.ALL;
            let fileNames: string | string[] = '';

            const arrayFilePaths: string[] =
                typeof filePaths === 'string' ? [filePaths] : filePaths;

            fileNames = (arrayFilePaths || []).map((filePath) =>
                filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length)
            );

            const dataTestId = testid ?? 'UploadInput__inputFile';

            await cms.page!.setInputFiles(
                `input[data-testid="${dataTestId}"][accept="${types}"]`,
                filePaths
            );

            scenario?.set(aliasAttachmentFileNames, fileNames);
        });
    };

    /**
     *
     * assert attachment file on UI
     * @param scenario as scenario context for setting aliases
     * @returns {Promise<void>} instruction func
     */
    assertAttachmentFiles = async (scenario: ScenarioContext) => {
        await this.instruction(`Assert uploaded attachment`, async function (cms) {
            const attachmentFileNames = scenario.get<string | string[]>(aliasAttachmentFileNames);

            const arrayFileNames: string[] =
                typeof attachmentFileNames === 'string'
                    ? [attachmentFileNames]
                    : attachmentFileNames;

            arrayFileNames.map(async (fileName) => {
                await cms.page?.waitForSelector(fileChipName(toShortenStr(fileName, 20)));
            });
        });
    };

    /**
     *
     * assert text on UI
     * @param selector {@link https://playwright.dev/docs/selectors/}
     * @param value
     * @returns {Promise<ElementHandle<SVGElement | HTMLElement>>}  {@link https://playwright.dev/docs/api/class-elementhandle/}
     */
    assertTypographyWithTooltip = async (
        selector: string,
        value: string
    ): Promise<ElementHandle<SVGElement | HTMLElement>> => {
        const page = this.page!;

        const selectorFindType = `${selector}:text-is("${value}")`;

        const isExisted = await page.$(selectorFindType);

        if (isExisted) {
            return await page.waitForSelector(selectorFindType);
        } else {
            return await page.waitForSelector(`${selector}[title="${value}"]`);
        }
    };

    /**
     *
     * select month and day in datepicker
     * @param day the day is selected
     * @param monthDiff the different day, used to select month
     * @param datePickerSelector the data-testid of datepicker input, used to click datepicker
     * @param elementSelector the element of datepicker input, used to click datepicker
     * @returns {Promise<Date>} // return type
     */
    selectDatePickerMonthAndDay = async ({
        day,
        monthDiff,
        datePickerSelector,
        elementSelector,
    }: SelectDatePickerParams): Promise<Date> => {
        const page = this.page!;
        let result: Date = new Date();

        const expectedMonth = getExpectedMonthFromMonthDiff(monthDiff);

        await openDatePickerDialog(this, datePickerSelector, elementSelector);

        await this.instruction(
            `Select datepicker date ${expectedMonth}/${day}`,
            async function (cms) {
                const isPrev = monthDiff < 0;

                for (let i = 0; i < Math.abs(monthDiff); i++) {
                    await goToPrevOrNextMonth(cms, isPrev);
                }

                await selectDateInDatePicker(cms, day);

                const fullDateElement = await page.waitForSelector(calendarFullDateField);

                const fullDateStr = await fullDateElement.innerText();

                result = new Date(fullDateStr);

                await clickOnOkButtonOnDatePickerFooter(cms);
            }
        );

        return result;
    };
    /**
     * clear the autocomplete inputs
     * @param autocompleteInputSelectors the array of HF selector you want to clear
     * @returns {Promise<void>} instruction function
     */
    clearListAutoCompleteInput = async (autocompleteInputSelectors: string[]): Promise<void> => {
        const page = this.page!;

        await this.instruction(
            `Clearing the autocomplete inputs: ${autocompleteInputSelectors}`,
            async function () {
                for (const selector of autocompleteInputSelectors) {
                    await page.click(`${selector} input`);
                    await page.click(`${selector} button[title='Clear']`);
                }
            }
        );
    };
    /**
     * select tab list item by tab name
     * @param tabName tab name of item in tab list
     * @returns {Promise<void>} instruction function
     */
    waitForTabListItem = async (
        tabName: string
    ): Promise<ElementHandle<SVGElement | HTMLElement>> => {
        const page = this.page!;

        const tabItem = await page.waitForSelector(
            `[role="tablist"] button[data-testid="Tab"]:has-text("${tabName}")`
        );
        return tabItem;
    };

    /**
     * select tab button by text
     * @param selector selector of tab name
     * @param textTitle title of tab name
     * @returns {Promise<void>} instruction function
     */
    selectTabButtonByText = async (selector: string, textTitle: string): Promise<void> => {
        const page = this.page!;
        await this.instruction(
            `School admin clicks and goes to tab ${textTitle}`,
            async function () {
                const element = await page.waitForSelector(selector);
                await (await element.waitForSelector(`button:has-text("${textTitle}")`)).click();
            }
        );
    };

    /**
     * @param text keyword need to search
     * @param shouldEnter press enter
     * @returns {Promise<void>} instruction function
     */
    searchInFilter = async (text: string, shouldEnter = true): Promise<void> => {
        const page = this.page!;
        await this.instruction(`School admin search ${text}`, async function () {
            const inputElement = await page.$(formFilterAdvancedTextFieldSearchInput);
            if (!inputElement) {
                const errMsg = `Can't get filter input selector ${formFilterAdvancedTextFieldSearchInput}`;
                throw Error(errMsg);
            }

            await inputElement.type(text);

            if (shouldEnter) await inputElement.press('Enter');
        });
    };

    /**
     *
     *
     * @param {string} selector
     * @return {*}  {(Promise<string | null>)}
     * @memberof CMS
     */
    getTextContentElement = async (selector: string): Promise<string | null> => {
        const page = this.page!;
        const element = await page.waitForSelector(selector);
        const text = await element.textContent();
        return text;
    };

    /**
     *
     *
     * @param {string} selector
     * @return {*}  {(Promise<string | null>)}
     * @memberof CMS
     */
    getTextContentMultipleElements = async (selector: string): Promise<(string | null)[]> => {
        const page = this.page!;

        const elements = await page.$$(selector);

        if (!elements) throw new Error('Not found rows in table');

        const textContents = await Promise.all(elements.map((element) => element.textContent()));

        return textContents;
    };

    /**
     *
     * import Location Master Data
     * @returns {Promise<void>} void
     */
    importLocationData = async (): Promise<void> => {
        const cmsToken = await this.getToken();

        await this.attach('School admin imports location-type master data');
        await retry(
            async function () {
                await BobImportService.importBobData(cmsToken, MasterCategory.LocationType);
            },
            { retries: 2, delay: 1000 }
        ).catch(function (reason) {
            throw Error(`Import location-type master data failed: ${JSON.stringify(reason)}`);
        });

        await this.attach('School admin imports location master data');
        await retry(
            async function () {
                await BobImportService.importBobData(cmsToken, MasterCategory.Location);
            },
            { retries: 2, delay: 1000 }
        ).catch(function (reason) {
            throw Error(`Import location master data failed: ${JSON.stringify(reason)}`);
        });
    };
}
