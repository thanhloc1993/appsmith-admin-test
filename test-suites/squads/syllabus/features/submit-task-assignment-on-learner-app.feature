@cms @teacher @learner
@syllabus @task-assignment @task-assignment-common

Feature: Submit task assignment on learner web
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content with a task assignment" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0934,syl-0940
    Scenario: Student cannot submit task assignment
        Given school admin goes to a task assignment detail page of the content book
        And school admin edits task assignment setting to include random n>0 required fields
        # n <= 5, setting fields = [text note, duration, correctness, understanding level, file attachment]
        And school admin sees the edited task assignment setting on CMS
        And student is on task assignment detail screen
        When student fills a required field with no data on Learner App
        Then student cannot submit the task assignment on Learner App
        And teacher sees the submission with incomplete status on teacher dashboard
        And teacher sees the submission with incomplete status on task assignment detail screen

    #TCID:syl-0929
    Scenario: Student cannot resubmit task assignment
        Given school admin goes to a task assignment detail page of the content book
        And school admin edits task assignment setting to include random n required fields
        # n <= 5, setting fields = [text note, duration, correctness, understanding level, file attachment]
        And school admin sees the edited task assignment setting on CMS
        And student is on task assignment detail screen
        When student fills all required fields with data on Learner App
        And student submits the task assignment
        And student sees the task assignment submitted
        And student goes to task assignment detail screen again
        Then student cannot resubmit the task assignment

    #TCID:syl-1086
    Scenario Outline: Student can submit task assignment that requires duration
        Given school admin goes to a task assignment detail page of the content book
        And school admin edits task assignment setting to include duration field and n random remaining required fields
        And school admin sees the edited task assignment setting on CMS
        And student is on task assignment detail screen
        When student fills all required fields with data on Learner App that complete date is "<state>" submitted date
        And student submits the task assignment
        Then student sees the task assignment submitted
        And student sees duration accumulated in learning stats screen on complete date
        And student "<result>" duration accumulated in learning stats screen on submitted date
        And teacher sees the submission with matched data on teacher dashboard
        # match data = complete date, status & grade (if correctness is required)
        And teacher sees the submission with complete status on task assignment detail screen
        And teacher sees submitted data on task assignment detail screen
        # submitted data = some of [text note, duration, correctness, understanding level, file attachment] depending on settings on BO

        Examples:
            | state          | result       |
            | the same as    | sees         |
            | different from | does not see |

    #TCID:syl-1088
    Scenario: Student can submit task assignment that does not require duration
        Given school admin goes to a task assignment detail page of the content book
        And school admin edits task assignment setting to include random n required fields but exclude duration field
        And school admin sees the edited task assignment setting on CMS
        And student is on task assignment detail screen
        When student fills all required fields with data on Learner App
        And student submits the task assignment
        Then student sees the task assignment submitted
        And student does not see learning time accumulated in learning stats screen on submitted date
        And teacher sees the submission with matched data on teacher dashboard
        # matched data = complete date, status and grade (if correctness is required)
        And teacher sees the submission with complete status on task assignment detail screen
        And teacher sees submitted data on task assignment detail screen
# submitted data = some of [text note, duration, correctness, understanding level, file attachment] depending on settings on BO