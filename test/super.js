const { expect } = require("chai");
const { ethers } = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");

var superAppAddress = "0x6293Ce1363c05F2B4aFa4aDbb28780fD9afEC048";

require('dotenv').config();
var BN = web3.utils.BN;
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY_TWO = process.env.PUBLIC_KEY_TWO;
const PRIVATE_KEY_TWO = process.env.PRIVATE_KEY_TWO;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

const superAppJSON = require("../artifacts/contracts/DAOSuperApp.sol/DAOSuperApp.json");
const tokenJSON = require("../artifacts/contracts/token/DAOToken.sol/DAOToken.json");
var sf, signer, superApp, sTokenAddress, sToken, underlyingTokenAddress, underlying, daoTokenAddress, superDaoTokenAddress, daoToken, sDaoToken, treasuryAddress, sharePrice, network;
var logs = [];
const debug = false;

function log(msg) {
    logs.push(msg);
    if (debug) {
        console.log(msg);
    }
}

before('Get SuperApp details', async function () {
    network = await ethers.provider.getNetwork();
    log(network);
    sf = await Framework.create({
        networkName: "mumbai",
        provider: ethers.provider,
    });
    signer = sf.createSigner({
        privateKey: PRIVATE_KEY,
        provider: ethers.provider,
    });
    superApp = new ethers.Contract(superAppAddress, superAppJSON.abi, signer);
    sTokenAddress = await superApp.acceptedToken();
    log("sTokenAddress", sTokenAddress);
    underlyingTokenAddress = await superApp.want();
    underlying = new ethers.Contract(underlyingTokenAddress, tokenJSON.abi, signer);
    log("underlyingTokenAddress", underlyingTokenAddress);
    daoTokenAddress = await superApp.underlying();
    log("daoTokenAddress", daoTokenAddress);
    daoToken = new ethers.Contract(daoTokenAddress, tokenJSON.abi, signer);
    superDaoTokenAddress = await superApp.daoToken();
    log("superDaoTokenAddress", superDaoTokenAddress);
    sToken = sf.loadSuperToken(sTokenAddress);
    sDaoToken = sf.loadSuperToken(superDaoTokenAddress);
    treasuryAddress = await superApp.treasury();
    log("treasuryAddress", treasuryAddress);
    sharePrice = await superApp.sharePrice();
    log("sharePrice", sharePrice);
});

describe("SuperApp Config", async function(){

    it("should disable deposits", async function(){
        await (await superApp.setDepositsEnabled(false)).wait();
        expect(await superApp.depositsEnabled())
            .to.equal(false);
    });

    it("should enable deposits", async function(){
        await (await superApp.setDepositsEnabled(true)).wait();
        expect(await superApp.depositsEnabled())
            .to.equal(true);
    });

    it("should disable streams", async function(){
        await (await superApp.setStreamsEnabled(false)).wait();
        expect(await superApp.streamsEnabled())
            .to.equal(false);
    });

    it("should enable streams", async function(){
        await (await superApp.setStreamsEnabled(true)).wait();
        expect(await superApp.streamsEnabled())
            .to.equal(true);
    });

});

