var chain = "polygon";

var rpcURLs = {};
rpcURLs.rinkeby = "eth-rinkeby.alchemyapi.io/v2/n_mDCfTpJ8I959arPP7PwiOptjubLm57";
rpcURLs.mumbai = "polygon-mumbai.g.alchemy.com/v2/Ptsa6JdQQUtTbRGM1Elvw_ed3cTszLoj";
rpcURLs.polygon = "polygon-mainnet.g.alchemy.com/v2/Ptsa6JdQQUtTbRGM1Elvw_ed3cTszLoj";

var factory;
var ethersFactory;
var web3;
var BN;
var blockExplorer = ""
var addr = {};

var factories = {};
factories.rinkeby =     "0xAa18cDA7c7c8894595B4e6bdEc7647Ff13e663ae";
factories.mumbai =      "0xAa18cDA7c7c8894595B4e6bdEc7647Ff13e663ae";
factories.polygon =     "0x1d8e39704619E07dd0bd27CadBa0D6F607e15977"; // localhost:polygon
var factoryAddress = factories[chain];

function getFactory() {
    var rpcURL = rpcURLs[chain];
    factoryAddress = factories[chain];
    //rpcURL = "localhost:8545";                  //localhost!!!!
    web3 = AlchemyWeb3.createAlchemyWeb3("wss://"+rpcURL);
    //web3 = AlchemyWeb3.createAlchemyWeb3("http://"+rpcURL); // localhost!!!!
    //const prov = {"url": "http://"+rpcURL};           //localhost!!!!
    const prov = {"url": "https://"+rpcURL};
    var provider = new ethers.providers.JsonRpcProvider(prov);

    factory = new web3.eth.Contract(factoryABI, factoryAddress);
    ethersFactory = new ethers.Contract(factoryAddress, factoryABI, provider);
    BN = web3.utils.BN;
    setAddr();
}
getFactory();

const ipfsURL = "https://api.nft.storage/upload";
var showWizard = false;

// step one
var symbol;
var superAppAddress = "";
var daoTokenAddress = "";
var superTokenAddress = "";
var tokenBlock = 0;

// step two
var governorAddress = "";
var timelockAddress = "";
var govBlock = 0;

var roles = {
    MANAGER: web3.utils.keccak256("MANAGER_ROLE"),
};

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

function setAddr() {
    if (chain == "mumbai") {
        //Mumbai:
        blockExplorer = "https://mumbai.polygonscan.com/";
        addr.router = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
        addr.Resolver = "0x8C54C83FbDe3C59e59dd6E324531FB93d4F504d3";
        addr.SuperTokenFactory = "0x200657E2f123761662567A1744f9ACAe50dF47E6";
        addr.SuperHost = "0xEB796bdb90fFA0f28255275e16936D25d3418603";
        addr.cfa = "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873";
        addr.WETH = "0x3C68CE8504087f89c640D02d133646d98e64ddd9";
        addr.DAI = "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F";
        addr.USDC = "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e";
        addr.WETHx = "0x7dA8ba196E747eec76246726Dc5BFC8a459BCD3e";
    }
    if (chain == "polygon") {
        //Polygon
        blockExplorer = "https://polygonscan.com/";
        addr.router = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
        addr.Resolver = "0xE0cc76334405EE8b39213E620587d815967af39C";
        addr.SuperTokenFactory = "0x2C90719f25B10Fc5646c82DA3240C76Fa5BcCF34";
        addr.SuperHost = "0x3E14dC1b13c488a8d5D310918780c983bD5982E7";
        addr.cfa = "0x6EeE6060f715257b970700bc2656De21dEdF074C";
        addr.WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
        addr.DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
        addr.USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
        addr.ETHx = "0x27e1e4E6BC79D93032abef01025811B7E4727e85";
        addr.WETHx = "0x27e1e4E6BC79D93032abef01025811B7E4727e85";
        addr.USDCx = "0xCAa7349CEA390F89641fe306D93591f87595dc1F";
        addr.WBTC = "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6";
        addr.WBTCx = "0x4086eBf75233e8492F1BCDa41C7f2A8288c2fB92";
        addr.DAIx = "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2";
    }
    if ( chain == "rinkeby" ) {
        blockExplorer = "https://rinkeby.etherscan.io/";
        addr.router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
        addr.Resolver = "0x659635Fab0A0cef1293f7eb3c7934542B6A6B31A";
        addr.SuperTokenFactory = "0xd465e36e607d493cd4CC1e83bea275712BECd5E0";
        addr.SuperHost = "0xeD5B5b32110c3Ded02a07c8b8e97513FAfb883B6";
        addr.cfa = "0xF4C5310E51F6079F601a5fb7120bC72a70b96e2A";
        addr.WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
        addr.DAI = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";
        addr.USDC = "";
        addr.ETHx = "0xa623b2DD931C5162b7a0B25852f4024Db48bb1A0";
        addr.WETHx = addr.ETHx; // "0x3FbcaeaA76d6f7Fe31DaEa1655b97F1436c0a747";
        addr.USDCx = "";
        addr.WBTC = "";
        addr.WBTCx = "";
        addr.DAIx = "";
        addr.fDAI = "0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7";
        addr.fDAIx = "0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90";
        addr.fUSDC = "0xbe49ac1EadAc65dccf204D4Df81d650B50122aB2";
        addr.fUSDCx = "0x0F1D7C55A2B133E000eA10EeC03c774e0d6796e8";
    }
}
setAddr();
var chainName = {};
chainName.rinkeby = "Ethereum Testnet Rinkeby";
chainName.ethereum = "Ethereum Network";
chainName.polygon = "Matic(Polygon) Mainnet";
chainName.mumbai = "Mumbai(Polygon) Testnet";

