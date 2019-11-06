pragma solidity >=0.4.22 <0.6.0;

/// @title Voting with delegation.
contract Ballot {
    // This declares a new complex type which will
    // be used for variables later.
    // It will represent a single voter.
    struct Voter {
        
        uint prevoted;      // The number of availble votes for pre-vote
        uint finvoted;      // The number of availble votes for final-vote
        
        uint[] prevotes;    // indices of the pre-voted singers
        uint[] finvotes;    // indices of the final-voted singers
    }
    
    struct Singer {
        // bytes32 name;
        uint index;         // The index of the singer
        uint prevoteCount;
        uint finalvoteCount;
        bool finished;
    }
    
    address public chairperson;

    // This declares a state variable that
    // stores a `Voter` struct for each possible address.
    mapping(address => Voter) public voters;

    // A dynamically-sized array of `Singer` structs.
    
    Singer [] public singers;
    
    enum Phase {Init, Regs, PreVote, FinVote, Done}
    Phase public state = Phase.Done;
    
    // modifiers
    modifier validPhase(Phase reqPhase){
        require(state == reqPhase, "Invalid Phase.");
        _;
    }
    modifier onlyChair(){
        require(msg.sender == chairperson, "Only Chairperson Has Authorization.");
        _;
    }
    modifier notChair(){
        require(msg.sender != chairperson, "Chairperson Do Not Vote.");
        _;
    }
    
    
    
    /// Create a new ballot to choose one of `singerNames`.
    constructor(uint numSingers) public {
        chairperson = msg.sender;
        
        // For each of the provided singer names,
        // create a new singer object and add it
        // to the end of the array.
        for (uint i = 0; i < numSingers; i++) {
            // `Singer({...})` creates a temporary
            // Singer object and `singers.push(...)`
            // appends it to the end of `singers`.
            singers.push(Singer({
                index: i,
                prevoteCount: 0,
                finalvoteCount: 0,
                finished: false
            }));
        }
        state = Phase.Regs;
    }
    
    function changeState(Phase x) onlyChair public{
        require (x > state, "Cannot Go Back To The Previous State.");
        state = x;
    }
    
    function markFinished(uint singer) onlyChair public{
        singers[singer].finished = true;
    }
    
    function register(address voter) public validPhase(Phase.Regs) onlyChair{
        voters[voter].prevoted = 2;
        voters[voter].finvoted = 2;
    }

    
    /// Give your prevote to singer.
    function preVote(uint singer) public validPhase(Phase.PreVote) notChair{
        Voter storage sender = voters[msg.sender];
        require(sender.prevoted > 0, "All votes have been used.");
        require(singer>=0 && singer<singers.length, "Invalid Singer Index.");
        require(singers[singer].finished, "Singer Not Finished.");
        for (uint i = 0; i < sender.prevotes.length; i++){
            require(sender.prevotes[i] != singer, "Singer Already Been Voted.");
        }
        sender.prevoted -= 1;
        sender.prevotes.push(singer);
        singers[singer].prevoteCount += 1;
    }

    /// Give your vote to singer.
    function finVote(uint singer) public validPhase(Phase.FinVote) notChair{
        Voter storage sender = voters[msg.sender];
        require(sender.finvoted > 0, "All votes have been used.");
        require(singer>=0 && singer<singers.length, "Invalid Singer Index.");
        for (uint i = 0; i < sender.finvotes.length; i++){
            require(sender.finvotes[i] != singer, "Singer Already Been Voted.");
        }

        // If `singer` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        sender.finvoted -= 1;
        sender.finvotes.push(singer);
        singers[singer].finalvoteCount += 1;
    }

    
    
    function finalSingersRanking() public view validPhase(Phase.Done)
            returns(uint[] memory finalSingersRanking_)
    {
        finalSingersRanking_ = new uint[](singers.length);
        for (uint i=0; i<singers.length; i++){
            finalSingersRanking_[i] = singers[i].prevoteCount + singers[i].finalvoteCount;
        }
       
    }
    
    function preSingersRanking() public view
            returns(uint[] memory preSingersRanking_)
    {
        preSingersRanking_ = new uint[](singers.length);
        for (uint i=0; i<singers.length; i++){
            preSingersRanking_[i] = singers[i].prevoteCount;
        }
        
       
    }

    
    
}