//SPDX-License-Identifier:MIT
pragma solidity ^0.8.6;

contract DGIT {

    enum Status {
        OPEN,
        CLOSED,
        MERGED
    }

    struct Pull {
        uint256 pullID;
        address owner;
        Status status;
        uint256 repoId;
        string streamID;
        uint256 time;
    }

    struct Repository {
        string name;
        uint256 repoID;
        string description;
        address[] owners;
        string cids;
        string infoHash;
        bool isBackUpLatest;
    }

    uint256 private repoID = 0;
    uint256 private pullID = 0;

    mapping(address => Repository[]) repoByUser;
    mapping(uint256 => Repository) repoByID;

    mapping(uint256 => Pull) public pullsByID;
    mapping(uint256 => Pull[]) public pullsByRepo;
    mapping(address => Pull[]) public pullsByUser;


    // Check if the caller is an owner of the repository
    function isOwner(uint256 _repoID) public view returns (bool) {
        require(bytes(repoByID[_repoID].name).length > 0, "Repository Doesn't exist");
        Repository memory repo = repoByID[_repoID];
        for (uint i = 0; i < repo.owners.length; i++) {
            if (repo.owners[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    // Check if a PR belongs to a specific repo
    function isInRepo(uint256 _repoID, uint256 _PRID) public view returns (bool) {
        Pull[] memory _pr = pullsByRepo[_repoID];
        for (uint i = 0; i < _pr.length; i++) {
            if (keccak256(bytes(_pr[i].streamID)) == keccak256(bytes(pullsByID[_PRID].streamID))) {
                return true;
            }
        }
        return false;
    }

    // Create a new repository
    function createRepo(
        string memory _name,
        string memory _desc,
        string memory _infoHash,
        bool _isEncrypted
    ) public returns (uint256) {
        repoID++;
        address[] memory _owners = new address[](1);
        _owners[0] = msg.sender;


        Repository memory repo = Repository({
            repoID: repoID,
            name: _name,
            description: _desc,
            owners: _owners,
            infoHash: _infoHash,
            cids: "",
            isBackUpLatest: _isEncrypted
        });

        repoByUser[msg.sender].push(repo);
        repoByID[repoID] = repo;
        return repoID;
    }

    function getRepoByUser() public view returns(Repository[] memory)
    {
        return repoByUser[msg.sender];
    }

    function getRepoByID(uint256 _id) public view returns(Repository memory)
    {
        return repoByID[_id];
    }


    function getAllRepo() public view returns (Repository[] memory) {
    require(repoID >= 1, "No repositories");
    
    // Predefine the size of the array
    Repository[] memory _repo = new Repository[](repoID);
    
    // Populate the array
    for (uint256 i = 1; i <= repoID; i++) {
        _repo[i - 1] = repoByID[i]; // Adjust index since arrays are 0-based
    }
    
    return _repo;
}



    // Create a new pull request
    function createPull(string memory _streamID, uint256 _repoID) public returns (uint256) {
        pullID++;
        Pull memory pull = Pull({
            pullID: pullID,
            owner:msg.sender,
            status: Status.OPEN,
            streamID: _streamID,
            repoId: _repoID,
            time: block.timestamp
        });

        pullsByRepo[_repoID].push(pull);
        pullsByUser[msg.sender].push(pull);
        pullsByID[pullID] = pull;
        return pullID;
    }

    function getPullByUser() public view returns(Pull[] memory)
    {
            return pullsByUser[msg.sender];
    }

    function getPullByID(uint256 _id) public view returns(Pull memory)
    {
            return pullsByID[_id];
    }

    function getPullByRepo(uint256 _id) public view returns(Pull[] memory)
    {
        return pullsByRepo[_id];
    }

    // Merge a pull request into the repository
    function mergePull(
        string memory _infoHash,
        uint256 _pullID,
        uint256 _repoID
    ) public returns (bool) {
        require(isOwner(_repoID), "Not Repo Owner");
        require(pullsByID[_pullID].status==Status.OPEN, "Pull Request is not Open");
        pullsByID[_pullID].status = Status.MERGED;
        repoByID[_repoID].infoHash = _infoHash;
        return true;
    }


    function addOwner(uint256 _repoID, address _addr) public returns (bool) {
    require(isOwner(_repoID), "Not Repo Owner");
    repoByID[_repoID].owners.push(_addr);
    repoByUser[_addr].push(repoByID[_repoID]);
    return true;
}

    // Close a pull request
    function closePR(uint256 _pullID, uint256 _repoID) public returns (bool) {
        require(isInRepo(_repoID, _pullID), "IS NOT PART OF REPO");
        require(isOwner(_repoID), "Not Repo Owner");
        require(pullsByID[_pullID].status==Status.OPEN, "Pull Request is not Open");

        pullsByID[_pullID].status = Status.CLOSED;
        return true;
    }
}

// create direct commits by owner