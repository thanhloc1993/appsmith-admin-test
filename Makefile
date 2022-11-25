# .env.local is optional env, with -include it will be ignore if file dont exist
-include .env.local

export

localWarning := '\n'To run in local please add .env.local file following format below: '\n'$\
	\# Goto https://github.com/manabie-com/eibanam/discussions/1838 to get the UNLEASH_CLIENT_KEY.'\n'$\
	UNLEASH_CLIENT_KEY=your_key '\n'$\
	TEACHER_FLAVOR=manabie_teacher_staging '\n'$\
	LEARNER_FLAVOR=manabie_learner_staging '\n'$\
	CMS_FLAVOR=.env.manabie.staging '\n'$\
	FE_REF={release-branch} '\n'$\
	ME_REF={release-branch} '\n'

setup-local-libraries:
	cd libraries/flutter-driver-x-js && npm install && npm run build
	yarn add file:./libraries/flutter-driver-x-js

setup-github:
	git config --replace-all --global url."https://${GITHUB_TOKEN}:x-oauth-basic@github.com/".insteadOf git@github.com: \
		&& git config --global url."https://".insteadOf git://
	git config --global --add url."https://${GITHUB_TOKEN}:x-oauth-basic@github.com/manabie-com".insteadOf "https://github.com/manabie-com"

setup: setup-local-libraries setup-github 
	bash ./scripts/setup.sh

##### Docker script
## Sharing all containers
setup-xvfb:
	Xvfb :99 -screen 0 1900x1080x16

build-docker-images-node:
	DOCKER_BUILDKIT=1 docker build -f Dockerfile.node -t asia.gcr.io/student-coach-e1e95/node_eibanam:1.27.1-focal .

build-docker-images-flutter:
	DOCKER_BUILDKIT=1 docker build -f Dockerfile.flutter-web -t asia.gcr.io/student-coach-e1e95/flutter_web:3.3.6 .

build-docker-images: build-docker-images-flutter build-docker-images-node

setup-docker-images:
	(docker image inspect asia.gcr.io/student-coach-e1e95/flutter_web:3.3.6 || make build-docker-images-flutter) && \
		(docker image inspect asia.gcr.io/student-coach-e1e95/node_eibanam:1.27.1-focal || make build-docker-images-node)


setup-cms: setup-github
ifeq ($(CI),)
	if (test ! -f ./.env.local) then echo $(localWarning); exit 1; else echo read env variables from .env.local; fi
endif
	bash ./scripts/check-env.sh
	bash ./scripts/setup-cms.sh

setup-teacher-learner: setup-github
ifeq ($(CI),)
	if (test ! -f ./.env.local) then echo $(localWarning); exit 1; else echo read env variables from .env.local; fi
endif
	bash ./scripts/check-env.sh
	bash ./scripts/setup-learner.sh

setup-3apps: setup-cms setup-teacher-learner

run-3apps:
	bash ./scripts/docker-compose.sh web_profile up

run-cms:
	bash ./scripts/build-cms.sh

run-teacher-web:
	bash ./scripts/run-teacher-web.sh TEACHER_PROFILE=teacher_1

run-learner-web:
	bash ./scripts/run-learner-web.sh TEACHER_PROFILE=learner_1

run-debug-teacher-web:
	cd packages/student-app/manabie_teacher && flutter pub get && make run-web flavor=$(TEACHER_FLAVOR)

run-debug-learner-web:
	cd packages/student-app/manabie_learner && flutter pub get && make run-web flavor=$(LEARNER_FLAVOR)

run-learner-app:
	adb tcpip 5555 || true
	adb connect host.docker.internal || true
	./scripts/check_emulator_attached.sh
	cd packages/student-app/manabie_learner && make run-app-cross-testing flavor=$(LEARNER_FLAVOR) file=learner_1

gen-files-keys-learner-teacher:
	cd packages/student-app/manabie_teacher && flutter pub get && make gen-keys-ts output=../../../test-suites/common/__generated__/teacher-keys.ts
	cd packages/student-app/manabie_learner && flutter pub get && make gen-keys-ts output=../../../test-suites/common/__generated__/learner-key.ts
	yarn eslint --fix ./test-suites/common/__generated__/learner-keys/*.ts
	yarn eslint --fix ./test-suites/common/__generated__/teacher-keys/*.ts

report-html:
	RUN_ID='${RUN_ID}' bash ./scripts/report-html.sh

run-unit-test:
	yarn unit-test

generate-docs:
	rm -rf ./docs/wiki
	yarn typedoc --tsconfig ./tsconfig.json --readme none --theme ./node_modules/typedoc-github-wiki-theme/dist --out ./docs/wiki/ ./supports/*-world.ts ./supports/*-context.ts

run-learner-login-demo:
	make run-test-for-tags TAGS="@learner-login" PLATFORM=$(PLATFORM)

run-network-demo:
	PLATFORM=WEB yarn cucumber:development features/demo/network.feature:5

run-login-demo:
	make run-test-for-tags TAGS="@login and @demo" PLATFORM=WEB

run-grpc-test-squad-user:
	make run-test-for-tags TAGS="@user and @grpc"

run-grpc-test-squad-communication:
	make run-test-for-tags TAGS="@communication and @grpc"

trace-viewer: 
	yarn playwright show-trace ./report/trace-viewer/$(name).zip

trace-viewer-cms: 
	make trace-viewer name=cms

trace-viewer-learner: 
	make trace-viewer name=learner_1

trace-viewer-teacher: 
	make trace-viewer name=teacher_1

trace-viewer-parent: 
	make trace-viewer name=parent_1

build-learner-e2e-ios:
	cd packages/student-app/manabie_learner && make build-e2e-ios flavor=$(LEARNER_FLAVOR)
	cp -R packages/student-app/manabie_learner/build/ios/iphonesimulator/Runner.app ./learner.app

build-learner-e2e-android:
	cd packages/student-app/manabie_learner && make build-e2e-android flavor=$(LEARNER_FLAVOR)
	cp -R packages/student-app/manabie_learner/build/app/outputs/flutter-apk/app.apk ./learner.apk

build-flutter-attach-service:
	yarn tsc flutter-driver-js/src/service/flutter-attach-service.ts --outDir .