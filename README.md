# Repo's idea

-   All js step's definitions staying `./features/step-definitions/` with squad name prefix and we will split 2 files: `*-steps.ts` and `*-definitions.ts`.
    -   `\*-steps.ts`: declare Given/When/Then steps with instructions (see example)
    -   `\*-definitions.ts`: define functions to working for a certain interactive
    
-   Scenarios staying `./features/<squad>`
- All keys/selector be declare in `step-definitions/cms-selectors`, `step-definitions/teacher-keys` and `step-definitions/learner-keys`

- Sample file: `./assets`
- Download folder `./downloads` will be ignore
- Report site: https://mana-e2e.web.app/

## Documentation

* [Code Review](./docs/CODEREVIEW.md)
* [Spelling Check](./.github/actions/spelling/README.md)
* [CMS World](./docs/CMSWorld.md)
* [BDD](./docs/BDD.md)
* [Flutter Mobile Appium E2E](./docs/flutter-mobile-appium-e2e.md)
* [Commit message](./docs/commit-message.md)

## Steps with Instructions Example
```ts
And('teacher logins with {string} email, {string} password and {string} organization', async function(
    username: string,
    password: string
): Promise<void> {
    const teacher = this.teacher.flutterDriver!;

    await this.teacher.instruction('touch username input box, and fill the given email', async function () {
        // fillUserName can be reuse else where
        fillUserName(username)
    });

    await this.teacher.instruction('touch password input box, and fill the given password', async function () {
        fillPassword(password)
    });

    await this.teacher.instruction('press login button on middle of the screen', async function () {
        const loginButtonFinder = new ByValueKey(Keys.loginButton);
        await teacher.waitFor(loginButtonFinder);
        await teacher.tap(loginButtonFinder);
    });
})
```
![Example of Report with Steps and Instructions](./docs/report-with-steps-instructions.png)
### Purposes
- Keep the BDD scripts short and clean, easier to understand but still provide enough details
- `instruction` method will also take a screenshot, make the report descriptive
- Product Manager and Partner Success can read and understand our BDD scripts
# How to run eibanam

## Script Setup

#### 1. Prepare the parameters

Note these parameters to a text file, you will need them for the script later.

