An attempt to build a javascript version of FootballForEnglish that will run on local file system and does not need a server. All view changes and manipulation will be via jquery. The initial html will be brought up as a file and not a s a host:port.

Americas Cup of English is a game for non-english speaking persons to learn and compete in learning english.
Ball advances every time possessing team answers correctly a question about english 
and opposing team answers incorrectly.
When the ball is in a goal, just after scoring, the team may advance the ball by answering a question correctly. 
There is no opportunity to stop this advancement by the other team. So basically the team with the ball continues to try
until they get a correct answer, at which time the ball will advance. 
For all other ball positions, opponent may block an advance by answering correctly a question in english.
Possessor and Opponent are asked questions until ball advances or changes direction.
Possessor loses the ball to the Opponent upon giving two incorrect answers while opponent answers correctly twice.
When this occurs the administrator presses the "Change Possession" Button which switches the Arrows to show new direction.
Three advances are required to move from opponents goal to a position from which you have a chance to score.
Scores are made/blocked by answering questions at the scoring position.
The image of the ball moves upon successful advances. 
When the administrator presses the question Button, the question is displayed in a Text area left of the field img.
A 30 second timer starts upon displaying the question. It will sound a beep and a Homer Simpson "Doh!" upon expiration.
Upon timeout or a response to the question, the administrator can show the answer by pressing the "show Answer" Button. The answer is displayed and focus is set on the RightWrong Dropdown. The administrator enters R or W, which sets focus on the track button. Hitting return displays the question in the track with red or green background. 
This gives feedback to the players on the question, whether they answered correctly or not. 
The track at the bottom of the screen shows green or red for each question answered. Red indicates error, Green indicates correct. At the end of the normal questions, the red questions may be posed to the same team again until they turn green. This gives students the change to fix their mistakes.

This version of the game is standalone and does not require a server. It is written in javascript only. The questions are fetched from an array of items in a javascript function.

The important part of this game is not to win but to have fun learning english.


INSTRUCTIONS FOR THE ADMINISTRATOR:
---------------------------------------------
1. Display the Game by putting the following in the Navigation Bar at the top of the browser:  file:///.../footballEnglishStandalone/views/football.html (ellipses depends on your file system)
2. Press the Configure Link which pops up a configuration panel. Select the left team from the dropdown, select the right team from the 2nd dropdown, enter the game size (number of questions), click "Choose File" and navigate to 
.../questions/set1 (or other set, setX,  when more exist).
3. Click the Accept button. This places the icons in to represent the teams, reads in the questions, does a coin flip to decide which team gets the ball, etc. Clock should reflect the game size you put in.
4. Explain the Question and Answer text areas by clicking on show Answer. Explain the 30 second timer. If needed review the types of questions that will appear and how to answer correctly. 
5. Start play: ...Click the Question button. This will display a question and start a 30 second timer.
6. If the contestant answers the question with his final answer, click the Clear Button, this will stop the timer and the annoying beep and Doh! from Homer.
7. Click the "Show Answer" button. (May need 2 clicks). The answer is displayed and the focus is set to the RightWrong dropdown. Use the mouse to select Right or Wrong, or enter R or W from the keyboard. This will set focus on the "track" button.
8. Click "track" with mouse or hit the enter key to record the number with a right (green) or wrong (red) background. This will set the team dropdown to the other team in preparation for the next question.
9. Advance the Ball for a 1 0, place ball in Possession status for 0 1, try again for 0 0 or 1 1 ( First num is the possessing team, 2nd is opposing team,  1=right 0=wrong ).
10. If the possessing team loses the ball, press the Possession button. This will set up for the other team to advance the ball.
11. Repeat steps 5-10 until all of the questions are exhausted. When there are no more questions, enter the missed questions into "Extras" text box before pressing "Question". This will repeat the missed questions for the ultimate goal kicks.
12. Goal kicks should alternate between the teams. Advance the ball to the scoring position and ask both questions. A 1 1 means the kick was blocked, A 1 0 is a Goal . A 0 from the kicking team means they kicked wide. In that case, move the ball to the other scoring position and ask the two questions.
13. After a goal is scored, the other team gets questions until they get one right which places the ball in play. The app now automatically places an X for the opposing team for goalee kicks.


