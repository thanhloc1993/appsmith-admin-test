# Class: Teacher

[teacher-world](../wiki/teacher-world).Teacher

## Hierarchy

- `AbstractDriver`

  ↳ **`Teacher`**

## Implements

- `TeacherInterface`

## Table of contents

### Constructors

- [constructor](../wiki/teacher-world.Teacher#constructor)

### Properties

- [attach](../wiki/teacher-world.Teacher#attach)
- [browser](../wiki/teacher-world.Teacher#browser)
- [context](../wiki/teacher-world.Teacher#context)
- [driverName](../wiki/teacher-world.Teacher#drivername)
- [flutterDriver](../wiki/teacher-world.Teacher#flutterdriver)
- [log](../wiki/teacher-world.Teacher#log)
- [origin](../wiki/teacher-world.Teacher#origin)
- [page](../wiki/teacher-world.Teacher#page)

### Methods

- [attachScreenshot](../wiki/teacher-world.Teacher#attachscreenshot)
- [connect](../wiki/teacher-world.Teacher#connect)
- [connectPlaywrightDriver](../wiki/teacher-world.Teacher#connectplaywrightdriver)
- [getAvatarUrl](../wiki/teacher-world.Teacher#getavatarurl)
- [getCourseList](../wiki/teacher-world.Teacher#getcourselist)
- [getProfile](../wiki/teacher-world.Teacher#getprofile)
- [getToken](../wiki/teacher-world.Teacher#gettoken)
- [getUserId](../wiki/teacher-world.Teacher#getuserid)
- [instruction](../wiki/teacher-world.Teacher#instruction)
- [instructionDriver](../wiki/teacher-world.Teacher#instructiondriver)
- [logout](../wiki/teacher-world.Teacher#logout)
- [quit](../wiki/teacher-world.Teacher#quit)
- [quitPlaywrightDriver](../wiki/teacher-world.Teacher#quitplaywrightdriver)
- [refreshCourseList](../wiki/teacher-world.Teacher#refreshcourselist)
- [setOffline](../wiki/teacher-world.Teacher#setoffline)
- [startTraceViewer](../wiki/teacher-world.Teacher#starttraceviewer)
- [stopTraceViewer](../wiki/teacher-world.Teacher#stoptraceviewer)
- [waitForConnection](../wiki/teacher-world.Teacher#waitforconnection)

## Constructors

### constructor

• **new Teacher**(`options`, `driverOptions`)

constructor

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `IWorldOptions` |
| `driverOptions` | `DriverOptions` |

#### Overrides

AbstractDriver.constructor

#### Defined in

[supports/teacher-world.ts:22](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/teacher-world.ts#L22)

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

TeacherInterface.attach

#### Inherited from

AbstractDriver.attach

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:52](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L52)

___

### browser

• `Optional` **browser**: `Browser`

#### Implementation of

TeacherInterface.browser

#### Inherited from

AbstractDriver.browser

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:46](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L46)

___

### context

• `Optional` **context**: `BrowserContext`

#### Implementation of

TeacherInterface.context

#### Inherited from

AbstractDriver.context

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:45](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L45)

___

### driverName

• **driverName**: `string` = `''`

#### Implementation of

TeacherInterface.driverName

#### Overrides

AbstractDriver.driverName

#### Defined in

[supports/teacher-world.ts:15](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/teacher-world.ts#L15)

___

### flutterDriver

• `Optional` **flutterDriver**: `FlutterDriver`

#### Implementation of

TeacherInterface.flutterDriver

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

TeacherInterface.log

#### Inherited from

AbstractDriver.log

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:53](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L53)

___

### origin

• **origin**: `string` = `''`

#### Implementation of

TeacherInterface.origin

#### Inherited from

AbstractDriver.origin

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:47](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L47)

___

### page

• `Optional` **page**: `Page`

#### Implementation of

TeacherInterface.page

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

TeacherInterface.attachScreenshot

#### Inherited from

AbstractDriver.attachScreenshot

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:213](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L213)

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

TeacherInterface.connect

#### Overrides

AbstractDriver.connect

#### Defined in

[supports/teacher-world.ts:31](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/teacher-world.ts#L31)

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

TeacherInterface.connectPlaywrightDriver

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

TeacherInterface.getAvatarUrl

#### Defined in

[supports/teacher-world.ts:84](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/teacher-world.ts#L84)

___

### getCourseList

▸ **getCourseList**(): `Promise`<`CourseListEntity`\>

#### Returns

`Promise`<`CourseListEntity`\>

get course list

#### Implementation of

TeacherInterface.getCourseList

#### Defined in

[supports/teacher-world.ts:120](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/teacher-world.ts#L120)

___

### getProfile

▸ **getProfile**(): `Promise`<`UserProfileEntity`\>

#### Returns

`Promise`<`UserProfileEntity`\>

get profile

#### Implementation of

TeacherInterface.getProfile

#### Defined in

[supports/teacher-world.ts:102](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/teacher-world.ts#L102)

___

### getToken

▸ **getToken**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

: get token

#### Implementation of

TeacherInterface.getToken

#### Defined in

[supports/teacher-world.ts:75](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/teacher-world.ts#L75)

___

### getUserId

▸ **getUserId**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

get user id

#### Implementation of

TeacherInterface.getUserId

#### Defined in

[supports/teacher-world.ts:93](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/teacher-world.ts#L93)

___

### instruction

▸ **instruction**(`description`, `fn`, `bufferScreenshot?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `description` | `string` |
| `fn` | (`learner`: `TeacherInterface`) => `Promise`<`void`\> |
| `bufferScreenshot?` | `string` \| `Buffer` |

#### Returns

`Promise`<`void`\>

: instruction

#### Implementation of

TeacherInterface.instruction

#### Defined in

[supports/teacher-world.ts:56](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/teacher-world.ts#L56)

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

TeacherInterface.instructionDriver

#### Inherited from

AbstractDriver.instructionDriver

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:191](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L191)

___

### logout

▸ **logout**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

logout

#### Implementation of

TeacherInterface.logout

#### Defined in

[supports/teacher-world.ts:132](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/teacher-world.ts#L132)

___

### quit

▸ **quit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

: quit

#### Implementation of

TeacherInterface.quit

#### Overrides

AbstractDriver.quit

#### Defined in

[supports/teacher-world.ts:67](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/teacher-world.ts#L67)

___

### quitPlaywrightDriver

▸ **quitPlaywrightDriver**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

TeacherInterface.quitPlaywrightDriver

#### Inherited from

AbstractDriver.quitPlaywrightDriver

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:175](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L175)

___

### refreshCourseList

▸ **refreshCourseList**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

refresh course list

#### Implementation of

TeacherInterface.refreshCourseList

#### Defined in

[supports/teacher-world.ts:112](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/teacher-world.ts#L112)

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

TeacherInterface.setOffline

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

TeacherInterface.startTraceViewer

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

TeacherInterface.stopTraceViewer

#### Inherited from

AbstractDriver.stopTraceViewer

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:247](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L247)

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

TeacherInterface.waitForConnection

#### Inherited from

AbstractDriver.waitForConnection

#### Defined in

[drivers/abstract-driver/abstract-driver.ts:72](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/drivers/abstract-driver/abstract-driver.ts#L72)
