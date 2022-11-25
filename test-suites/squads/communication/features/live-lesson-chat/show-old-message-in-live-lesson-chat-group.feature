@cms @learner @teacher
@communication
@live-lesson-chat

Feature: Show old message in live lesson chat box

    Background:
        Given "school admin" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher T1" login Teacher App
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher T1" has filtered location in location settings on Teacher App with the lesson location

    Scenario Outline: When teacher start lesson first, <participant> sees old message after leaving and rejoins lesson
        Given "teacher T1" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher T1, student" have sent message in lesson chat group
        And "<participant>" has left lesson
        When "<participant>" rejoins lesson
        Then "<participant>" sees old message display in lesson chat box
        Examples:
            | participant |
            | teacher T1  |
            | student     |

    Scenario Outline: When teacher start lesson first, <participant> sees old and new message after leaving and rejoins lesson
        Given "teacher T1" has joined lesson of lesson management on Teacher App
        And "student" have joined lesson on Learner App
        And "student, teacher T1" have sent message in lesson chat group
        And "<participant>" has left lesson
        And "<sender>" has sent new message
        When "<participant>" rejoins lesson
        Then "<participant>" sees old message and new message display in lesson chat box
        Examples:
            | participant | sender     |
            | teacher T1  | student    |
            | student     | teacher T1 |

    Scenario Outline: When student joins lesson first, <participant> sees old message after leaving and rejoins lesson
        Given "student" goes to lesson waiting room on Learner App
        And "teacher T1" has joined lesson of lesson management on Teacher App
        And "teacher T1, student" have sent message in lesson chat group
        And "<participant>" has left lesson
        When "<participant>" rejoins lesson
        Then "<participant>" sees old message display in lesson chat box
        Examples:
            | participant |
            | teacher     |
            | student     |

    Scenario Outline: When student joins lesson first, <participant> sees old and new message after leaving and rejoins lesson
        Given "student" goes to lesson waiting room on Learner App
        And "teacher T1" has joined lesson of lesson management on Teacher App
        And "teacher T1, student" have sent message in lesson chat group
        And "<participant>" has left lesson
        And "<sender>" has sent new message
        When "<participant>" rejoins lesson
        Then "<participant>" sees old message and new message display in lesson chat box
        Examples:
            | participant | sender     |
            | teacher T1  | student    |
            | student     | teacher T1 |

    Scenario Outline: <participant> sees all messages of current session
        Given "teacher T1" has joined lesson of lesson management on Teacher App
        And "student" have joined lesson on Learner App
        And "teacher T1, student" have sent message in lesson chat group
        And "teacher T1" has ended lesson for all on Teacher App
        And "teacher T1" rejoins lesson on Teacher App
        And "student" rejoins lesson on Learner App
        And "teacher T1, student" have sent message in lesson chat group
        And "<participant>" has left lesson
        When "<participant>" rejoins lesson
        Then "<participant>" sees old message display in lesson chat box
        Examples:
            | participant |
            | teacher T1  |
            | student     |