# Class: ScenarioContext

[scenario-context](../wiki/scenario-context).ScenarioContext

## Implements

- `ScenarioContextInterface`

## Table of contents

### Constructors

- [constructor](../wiki/scenario-context.ScenarioContext#constructor)

### Properties

- [context](../wiki/scenario-context.ScenarioContext#context)

### Methods

- [get](../wiki/scenario-context.ScenarioContext#get)
- [getByRegexKeys](../wiki/scenario-context.ScenarioContext#getbyregexkeys)
- [has](../wiki/scenario-context.ScenarioContext#has)
- [set](../wiki/scenario-context.ScenarioContext#set)

## Constructors

### constructor

• **new ScenarioContext**()

## Properties

### context

• **context**: `Map`<`string`, `any`\>

#### Implementation of

ScenarioContextInterface.context

#### Defined in

[supports/scenario-context.ts:4](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/scenario-context.ts#L4)

## Methods

### get

▸ **get**<`T`\>(`key`): `T`

get value from context

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`T`

T

#### Implementation of

ScenarioContextInterface.get

#### Defined in

[supports/scenario-context.ts:23](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/scenario-context.ts#L23)

___

### getByRegexKeys

▸ **getByRegexKeys**<`T`\>(`regexKey`): `T`[]

get values from context by regex keys

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `regexKey` | `string` |

#### Returns

`T`[]

any[]

#### Defined in

[supports/scenario-context.ts:32](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/scenario-context.ts#L32)

___

### has

▸ **has**(`key`): `boolean`

check key exist or not in context

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`boolean`

boolean

#### Implementation of

ScenarioContextInterface.has

#### Defined in

[supports/scenario-context.ts:47](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/scenario-context.ts#L47)

___

### set

▸ **set**(`key`, `value`): `Map`<`string`, `any`\>

set value to context

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `any` |

#### Returns

`Map`<`string`, `any`\>

: ScenarioContextInterface['context']

#### Implementation of

ScenarioContextInterface.set

#### Defined in

[supports/scenario-context.ts:12](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/scenario-context.ts#L12)
