@cms
@cms-syllabus-integration
@syllabus @studyplan

Feature: [Integration] Unarchive study plan

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content with a task assignment" book
        And school admin has created a new course without any location
        And school admin has added 2 students to the course

    #TCID:None
    Scenario: Can unarchive an archived master study plan
        Given school admin has created 1 "archived" study plan with "full" info
        When school admin unarchives 1 master study plans in master detail page
        Then school admin sees the active study plans in master tab
        And school admin sees the active study plans of all students in individual tab

    Scenario: Can unarchive 1 more master study plan after 1 master study plan is unarchived
        Given school admin has created 3 "archived" study plan with "full" info
        When school admin unarchives 2 master study plans in master detail page
        Then school admin sees the active study plans in master tab
        And school admin sees the active study plans of all students in individual tab

    Scenario: Cannot unarchive an active master study plan
        Given school admin has created 1 "active" study plan with "full" info
        When school admin goes to the "master" study plan detail page
        Then school admin cannot "unarchive" the "active" master study plan

    Scenario: Cannot unarchive an individual study plan
        Given school admin has created 1 "active" study plan with "full" info
        When school admin goes to the "individual" study plan detail page
        Then school admin cannot "unarchive" the individual study plan
