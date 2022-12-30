@teacher @cms
@syllabus @staging @exam-lo-to-review

Feature: Filter Improvement

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario: Teacher view lo name and student name filter in to-review screen
        When "teacher" goes to "To Review" on Teacher App
        And teacher select lo type filter is exam
        Then teacher sees LO name and student search boxes
        And teacher sees default for LO name and student search boxes is empty
