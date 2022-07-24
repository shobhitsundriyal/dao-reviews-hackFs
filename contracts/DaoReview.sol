//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title DAO Review Contract
/// @author Ashis(akp111)

contract DaoReview {

  //*********************     State Variables           ***************************/
     using Counters for Counters.Counter;
    Counters.Counter private _reviewIds;

  //*********************      Structures                ***************************/

  // // struct for storing reviwer details
  // Most probably we wont need it  
  struct Review{
      //  Time at which the reviewer submitted its review (option can be omited later)
      uint256 timestamp;
      //  Address of the reviwer
      address reviewer;
      //  Review submitted by the reviwer
      string comment;
      // Store number of upvotes;
        uint128 upVote;
     // Store number of downvotes;
        uint128 downVote;
  }

  // struct to define data to be stored for a dao
  // Not storing name, desciption, icon onchain because we can emit it out as event
  // and can be indexed by a subgraph
  struct DaoDetails {
    // One who lists the DAO
    address daoCreator;
    // Store DAO owners;
    address[] daoOwners;
    //IPFS Hash of all the DAO Data
    string ipfsHash;
    //  For NFT gated access
    address nftContractAddress;
    //  For ERC20 token gated access
    address erc20Contract;
    //  To check if a DAO is authentic or not: HOW WILL WE CHECK THIS?
    bool isVerified;
    // To set the flag if the DAO is ERC20/ERC721 gated
    bool isErc20Gated;
  }

  //Unique address -> DAO Mapping: Can be any unique dao address(ERC20/ERC721)
  mapping(address => DaoDetails) daoMapping;

  //DAO -> Review mapping
  mapping(address => uint[]) daoReviews;

  //Review ID -> Reviews
  mapping(uint => Review) reviews;

  //*********************      Events                ***************************/
  //  Event when a DAO is listed
  event DAOCreated(
    address indexed creator,
    address indexed uniqueAddress,
    string indexed ipfsHash //This contains all the DAO Data like name, description, icon etc.
  );

  // Event when a review is added
  event ReviewAdded(
    uint indexed reviewId,
    address indexed dao,
    address reviewer,
    string indexed ipfsHash
  );

  //If the DAO is ERC20 gated, then the isErc20Gated will be true and unique address will be ERC20 address
  // Else, it's vice versa (NFT Gated)
  function registerDao(address _daoCreator, address[] memory _daoOwners, address uniqueAddress, bool _isErc20Gated, string memory _ipfsHash) public returns(address) {
      require(_daoCreator != address(0), "Creator Address cannot be zero");
      require(_daoOwners.length > 0, "DAO Owners cannot be 0");
      require(uniqueAddress != address(0), "DAO needs to be provide a gating address.");

      if(_isErc20Gated) {
          //DAOs are verified by default
          daoMapping[uniqueAddress] = DaoDetails(_daoCreator, _daoOwners, _ipfsHash, address(0), uniqueAddress, true, true);
      }
      else {
          daoMapping[uniqueAddress] = DaoDetails(_daoCreator, _daoOwners, _ipfsHash, uniqueAddress, address(0), true, false);
      }

      emit DAOCreated(_daoCreator, uniqueAddress, _ipfsHash);
      return uniqueAddress;

  }

    //daoAddress - Unique Gating address(ERC20/ERC721)
  function reviewDao(address daoAddress, string memory _ipfsHash) public returns(uint) {
      DaoDetails memory dao = daoMapping[daoAddress];
      require(dao.daoCreator != address(0), "DAO not found!");

      _reviewIds.increment();
      uint256 reviewId = _reviewIds.current();

      if(dao.isErc20Gated && checkGatingCondition(msg.sender, dao.erc20Contract, true)) {
          reviews[reviewId] = Review(block.timestamp, msg.sender, _ipfsHash, 0, 0);
          daoReviews[dao.erc20Contract].push(reviewId);
      }
      else if(checkGatingCondition(msg.sender, dao.nftContractAddress, false)){
          reviews[reviewId] = Review(block.timestamp, msg.sender, _ipfsHash, 0, 0);
          daoReviews[dao.nftContractAddress].push(reviewId);
      }

      emit ReviewAdded(reviewId, daoAddress, msg.sender, _ipfsHash);
      return reviewId;
  }

  //// Gating condition for DAO Reviewing (Check if the user has the particular balance or not) - only internal function
  function checkGatingCondition(address _user, address _uniqueAddress, bool _isErc20Gated) internal view returns(bool) {
      if(_isErc20Gated) {
          //Check if user owns the ERC20
          ERC20 tokenAddress = ERC20(_uniqueAddress);
          uint userBalance = tokenAddress.balanceOf(_user);
          require(userBalance > 0, "ERC20 Gated: User is not a part of the DAO");
      }
      else {
          ERC721 tokenAddress = ERC721(_uniqueAddress);
          uint userBalance = tokenAddress.balanceOf(_user);
          require(userBalance > 0, "ERC721 Gated: User is not a part of the DAO");
      }

      return true;
  }

  //Vote for a specific review - need to pass the reviewId and dao's unique address
  // VOTE - TRUE for upvote, FALSE for downvote
  function voteForReview(uint reviewId, bool vote, address _uniqueAddress) public {
      Review memory review = reviews[reviewId];
      DaoDetails memory dao = daoMapping[_uniqueAddress];

      if(dao.isErc20Gated) {
          if(vote && checkGatingCondition(msg.sender, dao.erc20Contract, true)) {
            review.upVote = review.upVote+1;
          }
          else if(checkGatingCondition(msg.sender, dao.erc20Contract, true)) {
            review.downVote = review.downVote + 1;
          }
      } else {
          if(vote && checkGatingCondition(msg.sender, dao.nftContractAddress, true)) {
            review.upVote = review.upVote+1;
          }
          else if(checkGatingCondition(msg.sender, dao.nftContractAddress, true)) {
            review.downVote = review.downVote + 1;
          }
      }

      // Updated the reviews with the latest voting
      reviews[reviewId] = review;
  }

  //************** GET FUNCTIONS *****************//

  function getDaoInformation(address _uniqueAddress) public view returns(DaoDetails memory) {
      return daoMapping[_uniqueAddress];
  }

  function getReviewIDsForDao(address _uniqueAddress) public view returns(uint[] memory){
      return daoReviews[_uniqueAddress];
  }

  function getReviewFromReviewId(uint _id) public view returns(Review memory) {
      return reviews[_id];
  }

}

contract TestToken is ERC20 {

    address owner;
    address multiSig;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(uint256 initialSupply, address _multiSig) ERC20("TEST", "TEST") {
        require(_multiSig != address(0), "Mutisig address cannot be zero");

        uint256 supply = initialSupply * (1 ether);
        owner = msg.sender;
        multiSig = _multiSig;
        _mint(multiSig, supply);
    }

    function setMultiSig(address _multiSig) public onlyOwner {
        require(_multiSig != address(0), "Mutisig address cannot be zero");
        multiSig = _multiSig;
    }

    function mintMore(uint256 supply) public onlyOwner {
        require(multiSig != address(0), "Mutisig address cannot be zero");
        _mint(multiSig, supply);
    }

}