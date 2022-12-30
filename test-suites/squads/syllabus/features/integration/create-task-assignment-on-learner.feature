@cms @learner
@syllabus @task-assignment @task-assignment-common
@staging

Feature: Create task assignment on Learner
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a new course without any location
        And school admin has added the new course for student
        And student is at create task assignment screen

    #TCID:syl-0958
    Scenario: Student cancel creating task assignment
        When student inputs some information for Task
        And student cancels creating the task assignment by back button
        And student confirms leaving create task assignment screen
        And student goes back to create task assignment screen
        Then student sees all fields in form are reset

    #TCID:syl-0957
    Scenario Outline: Student cannot creates task assignment with start date after due date
        When student selects "<case>"
        Then student can't select "<case>"
        And student sees default start date is today
        Examples:
            | case                       |
            | start date after due date  |
            | due date before start date |

    #TCID:syl-0960
    Scenario: Student creates task assignment with start date and due date
        When student inputs mandatory information for Task
        And student selects start date before due date
        And student saves the creating process
        Then student sees task assignment is created

    #TCID:syl-0955
    Scenario Outline: Student creates task assignment with missing mandatory fields
        When student doesn't input "<missing field>" for Task
        Then student sees save task assignment button is disabled
        Examples:
            | missing field |
            | task name     |
            | course        |

    #TCID:syl-0956
    Scenario: Student deletes uploaded attachments when creating task assignment
        When student uploaded attachments
        And student deletes some uploaded attachments
        Then student doesn't see "deleted" attachments

    #TCID:syl-0956
    Scenario: Student deletes uploaded attachments then save task assignment
        When student uploaded attachments
        And student deletes some uploaded attachments
        And student inputs mandatory information for Task
        And student saves the creating process
        Then student sees created task assignment without "deleted" attachments

    #TCID:syl-0956
    Scenario: Student cancels uploading attachment when creating task assignment
        When student is uploading attachments
        And student cancels some uploading attachments
        Then student doesn't see "cancelled" attachments

    #TCID:syl-0956
    Scenario: Student cancels uploading attachment then save task assignment
        When student is uploading attachments
        And student cancels some uploading attachments
        And student inputs mandatory information for Task
        And student saves the creating process
        Then student sees created task assignment without "cancelled" attachments
