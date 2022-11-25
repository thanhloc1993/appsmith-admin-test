# Class: CMS

[cms-world](../wiki/cms-world).CMS

## Hierarchy

- `AbstractDriver`

  ↳ **`CMS`**

## Implements

- `CMSInterface`

## Table of contents

### Constructors

- [constructor](../wiki/cms-world.CMS#constructor)

### Properties

- [attach](../wiki/cms-world.CMS#attach)
- [browser](../wiki/cms-world.CMS#browser)
- [context](../wiki/cms-world.CMS#context)
- [driverName](../wiki/cms-world.CMS#drivername)
- [flutterDriver](../wiki/cms-world.CMS#flutterdriver)
- [graphqlClient](../wiki/cms-world.CMS#graphqlclient)
- [log](../wiki/cms-world.CMS#log)
- [origin](../wiki/cms-world.CMS#origin)
- [page](../wiki/cms-world.CMS#page)

### Methods

- [assertAttachmentFiles](../wiki/cms-world.CMS#assertattachmentfiles)
- [assertNotification](../wiki/cms-world.CMS#assertnotification)
- [assertTheDialogTitleByDataTestId](../wiki/cms-world.CMS#assertthedialogtitlebydatatestid)
- [assertThePageTitle](../wiki/cms-world.CMS#assertthepagetitle)
- [assertTypographyWithTooltip](../wiki/cms-world.CMS#asserttypographywithtooltip)
- [attachScreenshot](../wiki/cms-world.CMS#attachscreenshot)
- [cancelDialogAction](../wiki/cms-world.CMS#canceldialogaction)
- [chooseOptionInAutoCompleteBoxByOrder](../wiki/cms-world.CMS#chooseoptioninautocompleteboxbyorder)
- [chooseOptionInAutoCompleteBoxByText](../wiki/cms-world.CMS#chooseoptioninautocompleteboxbytext)
- [chooseOptionInAutoCompleteBoxByExactText](../wiki/cms-world.CMS#chooseoptioninautocompleteboxbyexacttext)
- [clearListAutoCompleteInput](../wiki/cms-world.CMS#clearlistautocompleteinput)
- [closeDialogAction](../wiki/cms-world.CMS#closedialogaction)
- [confirmDialogAction](../wiki/cms-world.CMS#confirmdialogaction)
- [connect](../wiki/cms-world.CMS#connect)
- [connectPlaywrightDriver](../wiki/cms-world.CMS#connectplaywrightdriver)
- [getContentBasic](../wiki/cms-world.CMS#getcontentbasic)
- [getLocalStorage](../wiki/cms-world.CMS#getlocalstorage)
- [getProfile](../wiki/cms-world.CMS#getprofile)
- [getTimezone](../wiki/cms-world.CMS#gettimezone)
- [getToken](../wiki/cms-world.CMS#gettoken)
- [getValueOfInput](../wiki/cms-world.CMS#getvalueofinput)
- [instruction](../wiki/cms-world.CMS#instruction)
- [instructionDriver](../wiki/cms-world.CMS#instructiondriver)
- [quit](../wiki/cms-world.CMS#quit)
- [quitPlaywrightDriver](../wiki/cms-world.CMS#quitplaywrightdriver)
- [schoolAdminIsOnThePage](../wiki/cms-world.CMS#schooladminisonthepage)
- [selectAButtonByAriaLabel](../wiki/cms-world.CMS#selectabuttonbyarialabel)
- [selectActionButton](../wiki/cms-world.CMS#selectactionbutton)
- [selectDatePickerMonthAndDay](../wiki/cms-world.CMS#selectdatepickermonthandday)
- [selectElementByDataTestId](../wiki/cms-world.CMS#selectelementbydatatestid)
- [selectElementWithinWrapper](../wiki/cms-world.CMS#selectelementwithinwrapper)
- [selectMenuItemInSidebarByAriaLabel](../wiki/cms-world.CMS#selectmenuiteminsidebarbyarialabel)
- [setOffline](../wiki/cms-world.CMS#setoffline)
- [startTraceViewer](../wiki/cms-world.CMS#starttraceviewer)
- [stopTraceViewer](../wiki/cms-world.CMS#stoptraceviewer)
- [uploadAttachmentFiles](../wiki/cms-world.CMS#uploadattachmentfiles)
- [waitForConnection](../wiki/cms-world.CMS#waitforconnection)
- [waitForDataTestId](../wiki/cms-world.CMS#waitfordatatestid)
- [waitForGRPCResponse](../wiki/cms-world.CMS#waitforgrpcresponse)
- [waitForHasuraResponse](../wiki/cms-world.CMS#waitforhasuraresponse)
- [waitForSelectorHasText](../wiki/cms-world.CMS#waitforselectorhastext)
- [waitForSelectorWithText](../wiki/cms-world.CMS#waitforselectorwithtext)
- [waitForSkeletonLoading](../wiki/cms-world.CMS#waitforskeletonloading)
- [waitingAutocompleteLoading](../wiki/cms-world.CMS#waitingautocompleteloading)
- [waitingForLoadMoreButton](../wiki/cms-world.CMS#waitingforloadmorebutton)
- [waitingForLoadingIcon](../wiki/cms-world.CMS#waitingforloadingicon)
- [waitingForProgressBar](../wiki/cms-world.CMS#waitingforprogressbar)

## Constructors

### constructor

• **new CMS**(`options`, `driverOptions`)

constructor

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `IWorldOptions` |
| `driverOptions` | `DriverOptions` |

#### Overrides

AbstractDriver.constructor

#### Defined in

[supports/cms-world.ts:63](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L63)

## Properties

### attach

• `Readonly` **attach**: (`data`: `string` \| `Buffer` \| `Readable`, `mediaType?`: `string`, `callback?`: () => `void`) => `void` \| `Promise`<`void`\>

#### Type declaration

▸ (`data`, `mediaType?`, `callback?`): `void` \| `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` \| `Buffer` \| `Readable` |
| `mediaType?` | `string` |
| `callback?` | () => `void` |

##### Returns

`void` \| `Promise`<`void`\>

#### Implementation of

CMSInterface.attach

#### Inherited from

AbstractDriver.attach

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:52](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L52)

___

### browser

• `Optional` **browser**: `Browser`

#### Implementation of

CMSInterface.browser

#### Inherited from

AbstractDriver.browser

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:46](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L46)

___

### context

• `Optional` **context**: `BrowserContext`

#### Implementation of

CMSInterface.context

#### Inherited from

AbstractDriver.context

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:45](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L45)

___

### driverName

• `Readonly` **driverName**: `string`

#### Implementation of

CMSInterface.driverName

#### Inherited from

AbstractDriver.driverName

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:48](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L48)

___

### flutterDriver

• `Optional` **flutterDriver**: `FlutterDriver`

#### Implementation of

CMSInterface.flutterDriver

#### Inherited from

AbstractDriver.flutterDriver

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:43](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L43)

___

### graphqlClient

• `Optional` **graphqlClient**: `GraphqlClient`

#### Implementation of

CMSInterface.graphqlClient

#### Defined in

[supports/cms-world.ts:56](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L56)

___

### log

• `Readonly` **log**: (`text`: `string`) => `void` \| `Promise`<`void`\>

#### Type declaration

▸ (`text`): `void` \| `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

##### Returns

`void` \| `Promise`<`void`\>

#### Implementation of

CMSInterface.log

#### Inherited from

AbstractDriver.log

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:53](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L53)

___

### origin

• **origin**: `string`

#### Implementation of

CMSInterface.origin

#### Overrides

AbstractDriver.origin

#### Defined in

[supports/cms-world.ts:55](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L55)

___

### page

• `Optional` **page**: `Page`

#### Implementation of

CMSInterface.page

#### Inherited from

AbstractDriver.page

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:44](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L44)

## Methods

### assertAttachmentFiles

▸ **assertAttachmentFiles**(`scenario`): `Promise`<`void`\>

assert attachment file on UI

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scenario` | [`ScenarioContext`](../wiki/scenario-context.ScenarioContext) | as scenario context for setting aliases |

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.assertAttachmentFiles

#### Defined in

[supports/cms-world.ts:694](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L694)

___

### assertNotification

▸ **assertNotification**(`message`): `Promise`<`void`\>

assert message notification

**`example`** assertNotification('You have updated book successfully')

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.assertNotification

#### Defined in

[supports/cms-world.ts:392](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L392)

___

### assertTheDialogTitleByDataTestId

▸ **assertTheDialogTitleByDataTestId**(`dataTestId`, `title`): `Promise`<`void`\>

assert title of a dialog

**`example`** assertTheDialogTitleByDataTestId('DialogWithHeaderFooter__dialogTitle', 'Add Course')

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataTestId` | `string` |
| `title` | `string` |

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.assertTheDialogTitleByDataTestId

#### Defined in

[supports/cms-world.ts:376](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L376)

___

### assertThePageTitle

▸ **assertThePageTitle**(`title`): `Promise`<`void`\>

assert title page in appbar

**`example`** assertThePageTitle("Lesson Management")

#### Parameters

| Name | Type |
| :------ | :------ |
| `title` | `string` |

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.assertThePageTitle

#### Defined in

[supports/cms-world.ts:357](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L357)

___

### assertTypographyWithTooltip

▸ **assertTypographyWithTooltip**(`selector`, `value`): `Promise`<`ElementHandle`<`SVGElement` \| `HTMLElement`\>\>

assert text on UI

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `string` | [https://playwright.dev/docs/selectors/](https://playwright.dev/docs/selectors/) |
| `value` | `string` |  |

#### Returns

`Promise`<`ElementHandle`<`SVGElement` \| `HTMLElement`\>\>

[https://playwright.dev/docs/api/class-elementhandle/](https://playwright.dev/docs/api/class-elementhandle/)

#### Implementation of

CMSInterface.assertTypographyWithTooltip

#### Defined in

[supports/cms-world.ts:716](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L716)

___

### attachScreenshot

▸ **attachScreenshot**(`bufferScreenshot?`): `Promise`<`void`\>

Attach screenshot

#### Parameters

| Name | Type |
| :------ | :------ |
| `bufferScreenshot?` | `string` \| `Buffer` |

#### Returns

`Promise`<`void`\>

void

#### Implementation of

CMSInterface.attachScreenshot

#### Inherited from

AbstractDriver.attachScreenshot

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:213](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L213)

___

### cancelDialogAction

▸ **cancelDialogAction**(): `Promise`<`void`\>

click cancel in dialogs

#### Returns

`Promise`<`void`\>

#### Implementation of

CMSInterface.cancelDialogAction

#### Defined in

[supports/cms-world.ts:636](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L636)

___

### chooseOptionInAutoCompleteBoxByOrder

▸ **chooseOptionInAutoCompleteBoxByOrder**(`nth`): `Promise`<`void`\>

choose option in auto complete dropdown list by order

#### Parameters

| Name | Type |
| :------ | :------ |
| `nth` | `number` |

#### Returns

`Promise`<`void`\>

void

#### Implementation of

CMSInterface.chooseOptionInAutoCompleteBoxByOrder

#### Defined in

[supports/cms-world.ts:575](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L575)

___

### chooseOptionInAutoCompleteBoxByText

▸ **chooseOptionInAutoCompleteBoxByText**(`text`): `Promise`<`void`\>

choose option in auto complete dropdown list by text

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`Promise`<`void`\>

void

#### Implementation of

CMSInterface.chooseOptionInAutoCompleteBoxByText

#### Defined in

[supports/cms-world.ts:564](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L564)

___

### chooseOptionInAutoCompleteBoxByExactText

▸ **chooseOptionInAutoCompleteBoxByExactText**(`text`): `Promise`<`void`\>

choose option in auto complete dropdown list by text

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`Promise`<`void`\>

void

#### Implementation of

CMSInterface.chooseOptionInAutoCompleteBoxByExactText

#### Defined in

[supports/cms-world.ts:564](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L595)

___
### clearListAutoCompleteInput

▸ **clearListAutoCompleteInput**(`autocompleteInputSelectors`): `Promise`<`void`\>

clear the autocomplete inputs

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `autocompleteInputSelectors` | `string`[] | the array of HF selector you want to clear |

#### Returns

`Promise`<`void`\>

instruction function

#### Implementation of

CMSInterface.clearListAutoCompleteInput

#### Defined in

[supports/cms-world.ts:781](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L781)

___

### closeDialogAction

▸ **closeDialogAction**(): `Promise`<`void`\>

click close in dialogs

#### Returns

`Promise`<`void`\>

#### Implementation of

CMSInterface.closeDialogAction

#### Defined in

[supports/cms-world.ts:647](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L647)

___

### confirmDialogAction

▸ **confirmDialogAction**(): `Promise`<`void`\>

click confirm in dialogs

#### Returns

`Promise`<`void`\>

#### Implementation of

CMSInterface.confirmDialogAction

#### Defined in

[supports/cms-world.ts:625](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L625)

___

### connect

▸ **connect**(`options`): `Promise`<`void`\>

connect

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `ConnectOptions` |

#### Returns

`Promise`<`void`\>

connect

#### Implementation of

CMSInterface.connect

#### Overrides

AbstractDriver.connect

#### Defined in

[supports/cms-world.ts:71](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L71)

___

### connectPlaywrightDriver

▸ **connectPlaywrightDriver**(`options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `AbstractDriverOptions` |

#### Returns

`Promise`<`void`\>

#### Implementation of

CMSInterface.connectPlaywrightDriver

#### Inherited from

AbstractDriver.connectPlaywrightDriver

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:103](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L103)

___

### getContentBasic

▸ **getContentBasic**(): `Promise`<`ContentBasic`\>

get base content to prepare data for content flow

#### Returns

`Promise`<`ContentBasic`\>

return base content

#### Implementation of

CMSInterface.getContentBasic

#### Defined in

[supports/cms-world.ts:134](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L134)

___

### getLocalStorage

▸ **getLocalStorage**(`key`): `Promise`<`string`\>

access local storage to get value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | local storage key |

#### Returns

`Promise`<`string`\>

value

#### Defined in

[supports/cms-world.ts:95](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L95)

___

### getProfile

▸ **getProfile**(): `Promise`<`CMSProfile`\>

get profile of user logged in to CMS

#### Returns

`Promise`<`CMSProfile`\>

CMSProfile

#### Implementation of

CMSInterface.getProfile

#### Defined in

[supports/cms-world.ts:120](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L120)

___

### getTimezone

▸ **getTimezone**(): `Promise`<`Timezone`\>

get timezone of site

#### Returns

`Promise`<`Timezone`\>

instruction func

#### Implementation of

CMSInterface.getTimezone

#### Defined in

[supports/cms-world.ts:155](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L155)

___

### getToken

▸ **getToken**(): `Promise`<`string`\>

get token of user logged in to CMS

#### Returns

`Promise`<`string`\>

token

#### Implementation of

CMSInterface.getToken

#### Defined in

[supports/cms-world.ts:111](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L111)

___

### getValueOfInput

▸ **getValueOfInput**(`selector`): `Promise`<`string`\>

get value of input field
]

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `string` |

#### Returns

`Promise`<`string`\>

value of input field

#### Implementation of

CMSInterface.getValueOfInput

#### Defined in

[supports/cms-world.ts:614](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L614)

___

### instruction

▸ **instruction**(`description`, `fn`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `description` | `string` |
| `fn` | (`context`: `CMSInterface`) => `Promise`<`void`\> |

#### Returns

`Promise`<`void`\>

void

#### Implementation of

CMSInterface.instruction

#### Defined in

[supports/cms-world.ts:587](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L587)

___

### instructionDriver

▸ **instructionDriver**<`T`\>(`description`, `fn`, `bufferScreenshot?`): `Promise`<`void`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `description` | `string` |
| `fn` | (`context`: `T`) => `Promise`<`void`\> |
| `bufferScreenshot?` | `string` \| `Buffer` |

#### Returns

`Promise`<`void`\>

void

#### Implementation of

CMSInterface.instructionDriver

#### Inherited from

AbstractDriver.instructionDriver

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:191](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L191)

___

### quit

▸ **quit**(): `Promise`<`void`\>

quit

#### Returns

`Promise`<`void`\>

close

#### Implementation of

CMSInterface.quit

#### Overrides

AbstractDriver.quit

#### Defined in

[supports/cms-world.ts:86](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L86)

___

### quitPlaywrightDriver

▸ **quitPlaywrightDriver**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

CMSInterface.quitPlaywrightDriver

#### Inherited from

AbstractDriver.quitPlaywrightDriver

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:175](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L175)

___

### schoolAdminIsOnThePage

▸ **schoolAdminIsOnThePage**(`menu`, `title`): `Promise`<`void`\>

**`example`** schoolAdminIsOnThePage("Notification", "Notification Management")

#### Parameters

| Name | Type |
| :------ | :------ |
| `menu` | `Menu` |
| `title` | `string` |

#### Returns

`Promise`<`void`\>

void

#### Implementation of

CMSInterface.schoolAdminIsOnThePage

#### Defined in

[supports/cms-world.ts:602](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L602)

___

### selectAButtonByAriaLabel

▸ **selectAButtonByAriaLabel**(`ariaLabel`, `parentSelector?`): `Promise`<`void`\>

**`example`** selectAButtonByAriaLabel("Create")

click on a button find by aria-label

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ariaLabel` | `string` | aria-label attr |
| `parentSelector?` | `string` | parent-selector attr |

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.selectAButtonByAriaLabel

#### Defined in

[supports/cms-world.ts:170](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L170)

___

### selectActionButton

▸ **selectActionButton**(`action`, `options?`): `Promise`<`void`\>

**`example`** selectActionButton('Rename', { target: 'moreAction'; wrapper: `[data-testid="LOAndAssignmentItem__root"]`})

**`example`** selectActionButton('Download', { target: 'actionPanelTrigger'; wrapper: `[data-testid="BookTab__root"]`})

**`example`** selectActionButton('Add')

select action button: moreAction, actionPanelTrigger, action button by aria-label (with wrapper of button) then click action option on dropdown list

**`property`** {string} options?.suffix to click action button base on the layout: :right-of(:has-text("Sign-in"))

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `ActionOptions` |
| `options?` | `SelectActionOptions` |

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.selectActionButton

#### Defined in

[supports/cms-world.ts:213](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L213)

___

### selectDatePickerMonthAndDay

▸ **selectDatePickerMonthAndDay**(`__namedParameters`): `Promise`<`Date`\>

select month and day in datepicker

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `SelectDatePickerParams` |

#### Returns

`Promise`<`Date`\>

// return type

#### Implementation of

CMSInterface.selectDatePickerMonthAndDay

#### Defined in

[supports/cms-world.ts:741](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L741)

___

### selectElementByDataTestId

▸ **selectElementByDataTestId**(`dataTestId`): `Promise`<`void`\>

we have [data-testid="Create"]

**`example`** selectElementByDataTestId("Create")

click on element by data-testid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dataTestId` | `string` | data-testid attr |

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.selectElementByDataTestId

#### Defined in

[supports/cms-world.ts:191](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L191)

___

### selectElementWithinWrapper

▸ **selectElementWithinWrapper**(`wrapperSelector`, `elementSelector`, `options?`): `Promise`<`void`\>

**`example`** selectElementWithinWrapper('[role="dialog"]', '[data-testid="Confirm__ok"]', {text: 'Warning'});

select an element within wrapper (has text inside wrapper)

#### Parameters

| Name | Type |
| :------ | :------ |
| `wrapperSelector` | `string` |
| `elementSelector` | `string` |
| `options?` | `Object` |
| `options.text?` | `string` |

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.selectElementWithinWrapper

#### Defined in

[supports/cms-world.ts:268](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L268)

___

### selectMenuItemInSidebarByAriaLabel

▸ **selectMenuItemInSidebarByAriaLabel**(`ariaLabel`): `Promise`<`void`\>

**`example`** selectMenuItemInSidebarByAriaLabel("Course")

select menu item of sidebar by aria-label

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ariaLabel` | `string` | aria-label attr |

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.selectMenuItemInSidebarByAriaLabel

#### Defined in

[supports/cms-world.ts:248](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L248)

___

### setOffline

▸ **setOffline**(`offline`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `offline` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Implementation of

CMSInterface.setOffline

#### Inherited from

AbstractDriver.setOffline

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:64](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L64)

___

### startTraceViewer

▸ `Protected` **startTraceViewer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

CMSInterface.startTraceViewer

#### Inherited from

AbstractDriver.startTraceViewer

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:237](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L237)

___

### stopTraceViewer

▸ `Protected` **stopTraceViewer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

CMSInterface.stopTraceViewer

#### Inherited from

AbstractDriver.stopTraceViewer

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:247](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L247)

___

### uploadAttachmentFiles

▸ **uploadAttachmentFiles**(`filePaths`, `fileTypes?`, `testid?`, `scenario?`): `Promise`<`void`\>

upload attachment files on UI

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filePaths` | `string` \| `string`[] | as a string for 1 file or string[] for multiple files |
| `fileTypes?` | `FileTypes` | that accepted in input element |
| `testid?` | `string` | to input testid other than "UploadInput__inputFile" |
| `scenario?` | [`ScenarioContext`](../wiki/scenario-context.ScenarioContext) | as scenario context for setting aliases |

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.uploadAttachmentFiles

#### Defined in

[supports/cms-world.ts:660](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L660)

___

### waitForConnection

▸ **waitForConnection**(`url`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`<`void`\>

connect

#### Implementation of

CMSInterface.waitForConnection

#### Inherited from

AbstractDriver.waitForConnection

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:72](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L72)

___

### waitForDataTestId

▸ **waitForDataTestId**(`dataTestId`): `Promise`<`ElementHandle`<`SVGElement` \| `HTMLElement`\>\>

**`html`** <div data-testid='Appbar'><</div>

**`example`** waitForDataTestId('Appbar')

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataTestId` | `string` |

#### Returns

`Promise`<`ElementHandle`<`SVGElement` \| `HTMLElement`\>\>

[https://playwright.dev/docs/api/class-elementhandle/](https://playwright.dev/docs/api/class-elementhandle/)

#### Implementation of

CMSInterface.waitForDataTestId

#### Defined in

[supports/cms-world.ts:343](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L343)

___

### waitForGRPCResponse

▸ **waitForGRPCResponse**(`endpointOrPredicate`, `options?`): `Promise`<`Response`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `endpointOrPredicate` | `string` \| (`response`: `Response`) => `boolean` \| `Promise`<`boolean`\> | enpoint or predicate |
| `options?` | `Object` |  |
| `options.timeout?` | `number` | Maximum wait time in milliseconds, defaults to 30 seconds, pass `0` to disable the timeout. The default value can be changed by using the [browserContext.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-timeout) or [page.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-timeout) methods. |

#### Returns

`Promise`<`Response`\>

instruction func

#### Implementation of

CMSInterface.waitForGRPCResponse

#### Defined in

[supports/cms-world.ts:491](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L491)

___

### waitForHasuraResponse

▸ **waitForHasuraResponse**(`queryName`, `options?`): `Promise`<`Object`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `queryName` | `string` | The hasura query name need waitForResponse |
| `options?` | `Object` | The parameter of waitForResponse |
| `options.timeout?` | `number` | Maximum wait time in milliseconds, defaults to 30 seconds, pass `0` to disable the timeout. The default value can be changed by using the [browserContext.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-browsercontext#browser-context-set-default-timeout) or [page.setDefaultTimeout(timeout)](https://playwright.dev/docs/api/class-page#page-set-default-timeout) methods. |

#### Returns

`Promise`<`Object`\>

The object contain the request and response information of the query

#### Implementation of

CMSInterface.waitForHasuraResponse

#### Defined in

[supports/cms-world.ts:523](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L523)

___

### waitForSelectorHasText

▸ **waitForSelectorHasText**(`selector`, `value`): `Promise`<`ElementHandle`<`SVGElement` \| `HTMLElement`\>\>

**`html`** <div data-testid='Appbar'><span data-testid='Appbar__username'>Manabie Admin</span></div>

**`example`** waitForSelectorHasText([aria-label='Appbar'], 'Manabie Admin')

find a selector with text inside

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `string` | [https://playwright.dev/docs/selectors/](https://playwright.dev/docs/selectors/) |
| `value` | `string` |  |

#### Returns

`Promise`<`ElementHandle`<`SVGElement` \| `HTMLElement`\>\>

[https://playwright.dev/docs/api/class-elementhandle/](https://playwright.dev/docs/api/class-elementhandle/)

#### Implementation of

CMSInterface.waitForSelectorHasText

#### Defined in

[supports/cms-world.ts:325](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L325)

___

### waitForSelectorWithText

▸ **waitForSelectorWithText**(`selector`, `value`): `Promise`<`ElementHandle`<`SVGElement` \| `HTMLElement`\>\>

**`html`** <div aria-label='Create'>Create Account</div>

**`example`** waitForSelectorWithText([aria-label='Create'], 'Create Account')

find a selector with text context

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `string` | [https://playwright.dev/docs/selectors/](https://playwright.dev/docs/selectors/) |
| `value` | `string` |  |

#### Returns

`Promise`<`ElementHandle`<`SVGElement` \| `HTMLElement`\>\>

[https://playwright.dev/docs/api/class-elementhandle/](https://playwright.dev/docs/api/class-elementhandle/)

#### Implementation of

CMSInterface.waitForSelectorWithText

#### Defined in

[supports/cms-world.ts:305](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L305)

___

### waitForSkeletonLoading

▸ **waitForSkeletonLoading**(): `Promise`<`void`\>

wait for skeleton loading hidden

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.waitForSkeletonLoading

#### Defined in

[supports/cms-world.ts:404](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L404)

___

### waitingAutocompleteLoading

▸ **waitingAutocompleteLoading**(`dataTestId`): `Promise`<`void`\>

wait for loading a auto complete hidden

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataTestId` | `string` |

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.waitingAutocompleteLoading

#### Defined in

[supports/cms-world.ts:473](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L473)

___

### waitingForLoadMoreButton

▸ **waitingForLoadMoreButton**(): `Promise`<`void`\>

wait for load more hidden

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.waitingForLoadMoreButton

#### Defined in

[supports/cms-world.ts:455](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L455)

___

### waitingForLoadingIcon

▸ **waitingForLoadingIcon**(): `Promise`<`void`\>

wait for loading icon hidden

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.waitingForLoadingIcon

#### Defined in

[supports/cms-world.ts:438](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L438)

___

### waitingForProgressBar

▸ **waitingForProgressBar**(): `Promise`<`void`\>

wait for progress bar hidden

#### Returns

`Promise`<`void`\>

instruction func

#### Implementation of

CMSInterface.waitingForProgressBar

#### Defined in

[supports/cms-world.ts:421](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/cms-world.ts#L421)
