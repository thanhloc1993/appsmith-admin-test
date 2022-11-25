# BDD

Gherkin rules will help reduce review/running time and make BDD good than

- [BDD](#bdd)
  - [Max Scenario sizes](#max-scenario-sizes)
  - [Allow tags](#allow-tags)
  - [Max steps for Background and Scenario](#max-steps-for-background-and-scenario)
  - [Name length](#name-length)


## Max Scenario sizes
Each file should have only `10` Scenarios. It will help debug and run pallarel

Each `Examples` of a Scenario Outline will be count is a Scenario

## Allow tags
Allow tags for BDD

- Driver tags
```ts
@cms //connect CMS
@parent //connect Parent
@parent2 //connect Parent 2
@learner //connect Learner
@learner2 //connect Learner 2
@teacher //connect Teacher
@teacher2 //connect Teacher 2
@cms-jprep //connect CMS of JPREP
```

- Squad tags
```ts
@syllabus
@communication
@user
@lesson
@virtual-classroom
@entry-exit
@invoice
```

- Feature tags
```ts
@login
@lo
@course
@book
@studyplan
@studyplan-course
@studyplan-book
@studyplan-item-create
@studyplan-item-delete
@studyplan-item-admin-edit
@studyplan-item-teacher-edit-p1
@studyplan-item-teacher-edit-p2
@studyplan-item-teacher-edit
@studyplan-item-teacher-edit-v2
@studyplan-item-bulk-edit
@studyplan-item-do-quiz


@question
@assignment
@lesson-report-submit
@flashcard
```

- Partner tags
```ts
@jprep
```

- Other tags
```ts
@ignore
@grpc
@demo
@network
@staging
```
## Max steps for Background and Scenario
- Background: 10
- Scenario: 15

## Name length
- Feature: 120
- Scenario: 120
- Step: 120