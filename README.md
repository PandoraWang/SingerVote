# Blockchain Application For Singer Ballot



### Project Description 

1. **Overview:** In this project we deveploed a Dapp for a voting system which could be applied in a singer contest
2. **Background Information:** Singer is the most popular music competition show in China. It features a very varied cast of singers performing each week, usually with seven singers, who performed for a 500-member audience. The votes cast from the audience were the sole determinant for the results. However, since the vote counting is not transparent, a rumor is always there, saying that cheating exists in the ballot. Therefore, a smart contract for Singer Ballot has come to our mind , we believed that this end-to-end decentralized(Dapp) technology could solve this problem.

# this is test

1. function prevote (unit singer)

In the pre-vote round, every audience has 3 votes, which can be voted for three different singers,  once this singer has finished his/her performances. 

Modifiers:

	a. The singer has finished the performance
	
	b. The audience has not used up his/her votes
	
	c. The singer has not been voted by this audience


2. function finalvote (unit[ ] singers)

In the final-vote round, every audience has 3 votes, which can be voted for three different singers after all the performances have finished.

Modifiers:

	a. All the performances have finished.
	
	b. The audience has not voted for final round
	
	c. There is no repeat vote for the same singer in this audience vote options


3. function markFinished (unit singer)

After a singer finishing his/her performance, the singer is marked has singed. 

Modifiers:

	a. The message sender should be the chairperson


4. function realtimeRank( )

During the competition, audience can check the real time ranking any time. The ranking is based on pre-vote round.

Modifiers:

	a. There is still performance not finished.


5. function finalRank( )


After all the performances have finished, a final rank is generated which is based on 50% pre-vote round and 50% final round.


Modifiers:

	a. All the performances have finished.







