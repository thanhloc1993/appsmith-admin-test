@cms
@user @student-course

Feature: Register student class on CMS

    Background:
        Given "school admin" logins CMS
        And school admin has created a student belong to "location L1 & location L2"
        And school admin has created a "course" belong to "location L1 & location L2"
        And school admin has imported "class C1 & class C2" belong to "course" and "location L1"
        And school admin selects all locations on location setting
        When school admin wants to add a new student-course

    Scenario: Register a new student class
        When school admin adds a new "available" "course" with "location L1"
        And school admin registers "class C1" for "course"
        Then school admin sees the "course" with "location L1" and "class C1" added for the student

    Scenario: Change student class to another
        When school admin adds a new "available" "course" with "location L1"
        And school admin registers "class C1" for "course"
        And school admin changes to "class C2" of "course"
        Then school admin sees the "course" with "location L1" and "class C2" added for the student

    Scenario: Change student course location
        When school admin adds a new "available" "course" with "location L1"
        And school admin registers "class C1" for "course"
        And school admin edits "location L1" to "location L2" of "course" in the student
        Then school admin sees the "course" with "location L2" and "no class" added for the student

    Scenario: Unable to register with empty class
        When school admin adds a new "available" "course" with "location L2"
        And school admin registers "any class" for "course"
        Then school admin "does not see" any class
        And school admin sees the "course" with "location L2" and "no class" added for the student