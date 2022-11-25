@cms
@user @student-course
Feature: Location dropdown list validation

    Background:
        Given "school admin" logins CMS
        And school admin has imported location master data
        And school admin selects all locations on location setting

    Scenario: Choose student-course before select location
        Given school admin has created a student belong to "location L1 & location L2"
        And school admin has created a "course C1" belong to "location L1 & location L2"
        When school admin wants to add a new student-course
        And school admin selects the "course C1"
        And school admin wants to select location
        Then school admin sees location dropdown list matched with "course C1" location

    Scenario: Choose student-course location before select course
        Given school admin has created a student belong to "location L1 & location L2"
        And school admin has created a "course C1" belong to "location L1 & location L2"
        When school admin wants to add a new student-course
        And school admin adds a new student-course record
        And school admin wants to select location
        Then school admin sees location dropdown list is empty

    Scenario: Re-select student-course
        Given school admin has created a student belong to "location L1 & location L2"
        And school admin has created a "course C1" belong to "location L1"
        And school admin has created a "course C2" belong to "location L1 & location L2"
        When school admin wants to add a new student-course
        And school admin adds a new "available" "course C1" with "location L1"
        And school admin re-selects "course C2"
        And school admin sees location field is empty
        And school admin wants to select location
        Then school admin sees location dropdown list matched with "course C2" location
