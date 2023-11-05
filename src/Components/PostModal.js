import React from "react";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";
import Spinner from "react-bootstrap/Spinner";

import Reviews from "./PostModalAddons/DGReview/Reviews"; //DGR Integration
import RatingSummary from "./PostModalAddons/DGReview/RatingSummary";

import DGPView from "./PostModalAddons/DGPaid/DGPView";

const Dash = require("dash");

const {
  Essentials: { Buffer },
  PlatformProtocol: { Identifier },
} = Dash;

//1) Must bring in the functions to do this.

/**
               * 
               * {!this.state.isLoadingSearch ? (
          <>
             <Reviews 
            mode={this.state.mode} //Props

            SearchedReviews={this.state.SearchedReviews}  // State
            SearchedReviewNames={this.state.SearchedReviewNames} //State
            SearchedReplies={this.state.SearchedReplies} //State

            SearchedNameDoc={this.state.SearchedNameDoc} //Props

              />
          </>
        ) : (
          <></>
        )}

        {this.state.isLoadingSearch ? (
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
               */

class PostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
      whichDSODGR: "DSO",
      LoadingDGR: true,
      LoadingDSO: true, // => Move DSO to app so can load entire time and pop alert that it sent?
      LoadingDGP: true,

      //DGR State to pass
      SearchedReviews: [],
      SearchedReviewNames: [],
      SearchedReplies: [],

      SearchDGR1: false,
      SearchDGR2: false,

      merchantStore: [],

      SearchDGP1: false,
      SearchDGP2: false,
    };
  }

  triggerDSOButton = () => {
    this.setState({
      whichDSODGR: "DSO",
    });
  };

  triggerDGRButton = () => {
    this.setState({
      whichDSODGR: "DGR",
    });
  };

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleNameClick = (nameLabel) => {
    navigator.clipboard.writeText(nameLabel);
    this.setState({
      copiedName: true,
    });
  };

  //   handleName = (msgDoc) =>{
  //     if(msgDoc.$ownerId === this.props.identity){
  //     return <span style={{ color: "#008de4" }}>{this.props.uniqueName}</span>
  //     }

  //     //*** *** */
  //       let nameDoc = this.props.PostNames.find(doc => {
  //         return msgDoc.$ownerId === doc.$ownerId
  //       })

  //       if(nameDoc === undefined){
  //         return 'Not Found'
  //       }

  //       return <span style={{ color: "#008de4" }} onClick={() => this.handleNameClick(nameDoc.label)}>
  //         {nameDoc.label}
  //         </span>
  // }

  getRelativeTimeAgo(messageTime, timeNow) {
    let timeDifference = timeNow - messageTime;

    if (timeDifference >= 84600000) {
      let longFormDate = new Date();
      longFormDate.setTime(messageTime);
      return longFormDate.toLocaleDateString();
    }

    /*
  Calculate milliseconds in a year
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const year = day * 365;
  */

    if (timeDifference < 15000) {
      return "Just now";
    } else if (timeDifference < 44000) {
      return "Few moments ago";
    } else if (timeDifference < 90000) {
      return "1 min ago";
    } else if (timeDifference < 150000) {
      return "2 min ago";
    } else if (timeDifference < 210000) {
      return "3 min ago";
    } else if (timeDifference < 270000) {
      return "4 min ago";
    } else if (timeDifference < 330000) {
      return "5 min ago";
    } else if (timeDifference < 390000) {
      return "6 min ago";
    } else if (timeDifference < 450000) {
      return "7 min ago";
    } else if (timeDifference < 510000) {
      return "8 min ago";
    } else if (timeDifference < 570000) {
      return "9 min ago";
    } else if (timeDifference < 660000) {
      return "10 min ago";
    } else if (timeDifference < 840000) {
      return "12 min ago";
    } else if (timeDifference < 1020000) {
      return "15 min ago";
    } else if (timeDifference < 1140000) {
      return "18 min ago";
    } else if (timeDifference < 1380000) {
      return "20 min ago";
    } else if (timeDifference < 1650000) {
      return "25 min ago";
    } else if (timeDifference < 1950000) {
      return "30 min ago";
    } else if (timeDifference < 2250000) {
      return "35 min ago";
    } else if (timeDifference < 2550000) {
      return "40 min ago";
    } else if (timeDifference < 3000000) {
      return "45 min ago";
    } else if (timeDifference < 5400000) {
      return "1 hr ago";
    } else if (timeDifference < 9000000) {
      return "2 hrs ago";
    } else if (timeDifference < 12600000) {
      return "3 hrs ago";
    } else if (timeDifference < 18000000) {
      return "5 hrs ago";
    } else if (timeDifference < 43200000) {
      return "Many hrs ago";
    } else if (timeDifference < 84600000) {
      return "About a day ago";
    }
  }

  // getDGPItems = (theIdentity) => {
  //   if (!this.state.LoadingItems) {
  //     this.setState({
  //       LoadingItems: true,
  //     });
  //   }

  //   const clientOpts = {
  //     network: this.props.whichNetwork,
  //     apps: {
  //       DGPContract: {
  //         contractId: this.props.DataContractDGP,
  //       },
  //     },
  //   };
  //   const client = new Dash.Client(clientOpts);

  //   const getDocuments = async () => {
  //     console.log("Called Get DGP Items");

  //     return client.platform.documents.get("DGPContract.dgpitem", {
  //       where: [["$ownerId", "==", theIdentity]],
  //     });
  //   };

  //   getDocuments()
  //     .then((d) => {
  //       let docArray = [];

  //       for (const n of d) {
  //         //console.log("Item:\n", n.toJSON());
  //         docArray = [...docArray, n.toJSON()];
  //       }

  //       if (docArray.length === 0) {
  //         this.setState({
  //           LoadingItems: false,
  //         });
  //       } else {
  //         this.setState({
  //           merchantItems: docArray,
  //           LoadingItems: false,
  //         });
  //       } //Ends the else
  //     })
  //     .catch((e) => {
  //       console.error("Something went wrong:\n", e);
  //       this.setState({
  //         itemError: true,
  //         LoadingItems: false,
  //       });
  //     })
  //     .finally(() => client.disconnect());
  // };

  /* ####  ####  ####  ####  ####  ####  ####  ####  ####  ####  ####  #### */

  //PUT THE QUERY SEARCHES HERE

  // startSearch = (identityToSearch) =>{ //Called from name doc pulled ->
  //   this.getSearchReviews(identityToSearch);
  // }

  // ####      ####       ####      ####       ####      ####       ####

  searchDGRRace = () => {
    if (this.state.SearchDGR1 && this.state.SearchDGR2) {
      this.setState({
        SearchDGR1: false,
        SearchDGR2: false,
        //DONT HAVE TO ADD STATE TO PUSH TO DISPLAY BECAUSE THE REVIEWS AND NAMES PUSHED TOGETHER AND THEN THREADS APPEAR <- SO DO I WANT TO QUERY NAME FIRST THEN?
        LoadingDGR: false,
      });
    }
  };

  getSearchReviews = (theIdentity) => {
    //console.log("Calling getSearchReviews");

    const clientOpts = {
      network: this.props.whichNetwork,
      apps: {
        DGRContract: {
          contractId: this.props.DataContractDGR,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      return client.platform.documents.get("DGRContract.dgrreview", {
        where: [
          ["toId", "==", theIdentity],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no SearchReviews");

          this.setState(
            {
              SearchDGR1: true,
              SearchDGR2: true,
              SearchedReviews: [],
            },
            () => this.searchDGRRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting Search Reviews");

          for (const n of d) {
            let returnedDoc = n.toJSON();

            //console.log("Review:\n", returnedDoc);
            returnedDoc.toId = Identifier.from(
              returnedDoc.toId,
              "base64"
            ).toJSON();
            //console.log("newReview:\n", returnedDoc);

            docArray = [...docArray, returnedDoc];
          }
          this.getSearchReviewNames(docArray);
          this.getSearchReplies(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getSearchReviewNames = (docArray) => {
    const clientOpts = {
      network: this.props.whichNetwork,
      apps: {
        DPNS: {
          contractId: this.props.DataContractDPNS,
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

    // Start of Setting Unique reviews
    let arrayOfReviews = arrayOfOwnerIds.map((id) => {
      return docArray.find((doc) => id === doc.$ownerId);
    });
    // End of Setting Unique reviews

    arrayOfOwnerIds = arrayOfOwnerIds.map((ownerId) =>
      Buffer.from(Identifier.from(ownerId))
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
            SearchedReviewNames: nameDocArray,
            SearchedReviews: arrayOfReviews, //This is a unique set of reviews only single review per reviewer
            SearchDGR1: true,
          },
          () => this.searchDGRRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting Search DGR Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getSearchReplies = (docArray) => {
    const clientOpts = {
      network: this.props.whichNetwork,
      apps: {
        DGRContract: {
          contractId: this.props.DataContractDGR,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    // This Below is to get unique set of ByYou review doc ids
    let arrayOfReviewIds = docArray.map((doc) => {
      return doc.$id;
    });

    //console.log("Array of ByYouThreads ids", arrayOfReviewIds);

    let setOfReviewIds = [...new Set(arrayOfReviewIds)];

    arrayOfReviewIds = [...setOfReviewIds];

    //console.log("Array of order ids", arrayOfReviewIds);

    const getDocuments = async () => {
      //console.log("Called Get Search Replies");

      return client.platform.documents.get("DGRContract.dgrreply", {
        where: [["reviewId", "in", arrayOfReviewIds]], // check reviewId ->
        orderBy: [["reviewId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          let returnedDoc = n.toJSON();
          //console.log("Thr:\n", returnedDoc);
          returnedDoc.reviewId = Identifier.from(
            returnedDoc.reviewId,
            "base64"
          ).toJSON();
          //console.log("newThr:\n", returnedDoc);
          docArray = [...docArray, returnedDoc];
        }

        this.setState(
          {
            SearchDGR2: true,
            SearchedReplies: docArray,
          },
          () => this.searchDGRRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong Search DGR Replies:\n", e);
      })
      .finally(() => client.disconnect());
  };

  // ####      ####       ####      ####       ####      ####       ####

  searchDGPRace = () => {
    if (this.state.SearchDGP1 && this.state.SearchDGP2) {
      this.setState({
        SearchDGP1: false,
        SearchDGP2: false,
        LoadingDGP: false,
      });
    }
  };

  getDGPStore = (theIdentity) => {
    const clientOpts = {
      network: this.props.whichNetwork,
      apps: {
        DGPContract: {
          contractId: this.props.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      //console.log("Called Get DGP Store");

      return client.platform.documents.get("DGPContract.dgpstore", {
        where: [["$ownerId", "==", theIdentity]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        if (d.length === 0) {
          this.setState(
            {
              merchantStore: "No Store",
              SearchDGP1: true,
            },
            () => this.searchDGPRace()
          );
        } else {
          for (const n of d) {
            //console.log("Store:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.setState(
            {
              merchantStore: docArray,
              SearchDGP1: true,
            },
            () => this.searchDGPRace()
          );
        } //Ends the else
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());
  };

  getDGPItems = (theIdentity) => {
    const clientOpts = {
      network: this.props.whichNetwork,
      apps: {
        DGPContract: {
          contractId: this.props.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      //console.log("Called Get DGP Items");

      return client.platform.documents.get("DGPContract.dgpitem", {
        where: [["$ownerId", "==", theIdentity]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          //console.log("Item:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        if (docArray.length === 0) {
          this.setState(
            {
              merchantItems: [],
              SearchDGP2: true,
            },
            () => this.searchDGPRace()
          );
        } else {
          this.setState(
            {
              merchantItems: docArray,
              SearchDGP2: true,
            },
            () => this.searchDGPRace()
          );
        } //Ends the else
      })
      .catch((e) => {
        console.error("Something went wrong DGP Items:\n", e);
      })
      .finally(() => client.disconnect());
  };

  // ####      ####       ####      ####       ####      ####       ####

  componentDidMount() {
    this.getSearchReviews(this.props.selectedSearchedPostNameDoc.$ownerId);

    if (this.props.selectedSearchedPost.dgp) {
      this.getDGPStore(this.props.selectedSearchedPostNameDoc.$ownerId);
      this.getDGPItems(this.props.selectedSearchedPostNameDoc.$ownerId);
    }
  }

  render() {
    let date = Date.now();

    let modalBkg = "";
    let closeButtonColor;
    let modalBackdrop;

    if (this.props.mode === "primary") {
      modalBackdrop = "modal-backdrop-nochange";
      modalBkg = "modal-backcolor-primary";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick} />;
    } else {
      modalBackdrop = "modal-backdrop-dark";
      modalBkg = "modal-backcolor-dark";
      closeButtonColor = (
        <CloseButton onClick={this.handleCloseClick} variant="white" />
      );
    }

    return (
      <Modal
        show={this.props.isModalShowing}
        backdropClassName={modalBackdrop}
        contentClassName={modalBkg}
      >
        {/* <Modal.Header> */}

        {/* NO HEADER JUST PUT EVERYTHING IN THE BODY??? -> PROBABLY NEED TO TEST AND LOOK AT ->  */}

        {/* <Modal.Title>
          <h3>
               <b>Selected Post</b>
               </h3>
               </Modal.Title>  */}

        {/* </Modal.Header> */}
        <Modal.Body>
          <div className="postModalCloseButton">
            <Modal.Title>{closeButtonColor}</Modal.Title>
          </div>

          <div className="locationTitle">
            <h5>
              <Badge bg="primary" style={{ marginRight: ".2rem" }}>
                {this.props.selectedSearchedPost.city}
              </Badge>
            </h5>

            <h5>
              <Badge bg="primary" style={{ marginRight: ".2rem" }}>
                {this.props.selectedSearchedPost.region}
              </Badge>
            </h5>

            <h5>
              <Badge bg="primary">
                {this.props.selectedSearchedPost.country}
              </Badge>
            </h5>
          </div>
          <p></p>
          <div className="cardTitle">
            <h4
              style={{ color: "#008de4" }}
              onClick={() =>
                this.handleNameClick(
                  this.props.selectedSearchedPostNameDoc.label
                )
              }
            >
              {this.props.selectedSearchedPostNameDoc.label}
            </h4>

            {/* <span onClick={() => this.handleNameClick()}>
    {this.props.tuple[0]}
  </span> */}
            <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>

            <span className="textsmaller">
              {this.getRelativeTimeAgo(
                this.props.selectedSearchedPost.$createdAt,
                date
              )}
            </span>
          </div>

          <p>{this.props.selectedSearchedPost.description}</p>

          {this.props.selectedSearchedPost.link !== undefined &&
          this.props.selectedSearchedPost.link !== "" ? (
            <>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={this.props.selectedSearchedPost.link}
              >
                <b>{this.props.selectedSearchedPost.link}</b>
              </a>
            </>
          ) : (
            <></>
          )}
          <p></p>
          {this.props.selectedSearchedPost.category === "offbiz" ? (
            <>
              <h5>
                <b>DashGetPaid Items</b>
              </h5>

              {/* CURRENTLY NOT USING THE STORE DOC AT ALL => ? => 

    SO I THINK i NEED TO HAVE THE STORE BE A BUTTON THAT SAYS VIEW STORE/MENU ITEMS AND DISPLAYS THE STORE INFO/STATUS/DESCRIPTION/PAYLATER etc..


*/}

              {this.state.LoadingDGP ? (
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

              {/* <h5>DashGetPaid (Coming Soon)</h5>
<p>I think this will not be a button and will just straight up load the DGPSTore and items!!</p> */}

              {this.props.selectedSearchedPost.dgp && !this.state.LoadingDGP ? (
                <>
                  <DGPView
                    merchantStore={this.state.merchantStore}
                    merchantItems={this.state.merchantItems}
                  />
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          <p></p>
          <div className="BottomBorder"></div>
          <p></p>

          {this.state.whichDSODGR === "DSO" ? (
            <ButtonGroup className="me-2" aria-label="First group">
              <Button variant="primary" style={{ textDecoration: "underline" }}>
                <b>DashShoutOut</b>
              </Button>

              <Button variant="primary" onClick={this.triggerDGRButton}>
                <b>DashGetReviews</b>
              </Button>
            </ButtonGroup>
          ) : (
            <ButtonGroup className="me-2" aria-label="First group">
              <Button variant="primary" onClick={this.triggerDSOButton}>
                <b>DashShoutOut</b>
              </Button>

              <Button variant="primary" style={{ textDecoration: "underline" }}>
                <b>DashGetReviews</b>
              </Button>
            </ButtonGroup>
          )}

          <p></p>
          {this.state.whichDSODGR === "DSO" ? (
            <>
              {this.props.isLoggedIn ? (
                <>
                  {/* <p>Put the DSO dm but no tag just handle behind the scene. I think maybe have a different component probably form from DSO DM modal YEAH </p> */}

                  <p className="bodytext">
                    You will be able to send a <b>DashShoutOut DM</b> to the
                    post owner, once completed!
                  </p>

                  {/* HOW WILL THE USER KNOW THAT THE MSG HAS BEEN SENT AND WHERE IS LOADING STATE DISPLAYED?
IF I JUST KEEP IN MODAL IT COULD FAIL TO SEND BUT IF I SET IN APP THEN I HAVE TO TRACK AND DISPLAY WHERE MAYBE JUST ANOTHER THING tHAT I PASS TO THE MODAL

ALRIGHT SO IT WILL KEEP TRACK FOR THE SESSION BUT LOSES IT AFTER <= YEAH  

1) Add stuff from the DM modal/form here
    CAN I JUST PUT IT IN ITS OWN COMPONENT? => 
    FORGOT ABOUT THE TAG QUERY AND STUFF
    It doesn't have to query -> i have the namedoc already!!! <=

2) Add the stuff from App.js to App.js and setstate for message sent.

3) TEST ->


*/}
                </>
              ) : (
                <>
                  <p className="bodytext">
                    When logged in, you will be able to send a{" "}
                    <b>DashShoutOut DM</b> to the post owner.
                  </p>
                </>
              )}
            </>
          ) : (
            <>
              {/* <p className='bodytext'><b>DashGetReviews</b> is the next dapp! (Coming Soon!)</p> */}

              {/* THIS IS WHERE THE REVIEWS GO */}

              {this.state.LoadingDGR ? (
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

              <RatingSummary
                SearchedReviews={this.state.SearchedReviews}
                SearchedNameDoc={this.props.selectedSearchedPostNameDoc}
                isLoadingSearch={this.state.LoadingDGR}
              />

              {!this.state.LoadingDGR ? (
                <>
                  <Reviews
                    mode={this.props.mode} //Props
                    SearchedReviews={this.state.SearchedReviews} // State
                    SearchedReviewNames={this.state.SearchedReviewNames} //State
                    SearchedReplies={this.state.SearchedReplies} //State
                    SearchedNameDoc={this.props.selectedSearchedPostNameDoc} //Props
                  />
                </>
              ) : (
                <></>
              )}

              {this.state.SearchedReviews.length === 0 &&
              !this.state.LoadingDGR ? (
                <div className="bodytext">
                  <p>Sorry, there are no reviews available.</p>
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </Modal.Body>

        {/* <Modal.Footer>


          {this.props.isLoadingWallet?
          <Button variant="primary">
          <b>Wallet Loading..</b>
        </Button>:
        <Button variant="primary" onClick={}>
            <b>Top Up Identity</b>
          </Button>}
          
          
        </Modal.Footer> */}
      </Modal>
    );
  }
}

export default PostModal;
