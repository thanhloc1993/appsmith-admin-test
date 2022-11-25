@cms @teacher @learner
@syllabus @task-assignment @task-assignment-common

Feature: Edit task assignment with required items
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "has chapter and topic only" book
        And school admin has created a new course without any location
        And school admin has created a matched studyplan for student
        And school admin is at book detail page

    #TCID:syl-0891,syl-0892
    Scenario Outline: Edit task assignment to "<edit type>"
        Given school admin creates a task assignment with "<create type>"
        And school admin edits task assignment to "<edit type>"
        And school admin sees task assignment's required items edited
        And school admin modifies that task assignment available for studying
        When student is on task assignment detail screen
        Then student "<visibility>" task assignment with required fields
        And teacher is on task assignment detail screen
        And teacher "<visibility>" task assignment with required fields

        Examples:
            | create type       | edit type                  | visibility  |
            | no required items | include required items     | sees        |
            | any required item | not include required items | doesn't see |

    #TCID:syl-0893
    Scenario: Edit task assignment after student already submitted
        Given school admin creates a task assignment with "any required item"
        And school admin modifies that task assignment available for studying
        When student is on task assignment detail screen
        Then student fills all required fields with data on Learner App
        And student submits the task assignment
        And teacher sees the submission with matched data on teacher dashboard
        And teacher sees the submission with complete status on task assignment detail screen
        And school admin goes to task assignment detail page
        And school admin edits task assignment to "not include required items"
        And student still sees task assignment submission
        And teacher still sees task assignment submission with complete status

    #TCID:syl-0893
    Scenario: Edit task assignment after teacher already submitted
        Given school admin creates a task assignment with "any required item"
        And school admin modifies that task assignment available for studying
        When teacher is at student's studyplan detail screen
        Then teacher fills all required fields with data on Teacher App
        And teacher submits the task assignment
        And teacher sees the submission with matched data on teacher dashboard
        And teacher sees the submission with complete status on task assignment detail screen
        And school admin goes to task assignment detail page
        And school admin edits task assignment to "not include required items"
        And student still sees task assignment submission
        And teacher still sees task assignment submission with complete status
