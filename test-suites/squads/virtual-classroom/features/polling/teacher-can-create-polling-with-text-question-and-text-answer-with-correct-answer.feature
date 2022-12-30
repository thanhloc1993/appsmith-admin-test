@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-polling

Feature: Teacher can start polling with correct answer
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher T1" has opened create polling page on Teacher App
        And "teacher T1" has added more options from C to J on Teacher App

    Scenario Outline: Teacher can start a polling with text question and answer option along with single correct answer
        Given "teacher T1" fulfills by text in question and fulfills by text answer option field on Teacher App
        And "teacher T1" has selected "<option>" as correct answer on Teacher App
        When "teacher T1" starts polling on Teacher App
        Then all teachers see stats page with the previous selected options on Teacher App
        And all teachers see "0"|"1" number of answer on Teacher App
        And all teachers see stop answer button on Teacher App
        And all teachers see "active" polling icon in the main bar on Teacher App
        And all students see question content and options content on Learner App
        Examples:
            | option |
            | A      |
            | B      |
            | C      |
            | D      |
            | E      |
            | G      |
            | H      |
            | I      |
            | J      |

    # Scenario: Teacher can start a polling with text question and answer option along with multiple correct answer
    #     Given "teacher T1" fulfills by text in question and fulfills by text answer option field on Teacher App
    #     And "teacher T1" has selected multiple correct answers
    #     When "teacher T1" starts polling on Teacher App
    #     Then all teachers see stats page with the previous selected options on Teacher App
    #     And all teachers see "0"|"1" number of answer on Teacher App
    #     And all teachers see stop answer button on Teacher App
    #     And all teachers see "active" polling icon in the main bar on Teacher App
    #     And all students see question content and options content on Learner App
