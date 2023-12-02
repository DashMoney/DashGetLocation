import React from "react";
import LocalForage from "localforage";

import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import DashBkgd from "./Images/dash_digital-cash_logo_2018_rgb_for_screens.png";

import Spinner from "react-bootstrap/Spinner";
//import Form from "react-bootstrap/Form";
//import Alert from "react-bootstrap/Alert";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import TopNav from "./Components/TopNav/TopNav";

import TabsOnPage from "./Components/Pages/TabsOnPage";
import CreditsOnPage from "./Components/Pages/CreditsOnPage";
import LowCreditsOnPage from "./Components/Pages/LowCreditsOnPage";

import LocationForm from "./Components/Pages/LocationForm";
import ButtonsOnPage from "./Components/Pages/ButtonsOnPage";

import Posts from "./Components/Pages/Posts";
import YourPostsPage from "./Components/YourPosts/YourPostsPage";

import Footer from "./Components/Footer";

import ConnectWalletModal from "./Components/TopNav/ConnectWalletModal";
import LogoutModal from "./Components/TopNav/LogoutModal";

import TopUpIdentityModal from "./Components/TopUpIdentityModal";
import CreatePostModal from "./Components/YourPosts/CreatePostModal";
import EditPostModal from "./Components/YourPosts/EditPostModal";

import PostModal from "./Components/PostModal";

import "./App.css";

const Dash = require("dash");

