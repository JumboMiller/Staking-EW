import 'bootstrap/dist/css/bootstrap.css';
import "./css/App.css";
import { useState } from 'react';
import * as waxjs from "@waxio/waxjs/dist";
import Modal from './Modal';
import AnchorLink from 'anchor-link';
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport';
import GoogleLogin from 'react-google-login';
import GoogleLogout from 'react-google-login';

function App() {



  const server = "https://elementalwarsapi.xyz/"
  //const server = "http://localhost:4000/"
  const [modalActive , setModalActive] = useState(false);
  var [modaltext, setmodaltext]=useState("test text");
  var [userAcc , setUserAcc] = useState("");
  var [userAccGoogle , setUserAccGoogle] = useState("");
  var [userNFTs, setUserNFTs]= useState([]);

  var [chained,setChain] = useState("");

  
  var NFTsArray = [];
  
  const wax = new waxjs.WaxJS('https://wax.greymass.com', null, null, false);

  const transport = new AnchorLinkBrowserTransport()

  const link = new AnchorLink({
      transport,
      chains: [
          {
              chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
              nodeUrl: 'https://wax.greymass.com',
          }
      ],
  })
  const axios = require('axios'); 

  const identifier = 'mydapp';
  
  let session;
  /*async function autologin() { 
    var isAutoLoginAvailable = await wax.isAutoLoginAvailable(); 
    if (isAutoLoginAvailable) { 
      waxlogin(); 
    } 
  } */

  async function waxlogin(){
    try {
      const account = await wax.login() 
      chained = "wax"
      setChain(chained)
      console.log(wax.userAccount)
      afterLoginWallet(wax.userAccount)
    } 
    catch (e) { 
      console.log(e)
    }

  } 
 
  function anchorlogin() {
    try {
      link.login(identifier).then((result) => {
        session = result.session
        chained = "anchor"
        setChain(chained)
        afterLoginWallet(`${session.auth.actor}`)
    })
    } catch (error) {
      console.log(error)
    }
    
  }

  function onSuccessGoogle(response){
    userAccGoogle = response.profileObj.email;
    setUserAccGoogle(response.profileObj.email)
    afterLoginGoogle()
  }

  function onFailureGoogle(response){
    console.log(response)
  }

  function afterGoogleLogOut(response){
    console.log(response)
    setModalActive(true)
    setmodaltext("You left the Google session , Please wait for the page to reload!")
    window.location.reload()
    window.location.reload()
  }

  function afterLoginGoogle(){
    var div = document.getElementById('google-connection-div')
    div.classList.add('invisible')
    div = document.getElementById('wallet-connection-div')
    div.classList.add('visible')
    div = document.getElementById('google-logout')
    div.classList.add('visible')
  }


  function afterLoginWallet(useraccount){
    var div = document.getElementById('wallet-connection-div')
    div.classList.add('invisible')
    div = document.getElementById('user-info-div')
    div.classList.add('visible')
    drowNFT(useraccount)
  }

 
  

  async function drowNFT(useraccount){
    setUserAcc(useraccount)
    var dinamo =  await axios.get('https://wax.api.atomicassets.io/atomicassets/v1/assets?collection_name=elementalwar&owner='+useraccount+'&page=1&limit=100&order=desc&sort=asset_id')
    var atomicAssets = dinamo.data.data
    for (let i = 0; i < atomicAssets.length; i++) 
    {
      const element = {
        asset_id:atomicAssets[i].asset_id,
        name: atomicAssets[i].data.name,
        rarity : atomicAssets[i].data.rarity,
        template_id:atomicAssets[i].template.template_id,
        ability : atomicAssets[i].data.ability,
        staked:"Staking"
      };
      NFTsArray.push(element);
    }
    dinamo =  await axios.get(`${server}staking/${userAccGoogle}`)
    var databaseAssets = dinamo.data
    if (databaseAssets !=="null") {
      for(let i=0 ;i < databaseAssets.length ;i++)
      {
        const element = {
          asset_id:databaseAssets[i].IdAsset,
          name: databaseAssets[i].Name,
          rarity : databaseAssets[i].Rarity,
          template_id:databaseAssets[i].IdTemplate,
          ability : databaseAssets[i].Ability,
          staked:"Already Staked"
        };
        NFTsArray.push(element);
      }
     // console.log(databaseAssets)
    }
    
    
    console.log(atomicAssets)
    var NFTsList = NFTsArray.map( (nfts) => (
      <div key={nfts.asset_id} className="staf-container col-lg-4 col-md-6 col-xs-12">
          <div className="row">
              <div className={nfts.name.includes("???") ? "dfdf staf-img col-lg-12 col-xs-12" : nfts.name + " staf-img col-lg-12 col-xs-12"}>
              </div>
              <div className="staf-info col-lg-12 col-xs-12">
                <h2 className="staf-name">{nfts.name}</h2>
                <h3 className={nfts.rarity}>{nfts.rarity}</h3>
                <h4 >#{nfts.asset_id}</h4>
                <p className="staf-about">{nfts.ability}</p> 
                <div onClick={()=>{ Transfer(nfts.asset_id,nfts.staked)}} className={nfts.staked+" stake"}>{nfts.staked}</div>
              </div>
          </div>
      </div>
      ));
      setUserNFTs(NFTsList)
  }


  async function Transfer(asset_id,staked){
    console.log(chained)
    if (staked === "Already Staked") {
      return 
    }
    try{
      var result;
      if (chained === "wax") {
        result = await wax.api.transact({
          actions: [{
            account: 'atomicassets',
            name: 'transfer',
            authorization: [{
              actor: wax.userAccount,
              permission: 'active',
            }],
            data: {
              from: wax.userAccount,
              to: '3e4wo.wam',
              asset_ids: [asset_id],
              memo: 'Elemental Wars Staking',
            },
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 1200,
        });
      }
      else if(chained === "anchor"){ 
        result = await session.transact({
          actions: [{
            account: 'atomicassets',
            name: 'transfer',
            authorization: [{
              actor: `${session.auth.actor}`,
              permission: 'active',
            }],
            data: {
              from: `${session.auth.actor}`,
              to: '3e4wo.wam',
              asset_ids: [asset_id],
              memo: 'Elemental Wars Staking',
            },
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 1200,
        });
      }
      Stake(asset_id) 
    }catch (error) {
      console.log(error)
      setModalActive(true)
      setmodaltext("Error something went wrong , please refresh the page !")
    }
  }
  async function Stake(asset_id){
    try {
      const NFTdata = NFTsArray.find( el => el.asset_id === asset_id)
      var dinamo = await axios.post(`${server}staking`,
      {
        IdAsset:NFTdata.asset_id,
        Rarity:NFTdata.rarity,
        Name:NFTdata.name,
        IdTemplate:NFTdata.template_id,
        Ability:NFTdata.ability,
        Mail:userAccGoogle
      })
      console.log(dinamo)
      setModalActive(true)
      setmodaltext("Please wait for the page to reload!")
      window.location.reload()
    } catch (error) {
      console.log(error)
      setModalActive(true)
      setmodaltext("Error something went wrong , please refresh the page !")
    }
      
  }

  return (
    <div className="back-div">     
      <div className="front-div">
        <div id="google-connection-div"  className="google-connection ">
          <GoogleLogin
            clientId="81457948776-2fgauif31doivo8iop7og4uv82iog3cl.apps.googleusercontent.com"
            onSuccess={onSuccessGoogle}
            
            />
        </div>
        <div id='google-logout' className='google-logout'>
          <GoogleLogout
            clientId="81457948776-2fgauif31doivo8iop7og4uv82iog3cl.apps.googleusercontent.com"
            buttonText="Logout"
            onSuccess={afterGoogleLogOut}
            onFailure={onFailureGoogle}
          >
          </GoogleLogout>
        </div>
        <div id="wallet-connection-div" className="wallet-connection">
          <div className="connect-btn" onClick={waxlogin}>WAX LOGIN</div>
          <div className="connect-btn" onClick={anchorlogin}>ANCHOR LOGIN</div>
        </div>
        <div id="user-info-div" className="user-info">
          <div className="user-wallet"><h2>Wallet : {userAcc}</h2></div>
          <div className="user-google"><h2>Google : {userAccGoogle}</h2></div>
        </div>
      </div>
      <div className='nfts-container'>
        <div className="row">
            {userNFTs}
        </div>
      </div>
      <Modal active={modalActive} setActive={setModalActive} text={modaltext}/>
    </div>
  );
}
/**/
export default App;
