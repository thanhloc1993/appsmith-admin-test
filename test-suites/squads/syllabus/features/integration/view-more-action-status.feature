@cms @teacher @learner @learner2 @learner3
@syllabus @studyplan @studyplan-item-teacher-edit
@staging

Feature: Teacher views "More Action" dropdown list status
    Background:
        Given "school admin" logins CMS
        And school admin has created students "student S1,student S2,student S3" belong to location
        And school admin has created a "course" belong to "location" and "class"
        And school admin adds the "course" for "student S1" with "location" and "class"
        And school admin adds the "course" for "student S2" with "location" and "class"
        And school admin adds the "course" for "student S3" with "location" and "class"
        And school admin has created a "simple content without quiz" book "book"
        And school admin creates a matched studyplan "study plan SP1" by "book" for "course"

    #TCID:None
    Scenario Outline: Teacher views "More Action" dropdown list is enabled when at least one student is selected
        Given "teacher" logins Teacher App
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And "student S3" logins Learner App
        When teacher is at course statistics screen of "course"
        And teacher goes to study plan item detail screen
        And teacher selects "<number>" students
        And teacher taps more action button
        Then teacher sees more action button is "enabled"
        Examples:
            | number |
            | one    |
            | some   |
            | all    |

    #TCID:None
    Scenario Outline: Teacher views "More Action" dropdown list is disabled when students are unselected
        Given "teacher" logins Teacher App
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And "student S3" logins Learner App
        When teacher is at course statistics screen of "course"
        And teacher goes to study plan item detail screen
        And teacher selects "<number>" students
        And teacher deselects that students
        Then teacher sees more action button is "disabled"
        Examples:
            | number |
            | one    |
            | some   |
            | all    |

    #TCID:None
    Scenario: Teacher views "More Action" dropdown list is disabled when no student is selected
        Given "teacher" logins Teacher App
        When teacher is at course statistics screen of "course"
        And teacher goes to study plan item detail screen
        And teacher taps more action button
        Then teacher sees more action button is "disabled"