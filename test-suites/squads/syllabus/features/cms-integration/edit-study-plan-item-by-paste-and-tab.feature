@cms
@cms-syllabus-integration
@syllabus @book @studyplan

Feature: [Integration] School admin pastes value and using tab to edit study plan item values

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content 2 topic without quiz" book
        And school admin has created a matched studyplan for integration
        And school admin goes to the "course" study plan in the course detail

    Scenario: School admin can paste and tab to edit study plan items
        Given school admin goes to the study plan detail
        When school admin edits time by copy-paste value and goes to the next input
        Then school admin sees study plan items time updated

    Scenario Outline: End date time is auto updated when user inputs start time with <condition>
        Given school admin goes to the study plan detail
        # Goes to due date and don't fill it (using tab to jump to the next study plan item)
        When school admin edits times by copy-paste start time which "<condition>" and goes to due date
        Then school admin sees study plan items updated with due date "<due date>"

        Examples:
            | condition                                  | due date               |
            | less than availableTime 7 days             | equal to availableTime |
            | greater than or equal availableTime 7 days | from startTime 7 days  |
            | none                                       | none                   |
