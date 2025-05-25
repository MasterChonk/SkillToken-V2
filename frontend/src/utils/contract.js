import { ethers } from "ethers";

  global.CONTRACT_ADDRESS;
  global.CONTRACT_ABI;
  
export async function ethersInitialize() {
    try {
        //should be changed if name of smartcontract is diferent from MyToken
        const response = await fetch('/MyToken.json');
      
        if (!response.ok) {
          throw new Error(`Loading error: ${response.status} ${response.statusText}`);
        }
      
        const artifact = await response.json();
      
        if (!artifact.abi) {
          throw new Error("ABI not found");
        }
    
        global.CONTRACT_ABI = artifact.abi;
      } catch (error) {
        console.error("Error in ABI:", error.message);
      }
      try {
        //should be changed if name of smartcontract is diferent from MyToken
        const response = await fetch('/MyToken-address.json');
      
        if (!response.ok) {
          throw new Error(`Loading error: ${response.status} ${response.statusText}`);
        }
      
        const artifact = await response.json();
      
        if (!artifact.address) {
          throw new Error("Address not found");
        }
      
        global.CONTRACT_ADDRESS = artifact.address;
      } catch (error) {
        console.error("Address in ABI:", error.message);
      }
      console.log(CONTRACT_ADDRESS, CONTRACT_ABI)

      //handling the wallet change event
  window.ethereum?.on('accountsChanged', async (accounts) => {
    if (accounts.length === 0) {
      console.log("Wallet disabled");
      global.currentAccount = null;
      return;
    }

    global.currentAccount = accounts[0];
    global.provider = new ethers.BrowserProvider(window.ethereum);
    global.signer = await provider.getSigner();
    global.signer = await provider.getSigner();
    global.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    console.log("Acount changed to:", currentAccount);
  });

  //Обробка зміни мережі
  window.ethereum?.on('chainChanged', () => {
    console.warn("Network changed reloading");
    window.location.reload();
  });

  window.connectWallet = connectWallet;
  window.createOrganization = createOrganization;
}
  
  global.provider;
  global.signer;
  global.contract;
  global.currentAccount;

  export async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
      alert("Install MetaMask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      global.currentAccount = accounts[0];

      global.provider = new ethers.BrowserProvider(window.ethereum);
      global.signer = await provider.getSigner();
      global.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      console.log("Conected to MetaMask:", currentAccount);
    } catch (error) {
      console.error("Error in conection:", error);
    }
  }

  


  /*methodName - string
  example 
  contractMethod("getValue")
  .then(value => {
    //code with returned value
  })
  
  
  */
// async function contractMethod(methodName) {
//   if (!contract) {
//     contract = await connectWallet();
//     if (!contract) return null;
//   }

//   try {
//     const result = await contract[methodName]();
//     return result;
//   } catch (error) {
//     console.error(`Error with method ${methodName}:`, error);
//     return null;
//   }
// }

export async function createOrganization() {
    //input if you need value
//   const text = document.getElementById("createOrg").value;
  if (!global.contract) {
    global.contract = await connectWallet();
  }
  let tx, reason;
  try {
    //change to name of function in solidity, give all required parameters for solidity function
    tx = await global.contract.createOrganization("Test Organization");
  } catch (error) {
    reason = error.reason;
  }
  if(tx !== undefined){
    //code if successfull used solidity function

  } else if(reason) {
    //code if action in solidity not allowed
    console.log(reason);

  } else {
    console.log("network error")
  }
  console.log(tx);
//   await getLiquidityEvents();
}








export async function createCourse(courseName) {
  if (!global.contract) {
    global.contract = await connectWallet();
  }
  let tx, reason;
  // await global.contract.createCourse(courseName);
  try {
    //change to name of function in solidity, give all required parameters for solidity function
    tx = await global.contract.createCourse(courseName, "");
    
  } catch (error) {
    reason = error.reason;
  }
  if(tx !== undefined){
    //code if successfull used solidity function

  } else if(reason) {
    //code if action in solidity not allowed
    console.log(reason);

  } else {
    console.log("network error")
  }
  console.log(tx);
}





export async function getLiquidityEvents() {
    //address for selection by address
    const _address = await signer.getAddress();
    //name of event in solidity and indexed value(s)
    const eventFilter = contract.filters.OrganizationRegistered(_address);
    const fromBlock = 0;
    const toBlock = 'latest';
    const events = await contract.queryFilter(eventFilter, fromBlock, toBlock);
    console.log(events)
    
    for (const evt of events) {
        //change to variabels names in solidity
        const { orgAddress, name } = evt.args;

         console.log(orgAddress);
         console.log(name);
    }
}

// getLiquidityEvents();
  //Export functions for HTML
  