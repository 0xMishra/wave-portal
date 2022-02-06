//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract Image{

    uint public totalFiles=0;
    
    event post(address user,uint id ,string filehash,uint time,string desc);

    struct File{
        address user;
        uint id;
        string filehash;
        uint timestamp;
        string desc;
    }

    File[]  files;

    function setHash(string memory _fileHash,string memory _desc) public{
        files.push(File(msg.sender,totalFiles,_fileHash,block.timestamp,_desc));
        emit post(msg.sender,totalFiles , _fileHash,block.timestamp,_desc);
        totalFiles++;
    }

    function getAllFiles() public view returns(File[] memory) {
        return files;
    }

}