const {
  Essentials: { Buffer },
  PlatformProtocol: { Identifier },
} = Dash;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,

      whichTab: "Search",
      selectedCategoryButton: "offrent",

      //viewYourMsgsToPosts: false, //false to show form and true for msgs

      isLoading: true, //For identity and name And not identityInfo that is handle on component

      isLoadingDSODM: false,

      isLoadingInitial: true,

      isLoadingSearch: false, // CHANGE BACK THIS IS FOR UI FAKE DATA TESTING ->

      isLoadingForm: false,

      isLoadingWallet: true, //For wallet for topup

      isLoadingYourPosts: true,

      mode: "dark",

      //##### LOCATION FORM STATE ######
      whichCountryRegion: "Country",

      cityInput: "",
      validCity: true,
      tooLongCityNameError: false,

      countryRegionInput: "",
      validCountryRegion: true,
      tooLongCountryRegionNameError: false,
      //^^^^^ LOCATION FORM STATE ^^^^^

      //#####  POSTS TO DISPLAY ######
      OffRentPosts: [],
      OffRentNames: [],

      OffBizPosts: [],
      OffBizNames: [],

      OffOtherPosts: [],
      OffOtherNames: [],

      LookRentPosts: [],
      LookRentNames: [],

      LookOtherPosts: [],
      LookOtherNames: [],
      //^^^^^ POSTS TO DISPLAY ^^^^^

      //##### INITIAL POSTS ######

      Initial1: false,
      Initial2: false,
      Initial3: false,
      Initial4: false,
      Initial5: false,

      InitialOffRentPosts: [],
      InitialOffRentNames: [],

      InitialOffBizPosts: [],
      InitialOffBizNames: [],

      InitialOffOtherPosts: [],
      InitialOffOtherNames: [],

      InitialLookRentPosts: [],
      InitialLookRentNames: [],

      InitialLookOtherPosts: [],
      InitialLookOtherNames: [],
      //^^^^^ INITIAL POSTS ^^^^^

      //##### Search POSTS ######

      Search1: false,
      Search2: false,
      Search3: false,
      Search4: false,
      Search5: false,

      SearchOffRentPosts: [],
      SearchOffRentNames: [],

      SearchOffBizPosts: [],
      SearchOffBizNames: [],

      SearchOffOtherPosts: [],
      SearchOffOtherNames: [],

      SearchLookRentPosts: [],
      SearchLookRentNames: [],

      SearchLookOtherPosts: [],
      SearchLookOtherNames: [],
      //^^^^^ Search POSTS ^^^^^

      selectedSearchedPost: "",
      selectedSearchedPostNameDoc: "",

      yourPostsToDisplay: [],

      presentModal: "",
      isModalShowing: false,
      whichNetwork: "testnet",

      mnemonic: "",
      identity: "",
      identityInfo: "",
      identityRaw: "",
      uniqueName: "",

      accountBalance: "",

      walletId: "",
      mostRecentLogin: false,
      platformLogin: false, //Will this be used? -> check ->
      LocalForageKeys: [],

      skipSynchronizationBeforeHeight: 905000,
      mostRecentBlockHeight: 905000,

      DataContractDMIO: "FZon7eefPyiJ2aS7WthpsGsMAcES3GHHWugFTH8p6D3S",
      DataContractDGP: "785cZo4ok3DgyCJKsg4NPwuFmdDdcbp1hZKBW5b4SZ97",
      DataContractDGR: "5C8ZwmirWwqsMk7EguTf2p2RHa1cD9z3hrR29quE92ug",
      DataContractDSO: "3djpLuabDgYeXY7RhT6by5VuvrLtn8wnNQTF3J4wz4fn",
      DataContractDPNS: "GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec",

      expandedTopNav: false,
    };
  }

  closeTopNav = () => {
    this.setState({
      expandedTopNav: false,
    });
  };

  toggleTopNav = () => {
    if (this.state.expandedTopNav) {
      this.setState({
        expandedTopNav: false,
      });
    } else {
      this.setState({
        expandedTopNav: true,
      });
    }
  };

  handleTab = (eventKey) => {
    if (eventKey === "Search")
      this.setState({
        whichTab: "Search",
      });
    else {
      this.setState({
        whichTab: "Your Posts",
      });
    }
  };
  // FORM FUNCTIONS
  triggerCountryButton = () => {
    this.setState({
      whichCountryRegion: "Country",
    });
  };

  triggerRegionButton = () => {
    this.setState({
      whichCountryRegion: "Region",
    });
  };

  handleOnChangeValidation = (event) => {
    this.setState({
      nameAvail: false,
      identityIdReceipient: "", //Test if this clears the error msg after failed send ->
      dgmDocumentsForReceipient: [],
      isError: false,
    });

    if (event.target.id === "formCityName") {
      this.cityNameValidate(event.target.value);
    }

    if (event.target.id === "formCountryRegionName") {
      this.countryRegionNameValidate(event.target.value);
    }
  };

  cityNameValidate = (cityName) => {
    let regex = /^.{0,32}$/;
    let valid = regex.test(cityName);

    if (valid) {
      this.setState({
        cityInput: cityName,
        tooLongCityNameError: false,
        validCity: true,
      });
    } else {
      if (cityName.length > 32) {
        this.setState({
          cityInput: cityName,
          tooLongCityNameError: true,
          validCity: false,
        });
      } else {
        this.setState({
          cityInput: cityName,
          validCity: false,
        });
      }
    }
  };

  countryRegionNameValidate = (countryRegionName) => {
    let regex = /^.{0,32}$/;
    let valid = regex.test(countryRegionName);

    if (valid) {
      this.setState({
        countryRegionInput: countryRegionName,
        tooLongCountryRegionNameError: false,
        validCountryRegion: true,
      });
    } else {
      if (countryRegionName.length > 32) {
        this.setState({
          countryRegionInput: countryRegionName,
          tooLongCountryRegionNameError: true,
          validCountryRegion: false,
        });
      } else {
        this.setState({
          countryRegionInput: countryRegionName,
          validCountryRegion: false,
        });
      }
    }
  };

  // ^^^^ FORM FUNCTIONS

  // 5 BUTTONS below form
  handleSelectedCategoryButton = (clickedButton) => {
    this.setState({
      selectedCategoryButton: clickedButton,
    });
  };

  // ^^^^ 5 BUTTONS below form

  handleYourPost = (index) => {
    this.setState(
      {
        selectedYourPost: this.state.yourPostsToDisplay[index],
        //I also need the name <- NOT FOR MY POSTS -> GET IT TOGETHER - nOICE
        selectedYourPostIndex: index, //<- Need this for the editingfunction!!
      },
      () => this.showModal("EditPostModal")
    );
  };

  handleSearchedPost = (post, nameDoc) => {
    this.setState(
      {
        selectedSearchedPost: post,
        selectedSearchedPostNameDoc: nameDoc,
      },
      () => this.showModal("PostModal")
    );
  };

  hideModal = () => {
    this.setState({
      isModalShowing: false,
    });
  };

  showModal = (modalName) => {
    this.setState({
      presentModal: modalName,
      isModalShowing: true,
    });
  };

  handleMode = () => {
    if (this.state.mode === "primary")
      this.setState({
        mode: "dark",
      });
    else {
      this.setState({
        mode: "primary",
      });
    }
  };

  // &&&    &&&   &&&   &&&   &&&   &&&   &&&&

  handleLogout = () => {
    this.setState(
      {
        isLoggedIn: false,

        whichTab: "Search",
        selectedCategoryButton: "offrent",

        //viewYourMsgsToPosts: false, //false to show form and true for msgs

        isLoading: true, //For identity and name And not identityInfo that is handle on component

        isLoadingDSODM: false,

        isLoadingInitial: true,

        isLoadingSearch: false, // CHANGE BACK THIS IS FOR UI FAKE DATA TESTING ->

        isLoadingForm: false,

        isLoadingWallet: true, //For wallet for topup

        isLoadingYourPosts: true, // CHANGE BACK THIS IS FOR UI FAKE DATA TESTING ->

        mode: "dark",

        denom: "Dash", //this can be removed because it is handled on at componenet based on amoutn <- do it ->

        //##### LOCATION FORM STATE ######
        whichCountryRegion: "Country",

        cityInput: "",
        validCity: true,
        tooLongCityNameError: false,

        countryRegionInput: "",
        validCountryRegion: true,
        tooLongCountryRegionNameError: false,
        //^^^^^ LOCATION FORM STATE ^^^^^

        //#####  POSTS TO DISPLAY ######
        OffRentPosts: [],
        OffRentNames: [],

        OffBizPosts: [],
        OffBizNames: [],

        OffOtherPosts: [],
        OffOtherNames: [],

        LookRentPosts: [],
        LookRentNames: [],

        LookOtherPosts: [],
        LookOtherNames: [],
        //^^^^^ POSTS TO DISPLAY ^^^^^

        //##### INITIAL POSTS ######

        Initial1: false,
        Initial2: false,
        Initial3: false,
        Initial4: false,
        Initial5: false,

        InitialOffRentPosts: [],
        InitialOffRentNames: [],

        InitialOffBizPosts: [],
        InitialOffBizNames: [],

        InitialOffOtherPosts: [],
        InitialOffOtherNames: [],

        InitialLookRentPosts: [],
        InitialLookRentNames: [],

        InitialLookOtherPosts: [],
        InitialLookOtherNames: [],
        //^^^^^ INITIAL POSTS ^^^^^

        //##### Search POSTS ######

        Search1: false,
        Search2: false,
        Search3: false,
        Search4: false,
        Search5: false,

        SearchOffRentPosts: [],
        SearchOffRentNames: [],

        SearchOffBizPosts: [],
        SearchOffBizNames: [],

        SearchOffOtherPosts: [],
        SearchOffOtherNames: [],

        SearchLookRentPosts: [],
        SearchLookRentNames: [],

        SearchLookOtherPosts: [],
        SearchLookOtherNames: [],
        //^^^^^ Search POSTS ^^^^^

        yourPostsToDisplay: [],

        presentModal: "",
        isModalShowing: false,
        whichNetwork: "testnet",

        mnemonic: "",
        identity: "",
        identityInfo: "",
        identityRaw: "",
        uniqueName: "",

        accountBalance: "",

        walletId: "",
        mostRecentLogin: false,
        platformLogin: false, //Will this be used? -> check ->
        LocalForageKeys: [],

        skipSynchronizationBeforeHeight: 910000,
        mostRecentBlockHeight: 910000,

        expandedTopNav: false,
      },
      () => this.componentDidMount()
    );
  };

  componentDidMount() {
    this.getInitialPosts(); // <- Call initial Post first to speed up the initial login

    //All componentDidMount will do is call the initial queries -> okay then how will the login work ? So it really just needs platform and not wallet.

    //THOUGHT <- wHAT IF i DO ONE PULL FOR THE INITIAL AND THEN SORT SO INSTEAD OF UP TO 10 ITS JUST 2 AND THEN i CAN DO A MOST RECENT BECAUSE PEOPLE WILL BE LOGGING IN FAIRLY QUICKLY..
    //mAKE IT FAT. <- OKAY AND ITS HOW IT IS SET UP ANYWAY DOUBLE WIN

    LocalForage.config({
      name: "dashmoney-platform-login",
    });

    LocalForage.getItem("mostRecentWalletId")
      .then((val) => {
        if (val !== null) {
          //this.handleInitialQuerySeq(val.identity);
          this.setState({
            walletId: val.walletId,
            identity: val.identity,
            uniqueName: val.name,
          });
        } else {
          console.log("There is no mostRecentWalletId");
        }
      })
      .catch(function (err) {
        console.log(err);
      });

    //***Next Bit Gets MostRecentBlockHeight */ //tHIS IS FOR THE PLATFORM LOGIN BC THE OFFLINE WALLET GRAB JUST GETS THE WALLETID.. OKAY THEN WHAT DO i NEED THE MOST RECENT FOR THEN? TO GET THE IDENTITYiNFO??
    //iS THIS MORE LIKE dso AND NOT dgp, they are actually pretty similar
    const clientOpts = {
      network: this.state.whichNetwork,
    };
    const client = new Dash.Client(clientOpts);

    const getMostRecentBlockHeight = async () => {
      const status = await client.getDAPIClient().core.getStatus();

      return status;
    };

    getMostRecentBlockHeight()
      .then((d) => {
        let blockHeight = d.chain.blocksCount;
        console.log("Most Recent Block Height:\n", blockHeight);
        this.setState({
          mostRecentBlockHeight: blockHeight - 6,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());

    //Next Part Gets keys for platform login check
    LocalForage.keys()
      .then((keys) => {
        this.setState({
          LocalForageKeys: keys,
        });
        // console.log("Local Forage keys:\n", keys);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  handleInitialQuerySeq = (theIdentity) => {
    //this is with the mostrecent login so its a guess

    //this.getInitialPostsMsgsThreads(theIdentity);
    //so this should query the users posts and users msgs to other posts
    // what are all the queries? <-
    /**
     * 1) Get posts by user
     * 2) Gets msgs from others and myself from user
     * 3) because then I need to get threads for each of these also.
     * 4) Then I need to get msgs I sent
     * 5) Retrieve the posts from others and the threads to the msgs.
     * Also get the names for all of these
     */

    //is this too ugly? Well it is possible but why not just let DSO do this because it already does all of this...
    //Also it makes this like half as difficult for me.. and i didn't promise this yet.

    //So only pull most Recent posts

    this.getYourPosts(theIdentity);
  };

  handleWalletConnection = (theMnemonic) => {
    if (this.state.LocalForageKeys.length === 0) {
      this.setState(
        {
          isLoggedIn: true,
          isLoading: true,
          mnemonic: theMnemonic,
        },
        () => this.getIdentitywithMnem(theMnemonic)
      );
    } else {
      this.setState(
        {
          isLoggedIn: true,
          isLoading: true,
          mnemonic: theMnemonic,
        },
        () => this.checkPlatformOnlyLogin(theMnemonic)
      );
    }
  };

  checkPlatformOnlyLogin = (theMnemonic) => {
    console.log("Called Check Platform Login");

    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: theMnemonic,
        offlineMode: true,
      },
    };

    const client = new Dash.Client(clientOpts);

    let walletIdToTry;

    const getWalletId = async () => {
      const account = await client.getWalletAccount();

      walletIdToTry = account.walletId;
      //console.log("walletIdToTry:", walletIdToTry);

      return walletIdToTry === this.state.walletId;
    };

    getWalletId()
      .then((mostRecentMatch) => {
        console.log(`Most Recent Matches -> ${mostRecentMatch}`);

        if (!mostRecentMatch) {
          let isKeyAvail = this.state.LocalForageKeys.includes(walletIdToTry);
          // console.log(`LocalForage Test -> ${isKeyAvail}`);

          if (isKeyAvail) {
            console.log("This here is a login skip!!");

            LocalForage.getItem(walletIdToTry)
              .then((val) => {
                //  console.log("Value Retrieved", val);

                if (
                  val !== null ||
                  typeof val.identity !== "string" ||
                  val.identity === "" ||
                  val.name === "" ||
                  typeof val.name !== "string"
                ) {
                  this.setState(
                    {
                      platformLogin: true,
                      identity: val.identity,
                      uniqueName: val.name,
                      walletId: walletIdToTry,
                      yourPostsToDisplay: [],
                      isLoading: false,
                      isLoadingYourPosts: true,
                      //maintain Loading bc continuing to other functions
                    },
                    () => this.handleStartQuerySeq(val.identity, theMnemonic)
                  );

                  let lfObject = {
                    walletId: walletIdToTry,
                    identity: val.identity,
                    name: val.name,
                  };
                  LocalForage.setItem("mostRecentWalletId", lfObject)
                    .then((d) => {
                      //return LocalForage.getItem(walletId);
                      // console.log("Return from LF setitem:", d);
                    })
                    .catch((err) => {
                      console.error(
                        "Something went wrong setting to localForage:\n",
                        err
                      );
                    });
                } else {
                  //  console.log("platform login failed");
                  //this.getIdentitywithMnem(theMnemonic);
                  //() => this.getNamefromIdentity(val)); // send to get it
                }
              })
              .catch((err) => {
                console.error(
                  "Something went wrong getting from localForage:\n",
                  err
                );
              });
          } else {
            this.setState(
              {
                //This is for if no platform login at all. resets
                identityInfo: "",
                identityRaw: "",
                uniqueName: "",
                yourPostsToDisplay: [],
                isLoading: true,
                isLoadingYourPosts: true,
              },
              () => this.getIdentitywithMnem(theMnemonic)
            );
          }
        } //Closes mostRecentMatch
        else {
          this.setState(
            {
              mostRecentLogin: true,
              platformLogin: true,
              isLoading: false,
            },
            () => this.handleMostRecentLogin(theMnemonic)
          );
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  /* ************************************************************** */

  handleMostRecentLogin = (theMnemonic) => {
    //check if loading is done and push to display state
    this.getYourPosts(this.state.identity);
    this.getIdentityInfo(this.state.identity);
    this.getWalletwithMnem(theMnemonic);
  };

  handleStartQuerySeq = (theIdentity, theMnemonic) => {
    this.getYourPosts(theIdentity);

    this.getIdentityInfo(theIdentity);

    this.getWalletwithMnem(theMnemonic);
  };

  getIdentitywithMnem = (theMnemonic) => {
    const client = new Dash.Client({
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: theMnemonic,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: this.state.mostRecentBlockHeight,
        },
      },
    });

    let walletIdToTry;

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();

      //console.log(account);
      // this.setState({
      //   accountAddress: account.getUnusedAddress().address, //This can be used if you havent created the DGMDocument <-
      // });

      walletIdToTry = account.walletId;
      // console.log(walletIdToTry);

      return account.identities.getIdentityIds();
    };

    retrieveIdentityIds()
      .then((d) => {
        // console.log("Mnemonic identities:\n", d);
        //This if - handles if there is an identity or not
        if (d.length === 0) {
          this.setState({
            isLoading: false,
            identity: "No Identity",
          });
        } else {
          this.setState(
            {
              walletId: walletIdToTry,
              identity: d[0],
              isLoading: false,
              //maintain Loading bc continuing to other functions
            },
            () => this.callEverythingBcHaveIdentityNow(d[0], theMnemonic)
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong getting IdentityIds:\n", e);
        this.setState({
          isLoading: false,
          identity: "No Identity",
        });
      })
      .finally(() => client.disconnect());
  };

  callEverythingBcHaveIdentityNow = (theIdentity, theMnemonic) => {
    if (!this.state.platformLogin) {
      this.getYourPosts(theIdentity);
      this.getNamefromIdentity(theIdentity);
      this.getIdentityInfo(theIdentity);
    }

    this.getWalletwithMnem(theMnemonic);
  };

  getWalletwithMnem = (theMnemonic) => {
    const client = new Dash.Client({
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: theMnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.state.skipSynchronizationBeforeHeight,
        },
      },
    });

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();
      //console.log(account);
      //console.log(account.getTotalBalance());
      // console.log(account.getUnusedAddress().address);
      //console.log('TX History: ', account.getTransactionHistory());

      this.setState({
        //accountWallet: client, //Can I use this for the send TX?-> NO
        accountBalance: account.getTotalBalance(),
        accountAddress: account.getUnusedAddress().address, //This can be used if you havent created the DGMDocument <-
        accountHistory: account.getTransactionHistory(),
      });

      return true;
    };

    retrieveIdentityIds()
      .then((d) => {
        console.log("Wallet Loaded:\n", d);
        this.setState({
          isLoadingWallet: false,
        });
        //This if - handles if there is an identity or not
        // if (d.length === 0) {
        //   this.setState({
        //     isLoading: false,
        //     identity: "No Identity",
        //   });
        // } else {
        //   this.setState(
        //     {
        //       identity: d[0],
        //       isLoading: false,
        //       //maintain Loading bc continuing to other functions
        //     }
        //   );
        // }
      })
      .catch((e) => {
        console.error("Something went wrong getting Wallet:\n", e);
        this.setState({
          isLoadingWallet: false,
          isLoading: false,
          identity: "Identity Error",
        });
      })
      .finally(() => client.disconnect());
  };

  getNamefromIdentity = (theIdentity) => {
    const client = new Dash.Client({
      network: this.state.whichNetwork,
    });

    const retrieveNameByRecord = async () => {
      // Retrieve by a name's identity ID
      return client.platform.names.resolveByRecord(
        "dashUniqueIdentityId",
        theIdentity // Your identity ID
      );
    };

    retrieveNameByRecord()
      .then((d) => {
        let nameRetrieved = d[0].toJSON();

        //console.log("Name retrieved:\n", nameRetrieved);

        //******************** */
        let lfObject = {
          identity: theIdentity,
          name: nameRetrieved.label,
        };

        LocalForage.setItem(this.state.walletId, lfObject)
          .then((d) => {
            //return LocalForage.getItem(walletId);
            //   console.log("Return from LF setitem:", d);
          })
          .catch((err) => {
            console.error(
              "Something went wrong setting to localForage:\n",
              err
            );
          });
        //******************** */
        lfObject = {
          walletId: this.state.walletId,
          identity: theIdentity,
          name: nameRetrieved.label,
        };

        LocalForage.setItem("mostRecentWalletId", lfObject)
          .then((d) => {
            //return LocalForage.getItem(walletId);
            //  console.log("Return from LF setitem:", d);
          })
          .catch((err) => {
            console.error(
              "Something went wrong setting to localForage:\n",
              err
            );
          });
        //******************** */
        this.setState({
          uniqueName: nameRetrieved.label,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        // console.log("There is no dashUniqueIdentityId to retrieve");
        this.setState({
          isLoading: false,
          uniqueName: "Name Error",
        });
      })
      .finally(() => client.disconnect());
  };

  getIdentityInfo = (theIdentity) => {
    console.log("Called get Identity Info");

    const client = new Dash.Client({ network: this.state.whichNetwork });

    const retrieveIdentity = async () => {
      return client.platform.identities.get(theIdentity); // Your identity ID
    };

    retrieveIdentity()
      .then((d) => {
        // console.log("Identity retrieved:\n", d.toJSON());

        this.setState({
          identityInfo: d.toJSON(),
          identityRaw: d,
          //isLoading: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);

        // this.setState({
        //   isLoading: false,
        // });
      })
      .finally(() => client.disconnect());
  };

  getYourPosts = (theIdentity) => {
    //console.log("Calling getInitialOffRent");

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DMIOContract: {
          contractId: this.state.DataContractDMIO,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get("DMIOContract.dmiopost", {
        where: [
          ["$ownerId", "==", theIdentity], // offrent, offbiz, offother, lookrent, lookother
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          console.log("There are no Your Posts");

          this.setState({
            isLoadingYourPosts: false,
          });
        } else {
          let docArray = [];
          //console.log("GettingYour Posts");
          for (const n of d) {
            console.log("Document:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }

          this.setState({
            yourPostsToDisplay: docArray,
            isLoadingYourPosts: false,
          });
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  // ####   ####   ####   ####   ####   ####   #####

  //PUT THE QUERY SEARCHES HERE

  getInitialPosts = () => {
    this.getInitialOffRent();
    this.getInitialOffBiz();
    this.getInitialOffOther();
    this.getInitialLookRent();
    this.getInitialLookOther();
  };

  checkInitialRace = () => {
    if (
      this.state.Initial1 &&
      this.state.Initial2 &&
      this.state.Initial3 &&
      this.state.Initial4 &&
      this.state.Initial5
    ) {
      this.setState({
        OffRentPosts: this.state.InitialOffRentPosts,
        OffRentNames: this.state.InitialOffRentNames,

        OffBizPosts: this.state.InitialOffBizPosts,
        OffBizNames: this.state.InitialOffBizNames,

        OffOtherPosts: this.state.InitialOffOtherPosts,
        OffOtherNames: this.state.InitialOffOtherNames,

        LookRentPosts: this.state.InitialLookRentPosts,
        LookRentNames: this.state.InitialLookRentNames,

        LookOtherPosts: this.state.InitialLookOtherPosts,
        LookOtherNames: this.state.InitialLookOtherNames,

        //I DONT NEED ^^ BECAUSE INITIAL SHOULD PULL AUTOMATICALLY!! well actually I do.. I need to push the initials to the display..

        isLoadingInitial: false,
      });
    }
  };

  getInitialOffRent = () => {
    // console.log("Calling getInitialOffRent");

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DMIOContract: {
          contractId: this.state.DataContractDMIO,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get("DMIOContract.dmiopost", {
        where: [
          ["category", "==", "offrent"], // offrent, offbiz, offother, lookrent, lookother
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //  console.log("There are no InitialOffRent");

          this.setState(
            {
              Initial1: true,
            },
            () => this.checkInitialRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting ForyouByyouMsgs");
          for (const n of d) {
            //console.log("Document:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.getInitialOffRentNames(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getInitialOffRentNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    //console.log("Calling getNamesforDSOmsgs");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            InitialOffRentNames: nameDocArray,
            InitialOffRentPosts: docArray,
            Initial1: true,
          },
          () => this.checkInitialRace()
        );
      })
      .catch((e) => {
        console.error(
          "Something went wrong getting Initial OffRent Names:\n",
          e
        );
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getInitialOffBiz = () => {
    //console.log("Calling getInitialOffBiz");

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DMIOContract: {
          contractId: this.state.DataContractDMIO,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get("DMIOContract.dmiopost", {
        where: [
          ["category", "==", "offbiz"], // offrent, offbiz, offother, lookrent, lookother
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no ForyouByyouMsgs");

          this.setState(
            {
              Initial2: true,
            },
            () => this.checkInitialRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting ForyouByyouMsgs");
          for (const n of d) {
            console.log("Document:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.getInitialOffBizNames(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getInitialOffBizNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    //console.log("Calling getNamesforDSOmsgs");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            InitialOffBizNames: nameDocArray,
            InitialOffBizPosts: docArray,
            Initial2: true,
          },
          () => this.checkInitialRace()
        );
      })
      .catch((e) => {
        console.error(
          "Something went wrong getting Initial OffBiz Names:\n",
          e
        );
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getInitialOffOther = () => {
    //console.log("Calling getInitialOffOther");

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DMIOContract: {
          contractId: this.state.DataContractDMIO,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get("DMIOContract.dmiopost", {
        where: [
          ["category", "==", "offother"], // offrent, offbiz, offother, lookrent, lookother
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no InitialOffOther");

          this.setState(
            {
              Initial3: true,
            },
            () => this.checkInitialRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting InitialOffOther");
          for (const n of d) {
            //console.log("Document:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.getInitialOffOtherNames(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getInitialOffOtherNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    //console.log("Calling getNamesOffOthers");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            InitialOffOtherNames: nameDocArray,
            InitialOffOtherPosts: docArray,
            Initial3: true,
          },
          () => this.checkInitialRace()
        );
      })
      .catch((e) => {
        console.error(
          "Something went wrong getting Initial OffOther Names:\n",
          e
        );
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getInitialLookRent = () => {
    //console.log("Calling getInitialLookRent");

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DMIOContract: {
          contractId: this.state.DataContractDMIO,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get("DMIOContract.dmiopost", {
        where: [
          ["category", "==", "lookrent"], // offrent, offbiz, offother, lookrent, lookother
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no Initial LookRent Posts");

          this.setState(
            {
              Initial4: true,
            },
            () => this.checkInitialRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting Initial LookRent Posts");
          for (const n of d) {
            //console.log("Document:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.getInitialLookRentNames(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getInitialLookRentNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    //console.log("Calling InitialLookRentNames");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            InitialLookRentNames: nameDocArray,
            InitialLookRentPosts: docArray,
            Initial4: true,
          },
          () => this.checkInitialRace()
        );
      })
      .catch((e) => {
        console.error(
          "Something went wrong getting Initial LookRent Names:\n",
          e
        );
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getInitialLookOther = () => {
    //console.log("Calling getInitialLookOther");

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DMIOContract: {
          contractId: this.state.DataContractDMIO,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get("DMIOContract.dmiopost", {
        where: [
          ["category", "==", "lookother"], // offrent, offbiz, offother, lookrent, lookother
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no Initial LookOther Posts");

          this.setState(
            {
              Initial5: true,
            },
            () => this.checkInitialRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting Initial LookOther Posts");
          for (const n of d) {
            //console.log("Document:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.getInitialLookOtherNames(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getInitialLookOtherNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    //console.log("Calling getNamesforDSOmsgs");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
        orderBy: [["records.dashUniqueIdentityId", "desc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            InitialLookOtherNames: nameDocArray,
            InitialLookOtherPosts: docArray,
            Initial5: true,
          },
          () => this.checkInitialRace()
        );
      })
      .catch((e) => {
        console.error(
          "Something went wrong getting Initial LookOther Names:\n",
          e
        );
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  //This one will be interesting bc I am goin to construct the query and then pass it to each of the functions this will save about 3 or 4 different

  constructQueryThenSearch = () => {
    this.setState({
      isLoadingSearch: true,
      isLoadingForm: true,
    });

    //So what are the parts and I assume I will pull from state for the parameters
    /* NEED TO DO 5 QUERIES FOR EACH SEARCH (need to normalize/lowercase)
  SO ITS AN OBJECT!!! 
  { 
    where: [
      ['city', '==', ****City***],
      ['country', '==', ****Country***], OR  ['region', '==', ****Region***],
      ['category', '==', 'offrent'],
      ["$createdAt", "<=",  Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
  }*/

    /**
   * //##### LOCATION FORM STATE ######
      whichCountryRegion: "Country",

      cityInput: "",
      validCity: false,
      tooLongCityNameError: false,

      countryRegionInput: "",
      validCountryRegion: false,
      tooLongCountryRegionNameError: false,
      //^^^^^ LOCATION FORM STATE ^^^^^
   */

    //1) CREATE THE where ARRAY ->
    //2) tHEN TACK ON THE CONSTANT STUFF ->
    //3) CUSTOMIZE THE CATEGORY IN EACH FUNCTION ->

    //How to search if all blank-> it is handled automatically ??

    //Do i want to add the category here and then change in each or just add the rest in each?? -> just change in each that is pretty easy. <- how then?
    //I got a way, dont fill in 3rd spot, use find with length === 2 and then push the specific query!! <- I like it => done

    let whereArray = [];

    if (this.state.cityInput !== "") {
      whereArray.push(["city", "==", this.state.cityInput.toLocaleLowerCase()]); //push adds to end!
    }

    if (this.state.countryRegionInput !== "") {
      if (this.state.whichCountryRegion === "Country") {
        whereArray.push([
          "country",
          "==",
          this.state.countryRegionInput.toLocaleLowerCase(),
        ]);
      }
      if (this.state.whichCountryRegion === "Region") {
        whereArray.push([
          "region",
          "==",
          this.state.countryRegionInput.toLocaleLowerCase(),
        ]);
      }
    }

    let categoryIndex = whereArray.length;
    console.log(`cateIndex: ${categoryIndex}`);

    whereArray.push(["category", "=="]);

    whereArray.push(["$createdAt", "<=", Date.now()]);

    let queryObject = {
      where: whereArray,
      orderBy: [["$createdAt", "desc"]],
    };

    console.log(queryObject);

    this.getOffRent(queryObject, categoryIndex);
    this.getOffBiz(queryObject, categoryIndex);
    this.getOffOther(queryObject, categoryIndex);
    this.getLookRent(queryObject, categoryIndex);
    this.getLookOther(queryObject, categoryIndex);
  };

  checkSearchRace = () => {
    if (
      this.state.Search1 &&
      this.state.Search2 &&
      this.state.Search3 &&
      this.state.Search4 &&
      this.state.Search5
    ) {
      this.setState({
        Search1: false,
        Search2: false,
        Search3: false,
        Search4: false,
        Search5: false,

        // OffRentPosts: this.state.SearchOffRentPosts,
        // OffRentNames: this.state.SearchOffRentNames,

        // OffBizPosts: this.state.SearchOffBizPosts,
        // OffBizNames: this.state.SearchOffBizNames,

        // OffOtherPosts: this.state.SearchOffOtherPosts,
        // OffOtherNames: this.state.SearchOffOtherNames,

        // LookRentPosts: this.state.SearchLookRentPosts,
        // LookRentNames: this.state.SearchLookRentNames,

        // LookOtherPosts: this.state.SearchLookOtherPosts,
        // LookOtherNames: this.state.SearchLookOtherNames,

        isLoadingSearch: false,
        isLoadingForm: false,
      });
    }
  };

  getOffRent = (queryObj, cateIndex) => {
    //let categoryIndex = queryObj.where.findIndex(arr => arr.length === 2) // Just pass it down and save the 5x findIndex function

    let queryOffRent = JSON.parse(JSON.stringify(queryObj));

    queryOffRent.where[cateIndex].push("offrent");

    //This passed in parameter won't affect the other functions right?? => NO shallow and deep object copying..... :(

    //console.log("Calling getOffRent");

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DMIOContract: {
          contractId: this.state.DataContractDMIO,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get(
        "DMIOContract.dmiopost",
        queryOffRent
      );
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no getOffRent Posts");

          this.setState(
            {
              OffRentPosts: [],
              Search1: true,
            },
            () => this.checkSearchRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting getOffRent Posts");
          for (const n of d) {
            //console.log("Document:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.getOffRentNames(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getOffRentNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    //console.log("Calling getNamesforDSOmsgs");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            OffRentNames: nameDocArray,
            OffRentPosts: docArray,
            Search1: true,
          },
          () => this.checkSearchRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting OffRent Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getOffBiz = (queryObj, cateIndex) => {
    //console.log("Calling getOffBiz");
    let queryOffBiz = JSON.parse(JSON.stringify(queryObj));
    queryOffBiz.where[cateIndex].push("offbiz");

    console.log(queryObj);

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DMIOContract: {
          contractId: this.state.DataContractDMIO,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get(
        "DMIOContract.dmiopost",
        queryOffBiz
        // {
        //   where: [
        //     ["category", "==", "offbiz"], // offrent, offbiz, offother, lookrent, lookother
        //     ["$createdAt", "<=", Date.now()],
        //   ],
        //   orderBy: [["$createdAt", "desc"]],
        // }
      );
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no getOffBiz");

          this.setState(
            {
              OffBizPosts: [],
              Search2: true,
            },
            () => this.checkSearchRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting getOffBiz");
          for (const n of d) {
            //console.log("Document:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.getOffBizNames(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getOffBizNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    //console.log("Calling getOffBizNames");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            OffBizNames: nameDocArray,
            OffBizPosts: docArray,
            Search2: true,
          },
          () => this.checkSearchRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting OffBiz Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getOffOther = (queryObj, cateIndex) => {
    //console.log("Calling getOffOther");
    let queryOffOther = JSON.parse(JSON.stringify(queryObj));

    queryOffOther.where[cateIndex].push("offother");

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DMIOContract: {
          contractId: this.state.DataContractDMIO,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get(
        "DMIOContract.dmiopost",
        queryOffOther
      );
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no OffOther");

          this.setState(
            {
              Search3: true,
              OffOtherPosts: [],
            },
            () => this.checkSearchRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting OffOther");
          for (const n of d) {
            //console.log("Document:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.getOffOtherNames(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong getOffOther:\n", e))
      .finally(() => client.disconnect());
  };

  getOffOtherNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    //console.log("Calling getNamesOffOthers");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            OffOtherNames: nameDocArray,
            OffOtherPosts: docArray,
            Search3: true,
          },
          () => this.checkSearchRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting OffOther Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getLookRent = (queryObj, cateIndex) => {
    //console.log("Calling getLookRent");
    let queryLookRent = JSON.parse(JSON.stringify(queryObj));

    queryLookRent.where[cateIndex].push("lookrent");

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DMIOContract: {
          contractId: this.state.DataContractDMIO,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get(
        "DMIOContract.dmiopost",
        queryLookRent
      );
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no LookRent Posts");

          this.setState(
            {
              Search4: true,
              LookRentPosts: [],
            },
            () => this.checkSearchRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting LookRent Posts");
          for (const n of d) {
            //console.log("Document:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.getLookRentNames(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getLookRentNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    //console.log("Calling LookRentNames");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            LookRentNames: nameDocArray,
            LookRentPosts: docArray,
            Search4: true,
          },
          () => this.checkSearchRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting LookRent Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getLookOther = (queryObj, cateIndex) => {
    //console.log("Calling getLookOther");
    let queryLookOther = JSON.parse(JSON.stringify(queryObj));

    queryLookOther.where[cateIndex].push("lookother");

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DMIOContract: {
          contractId: this.state.DataContractDMIO,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get(
        "DMIOContract.dmiopost",
        queryLookOther
      );
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no LookOther Posts");

          this.setState(
            {
              Search5: true,
              LookOtherPosts: [],
            },
            () => this.checkSearchRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting LookOther Posts");
          for (const n of d) {
            //console.log("Document:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.getLookOtherNames(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getLookOtherNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    //console.log("Calling getNamesforDSOmsgs");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            LookOtherNames: nameDocArray,
            LookOtherPosts: docArray,
            Search5: true,
          },
          () => this.checkSearchRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting LookOther Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  //$$  $$   $$$  $$  $  $$  $$$  $$$  $$  $$

  createYourPost = (postObject) => {
    console.log("Called Create Post");

    this.setState({
      isLoadingYourPosts: true,
    });

    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.state.skipSynchronizationBeforeHeight,
        },
      },
      apps: {
        DMIOContract: {
          contractId: this.state.DataContractDMIO,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const submitPostDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      const postProperties = {
        city: postObject.city, //.toLocaleLowerCase() <- done in modal
        region: postObject.region,
        country: postObject.country,

        description: postObject.description,
        category: postObject.category,
        link: postObject.link,

        active: postObject.active,
        dgp: postObject.dgp,
      };
      //console.log('Post to Create: ', postProperties);

      // Create the note document
      const dmioDocument = await platform.documents.create(
        "DMIOContract.dmiopost",
        identity,
        postProperties
      );

      //############################################################
      //This below disconnects the document sending..***

      // return dmioDocument;

      //This is to disconnect the Document Creation***
      //############################################################

      const documentBatch = {
        create: [dmioDocument], // Document(s) to create
      };

      await platform.documents.broadcast(documentBatch, identity);
      return dmioDocument;
    };

    submitPostDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Document:\n", returnedDoc);

        let post = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,
          $createdAt: returnedDoc.$createdAt,

          city: postObject.city,
          region: postObject.region,
          country: postObject.country,

          description: postObject.description,
          category: postObject.category,
          link: postObject.link,

          active: postObject.active,
          dgp: postObject.dgp,
        };

        this.setState({
          yourPostsToDisplay: [post, ...this.state.yourPostsToDisplay],
          isLoadingYourPosts: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong with post creation:\n", e);
        this.setState({
          yourPostError: true,
          isLoadingYourPosts: false,
        });
      })
      .finally(() => client.disconnect());
  };

  editYourPost = (postObject) => {
    console.log("Called Edit Post");

    this.setState({
      isLoadingYourPosts: true,
    });

    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.state.skipSynchronizationBeforeHeight,
        },
      },
      apps: {
        DMIOContract: {
          contractId: this.state.DataContractDMIO,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const submitPostDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      }

      const [document] = await client.platform.documents.get(
        "DMIOContract.dmiopost",
        {
          where: [
            [
              "$id",
              "==",
              this.state.yourPostsToDisplay[this.state.selectedYourPostIndex]
                .$id,
            ],
          ],
        }
      );
      /**
 * city: postObject.city, 
      region: postObject.region,
      country: postObject.country,

      description: postObject.description,
      category: postObject.category,
      link: postObject.link,
      
      active: postObject.active,
      dgp: postObject.dgp,
 */

      if (
        this.state.yourPostsToDisplay[this.state.selectedYourPostIndex].city !==
        postObject.city
      ) {
        document.set("city", postObject.city);
      }

      if (
        this.state.yourPostsToDisplay[this.state.selectedYourPostIndex]
          .region !== postObject.region
      ) {
        document.set("region", postObject.region);
      }

      if (
        this.state.yourPostsToDisplay[this.state.selectedYourPostIndex]
          .country !== postObject.country
      ) {
        document.set("country", postObject.country);
      }

      if (
        this.state.yourPostsToDisplay[this.state.selectedYourPostIndex]
          .category !== postObject.category
      ) {
        document.set("category", postObject.category);
      }

      if (
        this.state.yourPostsToDisplay[this.state.selectedYourPostIndex]
          .description !== postObject.description
      ) {
        document.set("description", postObject.description);
      }

      if (
        this.state.yourPostsToDisplay[this.state.selectedYourPostIndex].link !==
        postObject.link
      ) {
        document.set("link", postObject.link);
      }

      if (
        this.state.yourPostsToDisplay[this.state.selectedYourPostIndex]
          .active !== postObject.active
      ) {
        document.set("active", postObject.active);
      }

      if (
        this.state.yourPostsToDisplay[this.state.selectedYourPostIndex].dgp !==
        postObject.dgp
      ) {
        document.set("dgp", postObject.dgp);
      }

      //TEST ->
      await platform.documents.broadcast({ replace: [document] }, identity);
      return document;

      //############################################################
      //This below disconnects the document editing..***

      //return document;

      //This is to disconnect the Document editing***
      //############################################################
    };

    submitPostDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Edited Post Doc:\n", returnedDoc);

        let post = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,
          $createdAt: returnedDoc.$createdAt,

          city: postObject.city,
          region: postObject.region,
          country: postObject.country,

          description: postObject.description,
          category: postObject.category,
          link: postObject.link,

          active: postObject.active,
          dgp: postObject.dgp,
        };

        let editedPosts = this.state.yourPostsToDisplay;

        editedPosts.splice(this.state.selectedYourPostIndex, 1, post);

        this.setState(
          {
            yourPostsToDisplay: editedPosts,
            isLoadingYourPosts: false,
          }
          //,() => console.log(this.state.yourPostsToDisplay)
        );
      })
      .catch((e) => {
        console.error("Something went wrong with Post creation:\n", e);
        this.setState({
          postError: true,
          isLoadingYourPosts: false,
        });
      })
      .finally(() => client.disconnect());
  };

  doTopUpIdentity = (numOfCredits) => {
    this.setState({
      isLoadingWallet: true,
    });
    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.state.skipSynchronizationBeforeHeight,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const topupIdentity = async () => {
      const identityId = this.state.identity; // Your identity ID
      const topUpAmount = numOfCredits; // Number of duffs ie 1000

      await client.platform.identities.topUp(identityId, topUpAmount);
      return client.platform.identities.get(identityId);
    };

    topupIdentity()
      .then((d) => {
        console.log("Identity credit balance: ", d.balance);
        this.setState({
          identityInfo: d.toJSON(),
          identityRaw: d,
          isLoadingWallet: false,
          accountBalance: this.state.accountBalance - 1000000,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingWallet: false,
          topUpError: true, //Add to State and handle ->
        });
      })
      .finally(() => client.disconnect());
  };

  submitDSODM = (addedMessage, ownerIdArray) => {
    //  -> sh: out, dir, tip ? AND DMIO?? So they know its msg from different dapp?

    this.setState({
      isLoadingDSODM: true,
    });

    //console.log(addedMessage);
    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic,
        //adapter: LocalForage,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: this.state.mostRecentBlockHeight,
          //this.state.skipSynchronizationBeforeHeight,
        },
      },
      apps: {
        DSOContract: {
          contractId: this.state.DataContractDSO, // Your contract ID
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    //let dsoMessageAndTags;
    let dsoTags;

    const submitDocuments = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
      } // Your identity ID

      let docProperties = {};

      /*dsomsg ->
       msg, sh, msgId(for reply)  (only first 2 are required)
*/

      //THIS WILL ONLY BE THE DM MESSAGE SO SHOW TO SIMPLIFY =>

      if (addedMessage.sh === "out") {
        docProperties = {
          msg: addedMessage.msg,
          sh: "out",
        };
      } //RIGHT HERE IS WHERE i PUT THE 'dir'
      //and then if 'thr' adds the state to the msgId ->
      else {
        docProperties = {
          msg: addedMessage.msg,
        };
      }

      // Create the note document
      const dsoDocument = await platform.documents.create(
        "DSOContract.dsomsg", /// I changed .note TO .dsomessage***
        identity,
        docProperties
      );

      console.log(dsoDocument.toJSON());

      console.log("OwnerIdArray of Tags: ", ownerIdArray);

      //THERE WILL ONLY BE ONE TAG ALWAYS SO THIS IS UNNECESSARY

      if (ownerIdArray.length !== 0) {
        let dsotags = await Promise.all(
          ownerIdArray.map(async (ownerId) => {
            //https://stackoverflow.com/questions/40140149/use-async-await-with-array-map

            //dsotag ->  toId, msgId (all required)

            let tagDoc = await platform.documents.create(
              "DSOContract.dsotag",
              identity,
              {
                toId: ownerId,
                msgId: dsoDocument.toJSON().$id,
              }
            );
            return tagDoc;
          })
        );

        dsoTags = dsotags;
      } //else {
      // dsoMessageAndTags = [dsoDocument];
      // }

      //THIS ^^^ IS WHAT IS PASSED TO THE DOCUMENT CREATION

      //############################################################
      //This below disconnects the document sending..***

      //return dsoMessageAndTags;

      //This is to disconnect the Document Creation***

      //############################################################

      // const documentBatch = {
      //   create: dsoMessageAndTags, // [dsoDocument], // Document(s) to create
      // };

      const msgBatch = {
        create: [dsoDocument], // Document(s) to create
      };

      const tagBatch = {
        create: dsoTags, // Document(s) to create
      };

      await platform.documents.broadcast(msgBatch, identity);

      if (ownerIdArray.length !== 0) {
        await platform.documents.broadcast(tagBatch, identity);
      }

      return [dsoDocument];
    };

    submitDocuments()
      .then((d) => {
        //Returns array!!! ->
        // let returnedDoc = d.toJSON();
        // console.log("MSG Documents JSON:\n", returnedDoc);

        let docArray = [];
        for (const n of d) {
          console.log("Submitted Doc:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        let message = {};

        if (docArray.length === 1) {
          message = {
            $ownerId: docArray[0].$ownerId,
            $id: docArray[0].$id, //$id: returnedDoc.transitions[0].$id,
            sh: addedMessage.sh,
            msg: addedMessage.msg,
            $createdAt: docArray[0].$createdAt,
          };
        } else {
          docArray.forEach((doc) => {
            //OR I could do a find and it would be a bit faster ->
            if (doc.$type === "dsomsg") {
              message = {
                $ownerId: doc.$ownerId,
                $id: doc.$id,
                sh: addedMessage.sh,
                msg: addedMessage.msg,
                $createdAt: doc.$createdAt,
              };
            }
          });
        }

        if (addedMessage.sh === "out") {
          this.setState(
            {
              EveryoneMsgs: [message, ...this.state.EveryoneMsgs],
              ByYouMsgs: [message, ...this.state.ByYouMsgs],
              isLoadingDSODM: false,
            },
            () => this.updateIdentityInfo()
          );
        } else {
          this.setState(
            {
              ByYouMsgs: [message, ...this.state.ByYouMsgs],
              isLoadingDSODM: false,
            },
            () => this.updateIdentityInfo()
          );
        }

        //console.log(submittedDoc);
      })
      .catch((e) => {
        this.setState({
          isLoadingDSODM: false,
        });

        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());

    //THIS BELOW IS THE NAME DOC ADD, SO PROCESSES DURING DOC SUBMISSION ***
    let nameDoc = {
      $ownerId: this.state.identity,
      label: this.state.uniqueName,
    };

    this.setState({
      EveryoneNames: [nameDoc, ...this.state.EveryoneNames],

      ByYouNames: [nameDoc, ...this.state.ByYouNames],

      FromTagsNames: [nameDoc, ...this.state.FromTagsNames],
    });
    //END OF NAME DOC ADD***
  };

  // ####  ####  ####  ####  ####  ####  ####  ####  ####  ####  ####  ####

  render() {
    this.state.mode === "primary"
      ? (document.body.style.backgroundColor = "rgb(280,280,280)")
      : (document.body.style.backgroundColor = "rgb(20,20,20)");

    this.state.mode === "primary"
      ? (document.body.style.color = "black")
      : (document.body.style.color = "white");

    return (
      <>
        <TopNav
          handleMode={this.handleMode}
          mode={this.state.mode}
          showModal={this.showModal}
          whichNetwork={this.state.whichNetwork}
          isLoggedIn={this.state.isLoggedIn}
          toggleTopNav={this.toggleTopNav}
          expandedTopNav={this.state.expandedTopNav}
        />
        <Image fluid="true" id="dash-bkgd" src={DashBkgd} alt="Dash Logo" />

        <Container className="g-0">
          <Row className="justify-content-md-center">
            <Col md={9} lg={8} xl={7} xxl={6}>
              {this.state.isLoggedIn ? (
                <>
                  <TabsOnPage
                    whichTab={this.state.whichTab}
                    handleTab={this.handleTab}
                  />
                  <div className="bodytextnotop">
                    {/* <CreditsOnPage identityInfo={this.state.identityInfo} /> */}

                    {this.state.whichTab === "Search" ? (
                      <>
                        <LowCreditsOnPage
                          identityInfo={this.state.identityInfo}
                          uniqueName={this.state.uniqueName}
                          showModal={this.showModal}
                        />
                        {/* {this.state.viewYourMsgsToPosts ? <></> : <></>} */}

                        {/* <div className="d-grid gap-2">
                    <Button variant="primary" size="lg">
                      Messaged Posts
                    </Button>
                  </div> */}

                        {/* <div
                    className="BottomBorder"
                    style={{ paddingTop: ".5rem" }}
                  ></div> */}

                        <LocationForm
                          whichCountryRegion={this.state.whichCountryRegion}
                          mode={this.state.mode}
                          cityInput={this.state.cityInput}
                          validCity={this.state.validCity}
                          tooLongCityNameError={this.state.tooLongCityNameError}
                          countryRegionInput={this.state.countryRegionInput}
                          validCountryRegion={this.state.validCountryRegion}
                          tooLongCountryRegionNameError={
                            this.state.tooLongCountryRegionNameError
                          }
                          isLoadingForm={this.state.isLoadingForm}
                          triggerCountryButton={this.triggerCountryButton}
                          triggerRegionButton={this.triggerRegionButton}
                          handleOnChangeValidation={
                            this.handleOnChangeValidation
                          }
                          constructQueryThenSearch={
                            this.constructQueryThenSearch
                          }
                        />

                        <ButtonsOnPage
                          selectedCategoryButton={
                            this.state.selectedCategoryButton
                          }
                          handleSelectedCategoryButton={
                            this.handleSelectedCategoryButton
                          }
                          isLoadingSearch={this.state.isLoadingSearch}
                          isLoadingInitial={this.state.isLoadingInitial}
                          OffRentPosts={this.state.OffRentPosts}
                          OffBizPosts={this.state.OffBizPosts}
                          OffOtherPosts={this.state.OffOtherPosts}
                          LookRentPosts={this.state.LookRentPosts}
                          LookOtherPosts={this.state.LookOtherPosts}
                        />

                        <div
                          className="BottomBorder"
                          style={{ paddingTop: ".5rem" }}
                        ></div>

                        {this.state.isLoadingInitial ||
                        this.state.isLoadingSearch ? (
                          <>
                            <p></p>
                            <div id="spinner">
                              <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
                            </div>
                            <p></p>
                          </>
                        ) : (
                          <></>
                        )}

                        <Posts
                          selectedCategoryButton={
                            this.state.selectedCategoryButton
                          }
                          mode={this.state.mode}
                          handleSearchedPost={this.handleSearchedPost}
                          OffRentPosts={this.state.OffRentPosts}
                          OffRentNames={this.state.OffRentNames}
                          OffBizPosts={this.state.OffBizPosts}
                          OffBizNames={this.state.OffBizNames}
                          OffOtherPosts={this.state.OffOtherPosts}
                          OffOtherNames={this.state.OffOtherNames}
                          LookRentPosts={this.state.LookRentPosts}
                          LookRentNames={this.state.LookRentNames}
                          LookOtherPosts={this.state.LookOtherPosts}
                          LookOtherNames={this.state.LookOtherNames}
                        />
                      </>
                    ) : (
                      <>
                        {/* THIS IS WHERE THE "YOUR POSTS" WILL GO */}
                        <CreditsOnPage
                          identityInfo={this.state.identityInfo}
                          uniqueName={this.state.uniqueName}
                          showModal={this.showModal}
                        />

                        <YourPostsPage
                          yourPostsToDisplay={this.state.yourPostsToDisplay}
                          handleYourPost={this.handleYourPost}
                          mode={this.state.mode}
                          showModal={this.showModal}
                          isLoadingYourPosts={this.state.isLoadingYourPosts}
                        />
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="bodytextnotop">
                  <div className="bodytext" style={{ textAlign: "center" }}>
                    <h3>
                      Find places to spend Dash or add a place to earn Money!
                    </h3>
                  </div>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => this.showModal("ConnectWalletModal")}
                    >
                      <b>Connect Wallet</b>
                    </Button>
                  </div>

                  <div
                    className="BottomBorder"
                    style={{ paddingTop: ".5rem" }}
                  ></div>

                  <LocationForm
                    whichCountryRegion={this.state.whichCountryRegion}
                    mode={this.state.mode}
                    cityInput={this.state.cityInput}
                    validCity={this.state.validCity}
                    tooLongCityNameError={this.state.tooLongCityNameError}
                    countryRegionInput={this.state.countryRegionInput}
                    validCountryRegion={this.state.validCountryRegion}
                    tooLongCountryRegionNameError={
                      this.state.tooLongCountryRegionNameError
                    }
                    isLoadingForm={this.state.isLoadingForm}
                    triggerCountryButton={this.triggerCountryButton}
                    triggerRegionButton={this.triggerRegionButton}
                    handleOnChangeValidation={this.handleOnChangeValidation}
                    constructQueryThenSearch={this.constructQueryThenSearch}
                  />

                  <ButtonsOnPage
                    selectedCategoryButton={this.state.selectedCategoryButton}
                    handleSelectedCategoryButton={
                      this.handleSelectedCategoryButton
                    }
                    isLoadingSearch={this.state.isLoadingSearch}
                    isLoadingInitial={this.state.isLoadingInitial}
                    OffRentPosts={this.state.OffRentPosts}
                    OffBizPosts={this.state.OffBizPosts}
                    OffOtherPosts={this.state.OffOtherPosts}
                    LookRentPosts={this.state.LookRentPosts}
                    LookOtherPosts={this.state.LookOtherPosts}
                  />

                  <div
                    className="BottomBorder"
                    style={{ paddingTop: ".5rem" }}
                  ></div>

                  {this.state.isLoadingInitial || this.state.isLoadingSearch ? (
                    <>
                      <p></p>
                      <div id="spinner">
                        <Spinner animation="border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </div>
                      <p></p>
                    </>
                  ) : (
                    <></>
                  )}
                  <Posts
                    selectedCategoryButton={this.state.selectedCategoryButton}
                    mode={this.state.mode}
                    handleSearchedPost={this.handleSearchedPost}
                    OffRentPosts={this.state.OffRentPosts}
                    OffRentNames={this.state.OffRentNames}
                    OffBizPosts={this.state.OffBizPosts}
                    OffBizNames={this.state.OffBizNames}
                    OffOtherPosts={this.state.OffOtherPosts}
                    OffOtherNames={this.state.OffOtherNames}
                    LookRentPosts={this.state.LookRentPosts}
                    LookRentNames={this.state.LookRentNames}
                    LookOtherPosts={this.state.LookOtherPosts}
                    LookOtherNames={this.state.LookOtherNames}
                  />
                </div>
              )}

              <div className="bodytext">
                <Footer />
              </div>
            </Col>
          </Row>
        </Container>

        {/* #####    BELOW ARE THE MODALS    #####    */}

        {this.state.isModalShowing &&
        this.state.presentModal === "ConnectWalletModal" ? (
          <ConnectWalletModal
            isModalShowing={this.state.isModalShowing}
            handleWalletConnection={this.handleWalletConnection}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "LogoutModal" ? (
          <LogoutModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            handleLogout={this.handleLogout}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "TopUpIdentityModal" ? (
          <TopUpIdentityModal
            accountBalance={this.state.accountBalance}
            isLoadingWallet={this.state.isLoadingWallet}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            doTopUpIdentity={this.doTopUpIdentity}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "CreatePostModal" ? (
          <CreatePostModal
            isModalShowing={this.state.isModalShowing}
            createYourPost={this.createYourPost}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "EditPostModal" ? (
          <EditPostModal
            selectedYourPost={this.state.selectedYourPost}
            editYourPost={this.editYourPost}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "PostModal" ? (
          <PostModal
            //MUST ALSO ADD THINGS NEEDED FOR THE DSO DM =>

            //submitDSODM
            // isLoadingDSODM
            // an array of sent msgs
            // no edit ability -> go to DSO for that... or do later

            selectedSearchedPost={this.state.selectedSearchedPost}
            selectedSearchedPostNameDoc={this.state.selectedSearchedPostNameDoc}
            whichNetwork={this.state.whichNetwork}
            DataContractDGR={this.state.DataContractDGR}
            DataContractDPNS={this.state.DataContractDPNS}
            DataContractDGP={this.state.DataContractDGP}
            isLoggedIn={this.state.isLoggedIn}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default App;
