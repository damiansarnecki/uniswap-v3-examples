import { ERC20__factory } from './../typechain-types/factories/ERC20__factory';
import { ERC20 } from './../typechain-types/ERC20';
import { UNISWAP_DATA } from "./../utils/UniswapData";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { UniswapV3Factory__factory } from "../typechain-types/factories/UniswapV3Factory__factory";
import { UniswapV3Factory } from "../typechain-types/UniswapV3Factory";
import { UniswapV3Pool__factory } from "../typechain-types/factories/UniswapV3Pool__factory";
import { UniswapV3Pool } from "../typechain-types/UniswapV3Pool";

import {
    abi as FACTORY_ABI,
} from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";

import {
  abi as POOL_ABI,
} from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";

describe("Creating pool", async () => {
    let owner: SignerWithAddress, user: SignerWithAddress;
    let uniswapFactory: UniswapV3Factory;
    let createdPool : UniswapV3Pool;

    let tokenOne : ERC20;
    let tokenTwo : ERC20;

    beforeEach(async () => {
        [owner, user] = await ethers.getSigners();

        const uniswapFactory = (await ethers.getContractAt(
            FACTORY_ABI,
            UNISWAP_DATA.factory
        )) as UniswapV3Factory;

        const TokenFactory = await ethers.getContractFactory("ERC20") as ERC20__factory;

        tokenOne = await TokenFactory.deploy(10000000, "Token One", "ONE");
        tokenTwo = await TokenFactory.deploy(10000000, "Token Two", "Two");
        await tokenOne.deployed();
        await tokenTwo.deployed();

        const poolAddress = await uniswapFactory.callStatic.createPool(tokenTwo.address, tokenOne.address, 3000);
       
        createdPool = await ethers.getContractAt(POOL_ABI, poolAddress) as UniswapV3Pool
    });

    it("should add liqudity", async () => {
        await tokenTwo.approve(createdPool.address, ethers.constants.MaxUint256)
        await tokenOne.approve(createdPool.address, ethers.constants.MaxUint256)
        const x = await createdPool.callStatic.mint(owner.address, 1500, 3000, 200 ,ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32));
        console.log(x)
    });
});
