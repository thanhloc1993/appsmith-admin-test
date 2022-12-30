@cms @teacher @learner
@syllabus @task-assignment @task-assignment-common

Feature: Submit task assignment on teacher web
        Background:
                Given "school admin" logins CMS
                And "teacher" logins Teacher App
                And "student" logins Learner App
                And school admin has created a "simple content with a task assignment" book
                And school admin has created a matched studyplan for student

        Scenario Outline: Teacher submits task assignment that requires duration
                Given school admin goes to a task assignment detail page of the content book
                And school admin edits task assignment setting to include duration field and n random remaining required fields
                And school admin sees the edited task assignment setting on CMS
                And teacher is at student's studyplan detail screen
                When teacher fills all required fields with data on Teacher App that complete date is "<state>" submitted date
                And teacher submits the task assignment
                Then teacher sees the submission with matched data on teacher dashboard
                # match data = complete date, status & grade (if correctness is required)
                And teacher sees the submission with complete status on task assignment detail screen
                And teacher sees submitted data on task assignment detail screen
                # submitted data = some of [text note, duration, correctness, understanding level, file attachment] depending on settings on BO
                And student sees the task assignment submitted
                And student sees duration accumulated in learning stats screen on complete date
                And student "<result>" duration accumulated in learning stats screen on submitted date

                Examples:
                        | state          | result       |
                        | the same as    | sees         |
                        | different from | does not see |

        Scenario: Teacher submits task assignment that does not require duration
                Given school admin goes to a task assignment detail page of the content book
                And school admin edits task assignment setting to include random n required fields but exclude duration field
                And school admin sees the edited task assignment setting on CMS
                And teacher is at student's studyplan detail screen
                When teacher fills all required fields with data on Teacher App
                And teacher submits the task assignment
                Then teacher sees the submission with matched data on teacher dashboard
                # matched data = complete date, status & grade (if correctness is required)
                And teacher sees the submission with complete status on task assignment detail screen
                And teacher sees submitted data on task assignment detail screen
                # submitted data = some of [text note, duration, correctness, understanding level, file attachment] depending on settings on BO
                And student sees the task assignment submitted
                And student does not see learning time accumulated in learning stats screen on submitted date