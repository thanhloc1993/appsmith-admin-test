@cms
@cms-syllabus-integration
@syllabus @studyplan

Feature: [Integration] Show/Hide(Archived/Re-activate) course study plan items status
    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content 2 topic without quiz" book
        And school admin has created a new course without any location
        And school admin has added 2 students to the course

    #TCID:syl-0406,syl-0412
    Scenario Outline: User can <action> course study plan items
        When school admin has created a matched studyplan with "<status>" study plan items
        Then school admin goes to the "course" study plan in the course detail
        And school admin goes to the "course" study plan detail
        And school admin does "<action>" some study plan items
        And school admin sees status study plan items updated
        And school admin sees all student study plan items updated

        Examples:
            | status   | action |
            | archived | show   |
            | active   | hide   |
