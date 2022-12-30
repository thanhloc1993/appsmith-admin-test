@cms @teacher @learner
@lesson
@lesson-individual-upsert

Feature: School Admin can create weekly recurring individual lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has applied location in location settings is the same as student location
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page

    Scenario Outline: School admin can create a <status> future individual lesson with online teaching method
        Given "school admin" has filled date&time in the "future"
        And "school admin" has selected teaching medium is "Online"
        And "school admin" has selected teaching method is "Individual"
        And "school admin" has selected weekly recurring
        And "school admin" has filled end date is lesson date of next month
        And "school admin" has filled remain individual lesson fields
        When "school admin" clicks save with "<status>" the lesson page
        And "teacher" applies center location in location settings on Teacher App
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees created "<status>" recurring lesson within the repeat duration on "future" lessons list on CMS
        And "teacher" can "<action>" created "future" weekly recurring lesson within the repeat duration on Teacher App
        And "student" can "<action>" created "future" weekly recurring lesson within the repeat duration on Learner App
        Examples:
            | status    | action  |
            | Draft     | not see |
            | Published | see     |
        @blocker
        Examples:
            | status    | action  |
            | Published | see     |    

    Scenario Outline: School admin can create a <status> past individual lesson with online teaching method
        Given "school admin" has filled start & end time have been completed in the last 24 hours
        And "school admin" has filled online teaching medium
        And "school admin" has selected weekly recurring
        And "school admin" has filled end date is lesson date of next month
        #all remain fields: teacher, student, location
        And "school admin" has filled all remain fields
        And "teacher" have applied center location in location settings on Teacher App
        When "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to "past" lessons list page
        And "school admin" sees created "<status>" recurring lesson within the repeat duration on "past" lessons list on CMS
        And "school admin" sees created "<status>" recurring lesson within the repeat duration on "future" lessons list on CMS
        And "teacher" can "<action>" created "past" recurring lesson within the repeat duration on Teacher App
        And "teacher" can "<action>" created "future" recurring lesson within the repeat duration on Teacher App
        Examples:
            | status    | action  |
            | Draft     | not see |
            | Published | see     |

    Scenario Outline: School admin can create a <status> future individual lesson with offline teaching method
        Given "school admin" has filled date & time is within 10 minutes from now
        And "school admin" has selected weekly recurring
        And "school admin" has filled end date is lesson date of next month
        #all remain fields: teacher, student, location
        And "school admin" has filled all remain fields
        And "school admin" has filled offline teaching medium
        And "teacher" have applied center location in location settings on Teacher App
        When "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees created "<status>" recurring lesson within the repeat duration on "future" lessons list on CMS
        And "teacher" does not see created "future" recurring lesson within the repeat duration on Teacher App
        And "student" does not see created "future" recurring lesson within the repeat duration on Learner App
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School admin can create a <status> past individual lesson with offline teaching method
        Given "school admin" has filled start & end time have been completed in the last 24 hours
        And "school admin" has selected weekly recurring
        And "school admin" has filled end date is lesson date of next month
        And "school admin" has filled all remain fields
        And "school admin" has filled offline teaching medium
        And "teacher" have applied center location in location settings on Teacher App
        When "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to "past" lessons list page
        And "school admin" sees created "<status>" recurring lesson within the repeat duration on "past" lessons list on CMS
        And "school admin" sees created "<status>" recurring lesson within the repeat duration on "future" lessons list on CMS
        And "teacher" does not see created "past" recurring lesson within the repeat duration on Teacher App
        And "teacher" does not see created "future" recurring lesson within the repeat duration on Teacher App
        And "student" does not see created "future" recurring lesson within the repeat duration on Learner App
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School admin cannot create weekly recurring individual lesson with "<condition>"
        Given "school admin" has filled date & time is within 10 minutes from now
        And "school admin" has filled online teaching medium
        And "school admin" has selected weekly recurring
        And "school admin" has filled end date with "<condition>"
        #all remain fields: teacher, student, location
        And "school admin" has filled all remain fields
        When "school admin" clicks save button of lesson management
        Then "school admin" sees inline errors message under both Lesson Date and End Date
        And "school admin" is still in creating lesson page
        Examples:
            | condition              |
            | end date < lesson date |
            | end date = lesson date |

    Scenario: School admin cannot create weekly recurring individual lesson with missing End date field
        When "school admin" creates weekly recurring individual lesson with missing End date field
        Then "school admin" sees alert message under required "end date"
        And "school admin" is still in creating lesson page