//const WETH = new web3.eth.Contract(tokenABI, addr.WETH); // need this?
//const resolver = new web3.eth.Contract(resolverABI, addr.Resolver);
//const cfa = new web3.eth.Contract(cfaABI, addr.cfa);
//const host = new web3.eth.Contract(hostABI, addr.SuperHost);

var gas = web3.utils.toHex(new BN('3000000000')); // 3 Gwei;
var dappChain = 4; // default to Rinkeby
var userChain;
var accounts;

var showProfile = false;

function abbrAddress(address){
    if (!address) {
        address = ethereum.selectedAddress;
    }
    return address.slice(0,4) + "..." + address.slice(address.length - 4);
}


async function main() {
    dappChain = await web3.eth.getChainId();
    console.log("The chainId is " + dappChain);

    accounts = await web3.eth.getAccounts();
    
    userChain = await ethereum.request({ method: 'eth_chainId' });
    console.log("The chainId of connected account is " + web3.utils.hexToNumber(userChain));

    if ( !correctChain() ) {
        if ( userChain == 80001 ) {
            chain = "mumbai";
            getFactory();
            $(".chain").text(chain);
        } else {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: web3.utils.toHex(dappChain) }],
            });
        }
    }

    window.ethereum.on('accountsChanged', function () {
        log("accounts changed");
        web3.eth.getAccounts(function (error, accts) {
            console.log(accts[0], 'current account after account change');
            accounts = accts;
            location.reload();
        });
    });

    window.ethereum.on('chainChanged', function () {
        log("chain changed");
        location.reload();
    });

    if (ethereum.selectedAddress) {
        return afterConnection();
    } else {
        if(window.location.hash) {
            var hash = window.location.hash.substring(1);
            console.log("hash", hash);
            if ( hash.match(/^0x/) ) {
                appAddress = hash;
                showProfile = true;
                $("#public-profile").show();
            }
        }
        if (showProfile) {
            return afterConnection();
        } else {
            $(".section").hide();
            showWizard = true;
            $(".welcome").show();
        }
        
    }
    
}

function correctChain() {
  var correct = false;
  if (accounts.length < 1) {
      return true;
  }
  if (dappChain == userChain) {
    correct = true;
  }
  return correct;
}

async function afterConnection() {
    return new Promise(async function(resolve, reject) {
        if (ethereum.selectedAddress) {
            $(".connect").find("span").text( abbrAddress() );
            $(".connect img").attr("src", "https://web3-images-api.kibalabs.com/v1/accounts/" + ethereum.selectedAddress + "/image").css("width", "16px").css("margin-right", "5px");
            $("#start-button").text("Get Started");
        }
        status("Connected as " + abbrAddress() );
        
        $(".section").hide();
        showWizard = true;
        $(".welcome").show();
        resolve();    
    });
}

async function connectWallet() {
    status("Connecting...");
    if (window.ethereum) {
        //console.log("window.ethereum true");
        return window.ethereum
            .enable()
            .then(async result => {
                // Metamask is ready to go!
                //console.log(result);
                accounts = result;
                return afterConnection();
            })
            .catch(reason => {
                // Handle error. Likely the user rejected the login.
            });
    } else {
        // The user doesn't have Metamask installed.
        console.log("window.ethereum false");
    } 
} // connectWallet()

function fromWei(amount) {
    return web3.utils.fromWei(new BN(amount));
}

