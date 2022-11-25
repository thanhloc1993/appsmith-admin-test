# Code Review Comments

As you guys know, we try to work to build full end-to-end tests.
That is power quality can make our team stronger
This page collects common comments made during reviews so that a single detailed explanation can be referred to by shorthands.
This is a laundry list of common mistakes, not a comprehensive style guide.

* [Lint format](#lint-format)
* [Enforce to write docs for driver](#enforce-to-write-docs-for-driver)
* [Comment Sentences](#comment-sentences)
* [`this` keywords](#this-keywords)
* [Assert or Expect](#assert-or-expect)
* [Decode gRPC response](#decode-grpc-response)


## Lint format
Run `yarn format` on your code to automatically fix the majority of mechanical style issues

## Enforce to write docs for driver
We use [JSDoc format](https://jsdoc.app/) to write base docs for our driver: CMSWorld, LearnerWorld, TeacherWorld and ScenarioContext

After write a common function on driver, you should define JSDoc and generate a Wiki docs

```bash
make generate-docs
```

## Comment Sentences

Comments documenting declarations should be full sentences, even if that seems a little redundant.  This approach makes them format well when extracted into documentation.  Comments should begin with the name of the thing being described and end in a period `.`

```ts
// ScenarioContext represents a scenario to sharing data between steps.
export interface ScenarioContextInterface {
    context: Map<string, any>;
    set(key: string, value: any): ScenarioContextInterface['context'];
    get(key: string): any;
    has(key: any): boolean;
}
```

and so on.

## `this` keywords

Example: we declare a function to describe `school admin at login page on CMS`

should avoid using `call(this)` because we can not check TS and many magics going with `this`, in the future, we may suffer a lot of problems and implicit bugs.

```ts
export async function aSchoolAdminOnLoginPageCMS(this: CMSInterface): Promise<void> {
    await this.page!.waitForSelector("[data-testid='Login__form']");
    await findProfileButton(this, 'hidden');
}

....

await aSchoolAdminOnLoginPageCMS.call(this);
```

Should change to:
```ts
export async function aSchoolAdminOnLoginPageCMS(cms: CMSInterface): Promise<void> {
    await cms.page!.waitForSelector("[data-testid='Login__form']");
    await findProfileButton(this, 'hidden');
}

....

await aSchoolAdminOnLoginPageCMS(this);
```

## Assert or Expect

Maybe, you have meet or use these functions once before
`assert` and `expect` present different styles of performing assertions. Ultimately, they perform the same task


`assert` is provided by NodeJS. this package have a advantage is can add `customize message` to create a clarification message which `expect` doesn't have

But `expect` provide some utilities methods: greater than, array contains a element

About `customize message` which we can customize it by myself. Now it reside in `supports/packages/expect-with-message`. And customize it become a global variable with new naming is: `weExpect`

Example: please using this way with customize message 

```ts
weExpect('end-to-end', `this repository's name is end-to-end.`).toEqual('manabie.com')

// Message error
We expect this repository's name is end-to-end.

Expect: 'end-to-end'
Received: 'manabie.com'
```


instead of

```ts
weExpect('end-to-end').toEqual('manabie.com')

// Message error
Expect: 'end-to-end'
Received: 'manabie.com'
```
to when test failed we can understand this message is represented for what

## Decode gRPC response

Usage:

```ts
import { FinishUploadBrightcoveResponse } from "manabuf/yasuo/v1/brightcove_pb";
import createGrpcMessageDecoder from "./grpc-message-decoder";

const decoder = createGrpcMessageDecoder(
    FinishUploadBrightcoveResponse,
    "application/grpc-web-text" // headers content-type
);

const FinishUploadBrightcove = "AAAAAA=gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=";
const resp = decoder.decodeMessage(FinishUploadBrightcove);

console.log(resp!.toObject());
```

Example: You need to use intercept to get media_id after insert media in web

```ts
import createGrpcMessageDecoder from "./grpc-message-decoder";
import { UpsertMediaResponse } from "manabie-bob/class_pb";

cms.waitForResponse("manabie.bob.v1/UpsertMedia").then((resp) => {
    const decoder = createGrpcMessageDecoder(UpsertMediaResponse);

    console.log(decoder.decodeMessage(resp.response?.body)!.toObject());
});
```