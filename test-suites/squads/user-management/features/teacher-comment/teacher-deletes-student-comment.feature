@cms @teacher
@user @student-comment
Feature: Teacher deletes student comment

    Background:
        Given "school admin" logins CMS
        And "teacher T1" logins Teacher App
        And school admin has created a student with parent info and "available" course
        And "teacher T1" is on Comment History screen

    Scenario Outline: Teacher deletes a student comment
        Given "teacher T1" gives a "<comment1>"
        And "teacher T1" gives a "<comment2>"
        When "teacher T1" deletes "<comment2>"
        Then "teacher T1" sees the "<comment2>" deleted
        And "teacher T1" sees the "<comment1>" undeleted
        Examples:
            | comment1                | comment2                |
            | comment1 included https | comment2 excluded https |
            | comment1 excluded https | comment2 included https |
            | comment1 included https | comment2 included https |
            | comment1 excluded https | comment2 excluded https |

    Scenario Outline: Teacher cancel deleting a student comment
        Given "teacher T1" gives a "<comment>"
        When "teacher T1" cancels delete comment using "<button>"
        Then "teacher T1" sees the "<comment>" undeleted
        Examples:
            | comment                | button |
            | comment included https | close  |
            | comment excluded https | cancel |

    @teacher2
    Scenario Outline: Teacher delete another teacher comment
        Given "teacher T1" gives a "<comment>"
        And "teacher T2" logins Teacher App
        And "teacher T2" is on Comment History screen
        When "teacher T2" deletes "<comment>"
        Then "teacher T1" reloads web
        And "teacher T1" sees the "<comment>" deleted
        Examples:
            | comment                |
            | comment excluded https |