async function updateStats() {

}

async function addToken() {
    const tokenAddress = daoTokenAddress;
    const tokenSymbol = symbol;
    const tokenDecimals = 18;
    var tokenImage = "https://backer.vip/assets/images/logo/stream.png";
    console.log("tokenImage", tokenImage);

    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: tokenAddress, // The address that the token is at.
                    symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: tokenDecimals, // The number of decimals in the token
                    image: tokenImage, // A string url of the token logo
                },
            },
        });

        if (wasAdded) {
            console.log('Thanks for your interest!');
        } else {
            console.log('Your loss!');
        }
    } catch (error) {
        console.log(error);
    }
    return false;
}



$( document ).ready(function() {

    main();

    $('select').formSelect();

    $(".chain").text(chain);

    $( "body" ).on( "click", ".add", async function() {
        addToken();
        return false;
    });

    $(".connect").click(function(){
        //wizard
        var $button = $(this);
        connectWallet()
        .then(function(){
            if ( $button.attr("id") == "start-button" ) {
                $(".welcome").hide();
                $("#token-card").show();
            }
        });
        return false;
    });

    $("#create-token").click(async function(){
        var $button = $(this);
        var name = $("#tokenName").val();
        symbol = $("#tokenSymbol").val();
        var acceptedSymbol = $("#tokenAccepted").val();
        var accepted;
        if ( acceptedSymbol in addr ) {
            accepted = addr[acceptedSymbol];
        } else {
            log(`Error: accepted token ${acceptedSymbol} for ${chain} not found`);
            return false;
        }
        status("deploying Token + Manager contract for " + name + " (" + symbol + ")...");
        $button.text("Deploying...");
        const nonce = await web3.eth.getTransactionCount(accounts[0], 'latest');
        const tx = {
            'from': ethereum.selectedAddress,
            'to': factoryAddress,
            'gasPrice': gas,
            'nonce': "" + nonce,
            'data': factory.methods.createDAOSuperApp(name, symbol, accepted, addr.WETH, addr.SuperHost, addr.cfa, addr.router).encodeABI()
        };
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
        });
        var pendingTxHash = txHash;

        var filter = await ethersFactory.filters.DAOSuperAppCreated();
        ethersFactory.on(filter, (owner, app, underlying, sToken, event) => { 
            console.log("superApp created at " + app);
            console.log("token created at " + underlying);
            console.log("sToken created at " + sToken);
            console.log(event);
            superAppAddress = app;
            daoTokenAddress = underlying;
            superTokenAddress = sToken;
            tokenBlock = event.blockNumber;
            log("Token created at " + underlying);
            $button.text("Contracts Deployed");
            $(".section").hide();
            $("#gov-card").show();
        });
        return false;
    });

    $("#create-gov").click(async function(){
        var $button = $(this);
        var votingPeriod = $("#govVotingPeriod").val();
        var vetoable = false;
        if ( $("#govVetoable:checked").val() ) {
            vetoable = true;
        }
        status("deploying Governor + Timelock contracts...");
        $button.text("Deploying...");
        const nonce = await web3.eth.getTransactionCount(accounts[0], 'latest');
        const tx = {
            'from': ethereum.selectedAddress,
            'to': factoryAddress,
            'gasPrice': gas,
            'nonce': "" + nonce,
            'data': factory.methods.createGoverance(daoTokenAddress, vetoable, votingPeriod).encodeABI()
        };
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
        });
        var pendingTxHash = txHash;

        var filter = await ethersFactory.filters.DAOGovernorCreated();
        ethersFactory.on(filter, (owner, governor, timelock, event) => { 
            console.log("governor created at " + governor);
            console.log("timelock created at " + timelock);
            console.log(event);
            governorAddress = governor;
            timelockAddress = timelock;
            govBlock = event.blockNumber;
            log("Governor created at " + governorAddress);
            log("Timelock created at " + timelockAddress);
            $button.text("Contracts Deployed");
            $(".section").hide();
            var detailsHTML = getDetailsHTML();

            $("#details-card").html(detailsHTML).show();
        });
        return false;
    });

});



// HTML templates