describe("Deposits and Grants", async function(){

    it("should deposit 1 WETH", async function(){
        const tBalBefore = await underlying.balanceOf(treasuryAddress);
        const daoBalBefore = await daoToken.balanceOf(PUBLIC_KEY);
        const amt = '1000000000000000000'; // 1 WETH
        await (await underlying.approve(superAppAddress, amt)).wait();
        sharePrice = await superApp.sharePrice();
        log("sharePrice", sharePrice);
        await (await superApp.deposit(underlyingTokenAddress, amt, PUBLIC_KEY)).wait();
        const tBalAfter = await underlying.balanceOf(treasuryAddress);
        const daoBalAfter = await daoToken.balanceOf(PUBLIC_KEY);
        expect(tBalAfter - tBalBefore).to.be.closeTo(parseInt(amt), 100000);
        expect(daoBalAfter).to.be.gt(daoBalBefore);
    });

    it("should deposit 100 DAI and swap to WETH and issue daoTokens", async function(){
        const daiAddress = "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F"; // mumbai
        const dai = new ethers.Contract(daiAddress, tokenJSON.abi, signer);
        const tBalBefore = await underlying.balanceOf(treasuryAddress);
        const daoBalBefore = await daoToken.balanceOf(PUBLIC_KEY);
        const amt = '100000000000000000000'; // 100 DAI
        await (await dai.approve(superAppAddress, amt)).wait();
        sharePrice = await superApp.sharePrice();
        log("sharePrice", sharePrice);
        await (await superApp.deposit(daiAddress, amt, PUBLIC_KEY)).wait();
        const tBalAfter = await underlying.balanceOf(treasuryAddress);
        const daoBalAfter = await daoToken.balanceOf(PUBLIC_KEY);
        expect(tBalAfter).to.be.gt(tBalBefore);
        expect(daoBalAfter).to.be.gt(daoBalBefore);
    });

    it("should deposit 100 erc20 and NOT swap to WETH and NOT issue daoTokens", async function(){
        const mockAddress = "0x490B8896ff200D32a100A05B7c0507E492938BBb"; // mumbai
        const mock = new ethers.Contract(mockAddress, tokenJSON.abi, signer);
        const tBalBefore = await mock.balanceOf(treasuryAddress);
        const daoBalBefore = await daoToken.balanceOf(PUBLIC_KEY);
        const amt = '3000'; // tiny Mock
        await (await mock.approve(superAppAddress, amt)).wait();
        await (await superApp.deposit(mockAddress, amt, PUBLIC_KEY)).wait();
        const tBalAfter = await mock.balanceOf(treasuryAddress);
        const daoBalAfter = await daoToken.balanceOf(PUBLIC_KEY);
        expect(tBalAfter).to.be.gt(tBalBefore);
        expect(daoBalAfter).to.equal(daoBalBefore);
    });

    it("should grant 100e18 daoTokens", async function(){
        const daoBalBefore = await daoToken.balanceOf(PUBLIC_KEY);
        const amt = '100000000000000000000'; // 100 daoToken
        await (await superApp.grant(PUBLIC_KEY, amt)).wait();
        const daoBalAfter = await daoToken.balanceOf(PUBLIC_KEY);
        expect(daoBalAfter - daoBalBefore).to.be.closeTo(parseInt(amt), 100000);
    });

});