- GitHub Personal Access Token: [GitHub - Create your Personal Access Token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- Unleash Client Key: Follow 1st step of [this thread](https://github.com/manabie-com/eibanam/discussions/1838) to get the key.
- Release Branch: Find the branch you want to run the end-to-end test on. The default branch is set to `develop`

#### 2. Clone the project

- Clone this project to your local machine.
- Your PAT can be used when `git clone` asks for your password. 

#### 3. Run the script

1. Navigate to the newly cloned project `eibanam`
2. Run the script. `bash scripts/setup-eibanam.sh`
3. Input the noted parameters when prompted.
4. Watch for overwrite permission prompt and errors.
5. Edit .env.local file to run test on other branches than `develop`
6. If you edited .env.local file, rerun `make setup-cms` and `make setup-teacher-learner`

## Manual Setup

1. Setup
    -   Install [node](https://nodejs.org/en/download/) > 14
    -   Install `make` command
        - Linux: `sudo apt-get install build-essential`
    -   Install [flutter](https://flutter.dev/docs/get-started/install)
        + Flutter version: 3.3.6
        + How to downgrade:
            - `cd to/your/flutter/dir`
            - `git checkout 3.3.6`
            - Run `flutter --version` to check.
    -   Install [docker](https://docs.docker.com/engine/install)
        + Need setup [Run docker without sudo](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user)
        + If macOS
            - [Memory: By default, Docker Desktop is set to use `2` GB runtime memory](https://docs.docker.com/docker-for-mac/#resources). We should set to `12` GB runtime memory
            - Should set storage to 100GB
        + Run `docker run hello-world` to check.
    -   Install [docker-compose](https://docs.docker.com/compose/install/): `sudo apt-get install docker-compose-plugin`

    -   Setup Github token to fetch private repo:
        -   Create Personal Access Token https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token
        -   Set up GITHUB_TOKEN environment variable: `GITHUB_TOKEN='{personal-access-token}'`
        -   Set up git config:
            ```
            git config --global url."https://${GITHUB_TOKEN}:x-oauth-basic@github.com/".insteadOf git@github.com: 
            git config --global url."https://".insteadOf git://
            git config --global --add url."https://${GITHUB_TOKEN}:x-oauth-basic@github.com/manabie-com".insteadOf "https://github.com/manabie-com"
            ```
    -   Clone the repo to your local: `git clone https://github.com/manabie-com/eibanam.git`
    -   add .env.local file to root dir following format bellow:
        -   ```
            TEACHER_FLAVOR=manabie_teacher_staging
            LEARNER_FLAVOR=manabie_learner_staging
            CMS_FLAVOR=.env.manabie.staging
            FE_REF={release-branch}
            ME_REF={release-branch}
            UNLEASH_CLIENT_KEY={client-key}
            ```
        -   `{release-branch}`: get the [latest release branch](https://github.com/manabie-com/eibanam/branches/all?query=release%2F). e.g. release/20220713
        -   `{client-key}`: follow 1st step of [this thread](https://github.com/manabie-com/eibanam/discussions/1838) to get the key.
    -   `make setup`
    -   `make setup-cms`
    -   `make setup-teacher-learner`
    -   `make setup-docker-images`
    -   Use Docker experimental
        -   Linux: https://github.com/docker/cli/blob/master/experimental/README.md#use-docker-experimental
        -   Mac: on Docker Desktop -> Preferences -> Docker Engine -> "experimental": true -> Apply & Restart


2. Run
    -   Run these apps in parallel when running tests.
        -   `make run-cms`
        -   `make run-teacher-web`
        -   `make run-learner-web`

When you see this message, you started cms successfully

![When you see this message, you started cms successfully](./docs/start-cms-successfully.png)

3. Run Login Test Demo or Run Test with specific tags

    -   When running a test for Learner/Teacher app, you need to select PLATFORM environment (WEB, IOS, ANDROID). e.g. In your .env.local file, add: 
        ``` 
        PLATFORM=WEB 
        ```

    -   Run cucumber via args and options
          -   Run test with specific tags: `yarn cucumber --tags @lesson`
          -   Run a feature file: `yarn cucumber features/**/*.feature`
                 -  EX: run 1 feature `yarn cucumber features/login-demo/login.feature`
                 -  EX: run 1 scenario `yarn cucumber features/login-demo/login.feature:9. `:9` is line of scenario in feature file

4. Gen report html local
    - Run 
        -   ```
            make report-html
            ```
## Driver Layer

![Driver layer](./docs/driver-layer.svg)


## Manabie Context

![manabie context](./docs/manabie-context.png)

The purpose of a "Manabie Context" is twofold:

-   Isolate state between scenarios.
-   Share data between step definitions and hooks within a scenario:

So our architecture, A scenario contains:

-   ScenarioContext: sharing data between steps, ...
-   Platform (CMS, Learner, Teacher): interact directly to selector, ...


## Run in Docker:
Note: 
-   web_profile => 1 back office 1 teacher web 1 learner web
-   web_profile_112 => 1 back office 1 teacher web 2 learner web
-   mobile_profile_111 => 1 back office 1 teacher web 1 mobile web

Run:
-   For web: `TAGS="@login" ./scripts/docker-compose.sh web_profile up`
-   For app: 
    - MacOS:
      - Connecting real device or running emulator (Just Android).
      - `./scripts/docker-compose.sh mobile_profile_111 up`
    - Linux:
      - Install KVM https://developer.android.com/studio/run/emulator-acceleration#vm-linux-kvm
      - `./scripts/docker-compose.sh app_container_profile_111 up`

## PORT
- CMS: 3001
- Teacher: 3002
- Learner: 3003

## Relationship environment

![scope](./docs/scope.png)