function getDetailsHTML() {
    var html = "";
    html = `
    <div class="row card-panel">
    <h4>DAO Created Successfully<span class="new badge chain" data-badge-caption="">Rinkeby</span></h3>
    <p>Five contracts have been deployed to ${chain}:</p>
    <ul class="collection with-header">
        <li class="collection-header"><h6>Contracts</h6></li>
        <li class="collection-item"><strong>DAO Token</strong>: <code>${daoTokenAddress}</code><a target="_blank" href="${blockExplorer}/address/${daoTokenAddress}"><i class="tiny material-icons">link</i></a> - This is an ERC20 governance token that supports on-chain voting on DAO proposals.</li>
        <li class="collection-item"><strong>Super Token</strong>: <code>${superTokenAddress}</code><a target="_blank" href="${blockExplorer}/address/${superTokenAddress}"><i class="tiny material-icons">link</i></a> - This is an <em>upgraded</em> version of your DAO token. It can be streamed in real-time to any address, but will need to be downgraded(unwrapped) to use for voting.</li>
        <li class="collection-item"><strong>DAO Manager</strong>: <code>${superAppAddress}</code><a target="_blank" href="${blockExplorer}/address/${superAppAddress}"><i class="tiny material-icons">link</i></a> - The manager contract manages distribution of your tokens via 1) deposits, 2) streaming, and/or 3) grants.</li>
        <li class="collection-item"><strong>Governor</strong>: <code>${governorAddress}</code><a target="_blank" href="${blockExplorer}/address/${governorAddress}"><i class="tiny material-icons">link</i></a> - Open Zeppelin Governor contract that enables DAO proposals and voting. <a href="https://docs.openzeppelin.com/contracts/4.x/governance">Learn more</a>.</li>
        <li class="collection-item"><strong>Timelock</strong>: <code>${timelockAddress}</code><a target="_blank" href="${blockExplorer}/address/${timelockAddress}"><i class="tiny material-icons">link</i></a> - Open Zeppelin Timelock contract that ultimately executes DAO proposals and acts a treasury, holding all funds.</li>
    </ul>
    <h5>Next Steps: Add the DAO to Tally</h5>
    <p>Tally provides an interface for creating proposals and enabling voting (used by Compound and others). You can add your DAO to Tally by going to <a target="_blank" href="https://alpha.withtally.com/register/protocol">https://alpha.withtally.com/register/protocol</a>. You will be asked to fill in details about the DAO, including:</p>
    <ul class="collection with-header">
        <li class="collection-header"><h6>Token</h6></li>
        <li class="collection-item">Type: choose <code>ERC20</code></li>
        <li class="collection-item">Token address: <code>${daoTokenAddress}</code></li>
        <li class="collection-item">Chain: choose <code>${chainName[chain]}</code></li>
        <li class="collection-item">Start block: <code>${tokenBlock}</code></li>
    </ul>
    <ul class="collection with-header">
        <li class="collection-header"><h6>Governance</h6></li>
        <li class="collection-item">Governance type: choose <code>OPENZEPPELINGOVERNOR</code></li>
        <li class="collection-item">Chain: choose <code>${chainName[chain]}</code></li>
        <li class="collection-item">Governor address: <code>${governorAddress}</code></li>
        <li class="collection-item">Start block: <code>${govBlock}</code></li>
    </ul>
  </div>
    `;
    return html;
}

function wrongNetworkModal(ctx){
    var html = "";
    html = `
    <div class="fade modal-backdrop show"></div>
    <div role="dialog" aria-modal="true" class="modal-theme modal-switch light modal" tabindex="-1" style="display: block;">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header"><div class="modal-title-custom modal-title h4">Switch Network</div></div>
                <div class="modal-body" style="margin-left: 20px;">
                    <p>DAOit is currently deployed to Rinkeby testnet.</p>
                    <p><b>To get started, please switch your network by following the instructions below:</b></p>
                    <ol>
                        <li>Open Metamask</li>
                        <li>Click the network select dropdown</li>
                        <li>Click on "Rinkeby Test Network"</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
    `;
    return html;
}

function log(message) {
    console.log(message);
    status(message);
}

function status(message) {
    M.toast({html: message});
}


function ipfsToHttp(ipfs) {
    var http = "";
    var cid = ipfs.replace("ipfs://", "");
    http = "https://" + cid + ".ipfs.dweb.link";
    return http;
}

function cidToHttp(cid) {
    var http = "";
    http = "https://" + cid + ".ipfs.dweb.link";
    return http;
}

function opts(file) {
    var opts = { 
        method: 'post', 
        headers: new Headers({
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU0NkZiYmNhOEIzZDIwMDAzZTA2ZjMzZmRBN0E0NzUxMGExRUY5OTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyODYxMDE3NzQxNSwibmFtZSI6InNwcm91dCBtZXRhZGF0YSJ9.6YwPqstbUyRfNiGwEaYccfGZZYGmXOSuAuLzLduwdRM', 
            'Content-Type': 'application/json'
        }), 
        body: file
    };
    return opts;
}

