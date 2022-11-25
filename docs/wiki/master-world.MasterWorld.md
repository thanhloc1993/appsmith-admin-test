# Class: MasterWorld

[master-world](../wiki/master-world).MasterWorld

## Hierarchy

- `World`

  ↳ **`MasterWorld`**

## Implements

- `IMasterWorld`

## Table of contents

### Constructors

- [constructor](../wiki/master-world.MasterWorld#constructor)

### Properties

- [attach](../wiki/master-world.MasterWorld#attach)
- [cms](../wiki/master-world.MasterWorld#cms)
- [counter](../wiki/master-world.MasterWorld#counter)
- [learner](../wiki/master-world.MasterWorld#learner)
- [learner2](../wiki/master-world.MasterWorld#learner2)
- [log](../wiki/master-world.MasterWorld#log)
- [parameters](../wiki/master-world.MasterWorld#parameters)
- [parent](../wiki/master-world.MasterWorld#parent)
- [parent2](../wiki/master-world.MasterWorld#parent2)
- [scenario](../wiki/master-world.MasterWorld#scenario)
- [teacher](../wiki/master-world.MasterWorld#teacher)
- [teacher2](../wiki/master-world.MasterWorld#teacher2)

## Constructors

### constructor

• **new MasterWorld**(`options`)

constructor

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `IWorldOptions` |

#### Overrides

World.constructor

#### Defined in

[supports/master-world.ts:31](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/master-world.ts#L31)

## Properties

### attach

• `Readonly` **attach**: `ICreateAttachment`

#### Inherited from

World.attach

#### Defined in

node_modules/@cucumber/cucumber/lib/support_code_library_builder/world.d.ts:14

___

### cms

• `Readonly` **cms**: [`CMS`](../wiki/cms-world.CMS)

#### Implementation of

IMasterWorld.cms

#### Defined in

[supports/master-world.ts:15](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/master-world.ts#L15)

___

### counter

• **counter**: `number` = `0`

#### Implementation of

IMasterWorld.counter

#### Defined in

[supports/master-world.ts:26](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/master-world.ts#L26)

___

### learner

• `Readonly` **learner**: [`Learner`](../wiki/learner-world.Learner)

#### Implementation of

IMasterWorld.learner

#### Defined in

[supports/master-world.ts:18](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/master-world.ts#L18)

___

### learner2

• `Readonly` **learner2**: [`Learner`](../wiki/learner-world.Learner)

#### Implementation of

IMasterWorld.learner2

#### Defined in

[supports/master-world.ts:19](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/master-world.ts#L19)

___

### log

• `Readonly` **log**: `ICreateLog`

#### Inherited from

World.log

#### Defined in

node_modules/@cucumber/cucumber/lib/support_code_library_builder/world.d.ts:15

___

### parameters

• `Readonly` **parameters**: `any`

#### Inherited from

World.parameters

#### Defined in

node_modules/@cucumber/cucumber/lib/support_code_library_builder/world.d.ts:16

___

### parent

• `Readonly` **parent**: [`Learner`](../wiki/learner-world.Learner)

#### Implementation of

IMasterWorld.parent

#### Defined in

[supports/master-world.ts:23](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/master-world.ts#L23)

___

### parent2

• `Readonly` **parent2**: [`Learner`](../wiki/learner-world.Learner)

#### Implementation of

IMasterWorld.parent2

#### Defined in

[supports/master-world.ts:24](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/master-world.ts#L24)

___

### scenario

• **scenario**: [`ScenarioContext`](../wiki/scenario-context.ScenarioContext)

#### Implementation of

IMasterWorld.scenario

#### Defined in

[supports/master-world.ts:25](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/master-world.ts#L25)

___

### teacher

• `Readonly` **teacher**: [`Teacher`](../wiki/teacher-world.Teacher)

#### Implementation of

IMasterWorld.teacher

#### Defined in

[supports/master-world.ts:16](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/master-world.ts#L16)

___

### teacher2

• `Readonly` **teacher2**: [`Teacher`](../wiki/teacher-world.Teacher)

#### Implementation of

IMasterWorld.teacher2

#### Defined in

[supports/master-world.ts:17](https://github.com/manabie-com/eibanam/blob/9ec4cf8a/supports/master-world.ts#L17)
