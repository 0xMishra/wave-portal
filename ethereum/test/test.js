const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Image", function () {
  let Image;
  let image;
  let choosenHash = "0x06e41f3efF3107f728Bf015E573E56389bf9181b";
  let choosenHash1 = "0x661F64De262622868824b3f61836D34e9644A07b";
  let signer;
  let secUser;
  beforeEach(async () => {
    [signer, secUser] = await ethers.getSigners();
    Image = await ethers.getContractFactory("Image");
    image = await Image.deploy();
    await image.deployed();
  });
});
