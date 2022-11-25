# Class: Learner

[learner-world](../wiki/learner-world).Learner

## Hierarchy

- `AbstractDriver`

  ↳ **`Learner`**

## Implements

- `LearnerInterface`

## Table of contents

### Constructors

- [constructor](../wiki/learner-world.Learner#constructor)

### Properties

- [attach](../wiki/learner-world.Learner#attach)
- [browser](../wiki/learner-world.Learner#browser)
- [context](../wiki/learner-world.Learner#context)
- [deviceName](../wiki/learner-world.Learner#devicename)
- [driverName](../wiki/learner-world.Learner#drivername)
- [flutterDriver](../wiki/learner-world.Learner#flutterdriver)
- [log](../wiki/learner-world.Learner#log)
- [origin](../wiki/learner-world.Learner#origin)
- [page](../wiki/learner-world.Learner#page)

### Methods

- [attachScreenshot](../wiki/learner-world.Learner#attachscreenshot)
- [checkUserName](../wiki/learner-world.Learner#checkusername)
- [clickOnTab](../wiki/learner-world.Learner#clickontab)
- [connect](../wiki/learner-world.Learner#connect)
- [connectPlaywrightDriver](../wiki/learner-world.Learner#connectplaywrightdriver)
- [getAvatarUrl](../wiki/learner-world.Learner#getavatarurl)
- [getCourseList](../wiki/learner-world.Learner#getcourselist)
- [getKidsOfParent](../wiki/learner-world.Learner#getkidsofparent)
- [getProfile](../wiki/learner-world.Learner#getprofile)
- [getToken](../wiki/learner-world.Learner#gettoken)
- [getUserId](../wiki/learner-world.Learner#getuserid)
- [instruction](../wiki/learner-world.Learner#instruction)
- [instructionDriver](../wiki/learner-world.Learner#instructiondriver)
- [killAppOnWeb](../wiki/learner-world.Learner#killapponweb)
- [logout](../wiki/learner-world.Learner#logout)
- [openHomeDrawer](../wiki/learner-world.Learner#openhomedrawer)
- [prepareUploadAttachmentType](../wiki/learner-world.Learner#prepareuploadattachmenttype)
- [quit](../wiki/learner-world.Learner#quit)
- [quitPlaywrightDriver](../wiki/learner-world.Learner#quitplaywrightdriver)
- [setOffline](../wiki/learner-world.Learner#setoffline)
- [startTraceViewer](../wiki/learner-world.Learner#starttraceviewer)
- [stopTraceViewer](../wiki/learner-world.Learner#stoptraceviewer)
- [verifyAvatarInHomeScreen](../wiki/learner-world.Learner#verifyavatarinhomescreen)
- [waitForConnection](../wiki/learner-world.Learner#waitforconnection)

## Constructors

### constructor

• **new Learner**(`options`, `driverOptions`)

constructor

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `IWorldOptions` |
| `driverOptions` | `DriverOptions` |

#### Overrides

AbstractDriver.constructor

#### Defined in

[supports/learner-world.ts:26](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L26)

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

LearnerInterface.attach

#### Inherited from

AbstractDriver.attach

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:52](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L52)

___

### browser

• `Optional` **browser**: `Browser`

#### Implementation of

LearnerInterface.browser

#### Inherited from

AbstractDriver.browser

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:46](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L46)

___

### context

• `Optional` **context**: `BrowserContext`

#### Implementation of

LearnerInterface.context

#### Inherited from

AbstractDriver.context

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:45](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L45)

___

### deviceName

• `Optional` **deviceName**: `string`

#### Defined in

[supports/learner-world.ts:18](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L18)

___

### driverName

• **driverName**: `string` = `''`

#### Implementation of

LearnerInterface.driverName

#### Overrides

AbstractDriver.driverName

#### Defined in

[supports/learner-world.ts:19](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L19)

___

### flutterDriver

• `Optional` **flutterDriver**: `FlutterDriver`

#### Implementation of

LearnerInterface.flutterDriver

#### Inherited from

AbstractDriver.flutterDriver

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:43](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L43)

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

LearnerInterface.log

#### Inherited from

AbstractDriver.log

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:53](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L53)

___

### origin

• **origin**: `string` = `''`

#### Implementation of

LearnerInterface.origin

#### Inherited from

AbstractDriver.origin

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:47](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L47)

___

### page

• `Optional` **page**: `Page`

#### Implementation of

LearnerInterface.page

#### Inherited from

AbstractDriver.page

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:44](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L44)

## Methods

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

LearnerInterface.attachScreenshot

#### Inherited from

AbstractDriver.attachScreenshot

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:213](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L213)

___

### checkUserName

▸ **checkUserName**(`username`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `username` | `string` |

#### Returns

`Promise`<`void`\>

check username

#### Implementation of

LearnerInterface.checkUserName

#### Defined in

[supports/learner-world.ts:250](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L250)

___

### clickOnTab

▸ **clickOnTab**(`tabButtonKey`, `tabPageKey`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tabButtonKey` | `string` |
| `tabPageKey` | `string` |

#### Returns

`Promise`<`void`\>

click on tab

#### Implementation of

LearnerInterface.clickOnTab

#### Defined in

[supports/learner-world.ts:214](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L214)

___

### connect

▸ **connect**(`options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `ConnectOptions` |

#### Returns

`Promise`<`void`\>

: connect

#### Implementation of

LearnerInterface.connect

#### Overrides

AbstractDriver.connect

#### Defined in

[supports/learner-world.ts:35](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L35)

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

LearnerInterface.connectPlaywrightDriver

#### Inherited from

AbstractDriver.connectPlaywrightDriver

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:103](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L103)

___

### getAvatarUrl

▸ **getAvatarUrl**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

get avatar url

#### Implementation of

LearnerInterface.getAvatarUrl

#### Defined in

[supports/learner-world.ts:144](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L144)

___

### getCourseList

▸ **getCourseList**(): `Promise`<`CourseListEntity`\>

#### Returns

`Promise`<`CourseListEntity`\>

get course list

#### Implementation of

LearnerInterface.getCourseList

#### Defined in

[supports/learner-world.ts:290](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L290)

___

### getKidsOfParent

▸ **getKidsOfParent**(): `Promise`<`KidsOfParentEntity`\>

#### Returns

`Promise`<`KidsOfParentEntity`\>

{
  "$":"KidsOfParentModel",
  "kidsOfParent":[
     {
        "$":"Learner",
        "id":"",
        "createdAt":,
        "appleUserId":"",
        "facebookId":"",
        "name":"",
        "avatar":"",
        "userGroupEnum":"student"
     }
  ]
}

#### Implementation of

LearnerInterface.getKidsOfParent

#### Defined in

[supports/learner-world.ts:186](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L186)

___

### getProfile

▸ **getProfile**(): `Promise`<`UserProfileEntity`\>

#### Returns

`Promise`<`UserProfileEntity`\>

get profile

#### Implementation of

LearnerInterface.getProfile

#### Defined in

[supports/learner-world.ts:162](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L162)

___

### getToken

▸ **getToken**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

: get token

#### Implementation of

LearnerInterface.getToken

#### Defined in

[supports/learner-world.ts:122](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L122)

___

### getUserId

▸ **getUserId**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

get user id

#### Implementation of

LearnerInterface.getUserId

#### Defined in

[supports/learner-world.ts:153](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L153)

___

### instruction

▸ **instruction**(`description`, `fn`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `description` | `string` |
| `fn` | (`learner`: `LearnerInterface`) => `Promise`<`void`\> |

#### Returns

`Promise`<`void`\>

: instruction

#### Implementation of

LearnerInterface.instruction

#### Defined in

[supports/learner-world.ts:133](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L133)

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

LearnerInterface.instructionDriver

#### Inherited from

AbstractDriver.instructionDriver

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:191](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L191)

___

### killAppOnWeb

▸ **killAppOnWeb**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

: killing app on Web by go back home screen and refresh

#### Implementation of

LearnerInterface.killAppOnWeb

#### Defined in

[supports/learner-world.ts:313](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L313)

___

### logout

▸ **logout**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

logout

#### Implementation of

LearnerInterface.logout

#### Defined in

[supports/learner-world.ts:226](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L226)

___

### openHomeDrawer

▸ **openHomeDrawer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

open drawer in home screen

#### Implementation of

LearnerInterface.openHomeDrawer

#### Defined in

[supports/learner-world.ts:198](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L198)

___

### prepareUploadAttachmentType

▸ **prepareUploadAttachmentType**(`fileType`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileType` | `string` | as fileType of [image, video, pdf] |

#### Returns

`Promise`<`void`\>

prepare upload attachment type

#### Implementation of

LearnerInterface.prepareUploadAttachmentType

#### Defined in

[supports/learner-world.ts:302](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L302)

___

### quit

▸ **quit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

: quit

#### Implementation of

LearnerInterface.quit

#### Overrides

AbstractDriver.quit

#### Defined in

[supports/learner-world.ts:113](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L113)

___

### quitPlaywrightDriver

▸ **quitPlaywrightDriver**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

LearnerInterface.quitPlaywrightDriver

#### Inherited from

AbstractDriver.quitPlaywrightDriver

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:175](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L175)

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

LearnerInterface.setOffline

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

LearnerInterface.startTraceViewer

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

LearnerInterface.stopTraceViewer

#### Inherited from

AbstractDriver.stopTraceViewer

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:247](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L247)

___

### verifyAvatarInHomeScreen

▸ **verifyAvatarInHomeScreen**(`avatarUrl`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `avatarUrl` | `string` |

#### Returns

`Promise`<`void`\>

check avatar url in Home Screen

#### Implementation of

LearnerInterface.verifyAvatarInHomeScreen

#### Defined in

[supports/learner-world.ts:265](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/learner-world.ts#L265)

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

LearnerInterface.waitForConnection

#### Inherited from

AbstractDriver.waitForConnection

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:72](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L72)
