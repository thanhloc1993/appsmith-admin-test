@cms @teacher @learner @parent
@user @student-info

Feature: Edit student info on CMS

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario: Edit student name
        Given school admin has created a student with parent info and "visible" course
        And student logins Learner App successfully with credentials which school admin gives
        And parent logins Learner App successfully with credentials which school admin gives
        When school admin edits student name
        Then school admin sees the edited name on CMS
        And student sees the edited name on Learner App
        And parent sees the edited student name on Learner App
        And teacher sees the edited student name on Teacher App

    Scenario Outline: Edit student not required fields from normal to <typeValue>
        Given school admin has created a student with student info
        When school admin edits student with not required fields into "<typeValue>"
            | not required fields |
            | studentExternalId   |
            | studentNote         |
            | firstNamePhonetic   |
            | lastNamePhonetic    |
        Then school admin sees the edited student data on CMS
        Examples:
            | typeValue |
            | blank     |
            | normal    |

    Scenario: Edit student not required fields from blank to normal
        Given school admin creates a new student without not required fields
            | not required fields |
            | studentExternalId   |
            | studentNote         |
            | birthday            |
            | gender              |
            | firstNamePhonetic   |
            | lastNamePhonetic    |
        When school admin edits student with not required fields into "normal"
            | not required fields |
            | studentExternalId   |
            | studentNote         |
            | birthday            |
            | gender              |
            | firstNamePhonetic   |
            | lastNamePhonetic    |
        Then school admin sees the edited student data on CMS

    Scenario: Keep the old data when admin cancels the edit student not required fields from blank to normal
        Given school admin creates a new student without not required fields
            | not required fields |
            | studentExternalId   |
            | studentNote         |
            | birthday            |
            | gender              |
            | firstNamePhonetic   |
            | lastNamePhonetic    |
        When school admin cancels the edits student with not required fields is "normal"
            | not required fields |
            | studentExternalId   |
            | studentNote         |
            | birthday            |
            | gender              |
            | firstNamePhonetic   |
            | lastNamePhonetic    |
        Then school admin sees old data of student

    Scenario Outline: Keep the old data when admin cancels the edit student with not required fields is <typeValue>
        Given school admin creates a new student with student info
        When school admin cancels the edits student with not required fields is "<typeValue>"
            | not required fields |
            | studentExternalId   |
            | studentNote         |
            | firstNamePhonetic   |
            | lastNamePhonetic    |
        Then school admin sees old data of student
        Examples:
            | typeValue |
            | blank     |
            | normal    |

    Scenario: Edit student with duplicate external student ID
        Given school admin has created a "student S1" with student information
        And school admin creates a new student with student info
        When school admin edits student with external student ID which duplicated with "student S1"
        Then school admin sees the edited student data on CMS

    Scenario Outline: Able to cancel edit student
        Given school admin has created a student with student info
        When school admin edits a student with draft information
        And school admin cancels the updating student using "<button>"
        Then school admin sees edit student full-screen dialog closed
        And school admin sees the student with new data is not saved
        Examples:
            | button |
            | close  |
            | cancel |
            | escape |