describe("Superfluid Streams", function () {

    beforeEach("wait 3 seconds", async function(){
        await sleep(3000);
    });

    it("should start streaming to superApp", async function(){
        const flowRate = "31709791984";
        const createFlowOperation = sf.cfaV1.createFlow({
            "flowRate": flowRate,
            "receiver": superAppAddress,
            "superToken": sTokenAddress
        });
        const result = await createFlowOperation.exec(signer);
        await result.wait();
        const toApp = await sf.cfaV1.getFlow({
            "superToken": sTokenAddress.toLowerCase(),
            "sender": PUBLIC_KEY.toLowerCase(),
            "receiver": superAppAddress.toLowerCase(),
            "providerOrSigner": signer
        });
        log("toApp", toApp);
        const fromApp = await sf.cfaV1.getFlow({
            "superToken": superDaoTokenAddress.toLowerCase(),
            "sender": superAppAddress.toLowerCase(),
            "receiver": PUBLIC_KEY.toLowerCase(),
            "providerOrSigner": signer
        });
        log("fromApp", fromApp);
        const toTreasury = await sf.cfaV1.getFlow({
            "superToken": sTokenAddress.toLowerCase(),
            "sender": superAppAddress.toLowerCase(),
            "receiver": treasuryAddress.toLowerCase(),
            "providerOrSigner": signer
        });
        log("toTreasury", toTreasury);
        sharePrice = await superApp.sharePrice();
        log("sharePrice", sharePrice);
        expect(toApp.flowRate).to.equal(flowRate);
        expect(parseInt(fromApp.flowRate)).to.be.gt(0);
        expect(toTreasury.flowRate).to.equal(flowRate);
    });

    it("should delete flow to superApp", async function(){
        const flowOperation = sf.cfaV1.deleteFlow({
            "sender": PUBLIC_KEY,
            "receiver": superAppAddress,
            "superToken": sTokenAddress
        });
        const result = await flowOperation.exec(signer);
        await result.wait();
        const toApp = await sf.cfaV1.getFlow({
            "superToken": sTokenAddress.toLowerCase(),
            "sender": PUBLIC_KEY.toLowerCase(),
            "receiver": superAppAddress.toLowerCase(),
            "providerOrSigner": signer
        });
        expect(parseInt(toApp.flowRate)).to.equal(0);
    });

    it("should have canceled superDAOtoken outflow", async function(){
        const fromApp = await sf.cfaV1.getFlow({
            "superToken": superDaoTokenAddress.toLowerCase(),
            "sender": superAppAddress.toLowerCase(),
            "receiver": PUBLIC_KEY.toLowerCase(),
            "providerOrSigner": signer
        });
        log("fromApp", fromApp);
        expect(parseInt(fromApp.flowRate)).to.equal(0);
    });

    it("should cancel DaoToken flow to user but not outflow", async function(){
        sharePrice = await superApp.sharePrice();
        log("sharePrice", sharePrice);
        const flowRate = "31709791984";
        const createFlowOperation = sf.cfaV1.createFlow({
            "flowRate": flowRate,
            "receiver": superAppAddress,
            "superToken": sTokenAddress
            // userData?: string
        });
        var result = await createFlowOperation.exec(signer);
        await result.wait();
        const flowOperation = sf.cfaV1.deleteFlow({
            "sender": superAppAddress,
            "receiver": PUBLIC_KEY,
            "superToken": superDaoTokenAddress
        });
        result = await flowOperation.exec(signer);
        await result.wait();
        const toApp = await sf.cfaV1.getFlow({
            "superToken": sTokenAddress.toLowerCase(),
            "sender": PUBLIC_KEY.toLowerCase(),
            "receiver": superAppAddress.toLowerCase(),
            "providerOrSigner": signer
        });
        log("toApp", toApp);
        const fromApp = await sf.cfaV1.getFlow({
            "superToken": superDaoTokenAddress.toLowerCase(),
            "sender": superAppAddress.toLowerCase(),
            "receiver": PUBLIC_KEY.toLowerCase(),
            "providerOrSigner": signer
        });
        log("fromApp", fromApp);
        expect(parseInt(toApp.flowRate)).to.be.gt(0);
        expect(parseInt(fromApp.flowRate)).to.equal(0);
    });

    it("should increase flow to superApp", async function(){
        sharePrice = await superApp.sharePrice();
        log("sharePrice", sharePrice);
        const flowRate = "31709799999";
        const updateFlowOperation = sf.cfaV1.updateFlow({
            "flowRate": flowRate,
            "receiver": superAppAddress,
            "superToken": sTokenAddress
        });
        const result = await updateFlowOperation.exec(signer);
        await result.wait();
        const toApp = await sf.cfaV1.getFlow({
            "superToken": sTokenAddress.toLowerCase(),
            "sender": PUBLIC_KEY.toLowerCase(),
            "receiver": superAppAddress.toLowerCase(),
            "providerOrSigner": signer
        });
        log("toApp", toApp);
        const fromApp = await sf.cfaV1.getFlow({
            "superToken": superDaoTokenAddress.toLowerCase(),
            "sender": superAppAddress.toLowerCase(),
            "receiver": PUBLIC_KEY.toLowerCase(),
            "providerOrSigner": signer
        });
        log("fromApp", fromApp);
        expect(toApp.flowRate).to.equal(flowRate);
        expect(parseInt(fromApp.flowRate)).to.be.gt(0);
    });

    it("should delete only flow to superApp", async function(){
        const flowOperation = sf.cfaV1.deleteFlow({
            "sender": PUBLIC_KEY,
            "receiver": superAppAddress,
            "superToken": sTokenAddress
        });
        const result = await flowOperation.exec(signer);
        await result.wait();
        const toApp = await sf.cfaV1.getFlow({
            "superToken": sTokenAddress.toLowerCase(),
            "sender": PUBLIC_KEY.toLowerCase(),
            "receiver": superAppAddress.toLowerCase(),
            "providerOrSigner": signer
        });
        expect(parseInt(toApp.flowRate)).to.equal(0);
    });

    it("should start 2 flows to superApp", async function(){
        sharePrice = await superApp.sharePrice();
        log("sharePrice", sharePrice);
        const flowRate = "31709791984";
        var createFlowOperation = sf.cfaV1.createFlow({
            "flowRate": flowRate,
            "receiver": superAppAddress,
            "superToken": sTokenAddress
        });
        var result = await createFlowOperation.exec(signer);
        await result.wait();

        //number two:
        signer = sf.createSigner({
            privateKey: PRIVATE_KEY_TWO,
            provider: ethers.provider,
        });
        sharePrice = await superApp.sharePrice();
        log("sharePrice", sharePrice);
        createFlowOperation = sf.cfaV1.createFlow({
            "flowRate": flowRate,
            "receiver": superAppAddress,
            "superToken": sTokenAddress
        });
        result = await createFlowOperation.exec(signer);
        await result.wait();
        const toAppTwo = await sf.cfaV1.getFlow({
            "superToken": sTokenAddress.toLowerCase(),
            "sender": PUBLIC_KEY_TWO.toLowerCase(),
            "receiver": superAppAddress.toLowerCase(),
            "providerOrSigner": signer
        });
        //console.log("toAppTwo", toAppTwo);

        // switch back:
        signer = sf.createSigner({
            privateKey: PRIVATE_KEY,
            provider: ethers.provider,
        });

        // get Data:
        const toApp = await sf.cfaV1.getFlow({
            "superToken": sTokenAddress.toLowerCase(),
            "sender": PUBLIC_KEY.toLowerCase(),
            "receiver": superAppAddress.toLowerCase(),
            "providerOrSigner": signer
        });
        //console.log("toApp", toApp);
        
        expect(toApp.flowRate).to.equal(flowRate);
        expect(toAppTwo.flowRate).to.equal(flowRate);
    });

    it("should decrease one of 2 flows to superApp", async function(){
        sharePrice = await superApp.sharePrice();
        log("sharePrice", sharePrice);
        const fromAppBefore = await sf.cfaV1.getFlow({
            "superToken": superDaoTokenAddress.toLowerCase(),
            "sender": superAppAddress.toLowerCase(),
            "receiver": PUBLIC_KEY.toLowerCase(),
            "providerOrSigner": signer
        });
        log("fromAppBefore", fromAppBefore);
        const flowRate = "31709790000";
        const updateFlowOperation = sf.cfaV1.updateFlow({
            "flowRate": flowRate,
            "receiver": superAppAddress,
            "superToken": sTokenAddress
        });
        const result = await updateFlowOperation.exec(signer);
        await result.wait();
        const toApp = await sf.cfaV1.getFlow({
            "superToken": sTokenAddress.toLowerCase(),
            "sender": PUBLIC_KEY.toLowerCase(),
            "receiver": superAppAddress.toLowerCase(),
            "providerOrSigner": signer
        });
        log("toApp", toApp);
        const fromApp = await sf.cfaV1.getFlow({
            "superToken": superDaoTokenAddress.toLowerCase(),
            "sender": superAppAddress.toLowerCase(),
            "receiver": PUBLIC_KEY.toLowerCase(),
            "providerOrSigner": signer
        });
        log("fromApp", fromApp);
        expect(toApp.flowRate).to.equal(flowRate);
        //expect(parseInt(fromApp.flowRate)).to.be.lt(parseInt(fromAppBefore.flowRate));
    });

    it("should delete 1 flow to superApp", async function(){
        const flowOperation = sf.cfaV1.deleteFlow({
            "sender": PUBLIC_KEY,
            "receiver": superAppAddress,
            "superToken": sTokenAddress
        });
        const result = await flowOperation.exec(signer);
        await result.wait();
        const toApp = await sf.cfaV1.getFlow({
            "superToken": sTokenAddress.toLowerCase(),
            "sender": PUBLIC_KEY.toLowerCase(),
            "receiver": superAppAddress.toLowerCase(),
            "providerOrSigner": signer
        });
        expect(parseInt(toApp.flowRate)).to.equal(0);
    });

    it("should delete last remaining flow to superApp", async function(){
        //number two:
        signer = sf.createSigner({
            privateKey: PRIVATE_KEY_TWO,
            provider: ethers.provider,
        });
        const flowOperation = sf.cfaV1.deleteFlow({
            "sender": PUBLIC_KEY_TWO,
            "receiver": superAppAddress,
            "superToken": sTokenAddress
        });
        const result = await flowOperation.exec(signer);
        await result.wait();
        const toApp = await sf.cfaV1.getFlow({
            "superToken": sTokenAddress.toLowerCase(),
            "sender": PUBLIC_KEY_TWO.toLowerCase(),
            "receiver": superAppAddress.toLowerCase(),
            "providerOrSigner": signer
        });
        // switch back:
        signer = sf.createSigner({
            privateKey: PRIVATE_KEY,
            provider: ethers.provider,
        });
        expect(parseInt(toApp.flowRate)).to.equal(0);
    });

    after("sharePrice", async function(){
        sharePrice = await superApp.sharePrice();
        log("sharePrice", sharePrice);
        sToken = await sf.loadSuperToken(sTokenAddress);
        var treasurySuperBalance = await sToken.balanceOf({
            "account": treasuryAddress.toLowerCase(),
            "providerOrSigner": signer
        });
        log("treasurySuperBalance", treasurySuperBalance);
    });

});
