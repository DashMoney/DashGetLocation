import React from 'react';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';

class PostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
      whichDSODGR: "DSO",
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

  // handleDisconnect = () => {
  //   this.props.handleLogout();
  //   this.props.closeTopNav();
  //   this.handleCloseClick();
  // }

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

getRelativeTimeAgo(messageTime, timeNow){


  let timeDifference = timeNow - messageTime;
  
    if(timeDifference >= 84600000){
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

  if(timeDifference < 15000){
    return "Just now"
  }else if(timeDifference <44000){
    return "Few moments ago"
  }else if(timeDifference <90000){
    return "1 min ago"
  }else if(timeDifference <150000){
    return "2 min ago"
  }else if(timeDifference <210000){
    return "3 min ago"
  }else if(timeDifference <270000){
    return "4 min ago"
  }else if(timeDifference <330000){
    return "5 min ago"
  }else if(timeDifference <390000){
    return "6 min ago"
  }else if(timeDifference <450000){
    return "7 min ago"
  }else if(timeDifference <510000){
    return "8 min ago"  
  }else if(timeDifference <570000){
    return "9 min ago"  
  }else if(timeDifference <660000){
    return "10 min ago"
  }else if(timeDifference <840000){
    return "12 min ago"
  }else if(timeDifference <1020000){
    return "15 min ago"
  }else if(timeDifference <1140000){
    return "18 min ago"
  }else if(timeDifference <1380000){
    return "20 min ago"
  }else if(timeDifference <1650000){
    return "25 min ago"
  }else if(timeDifference <1950000){
    return "30 min ago"
  }else if(timeDifference <2250000){
    return "35 min ago"
  }else if(timeDifference <2550000){
    return "40 min ago"
  }else if(timeDifference <3000000){
    return "45 min ago"
  }else if(timeDifference <5400000){
    return "1 hr ago"
  }else if(timeDifference <9000000){
    return "2 hrs ago"
  }else if(timeDifference <12600000){
    return "3 hrs ago"
  }else if(timeDifference <18000000){
    return "5 hrs ago"
  }else if(timeDifference <43200000){
    return "Many hrs ago"
  }else if(timeDifference <84600000){
    return "About a day ago"
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
      
        <Modal show={this.props.isModalShowing} backdropClassName={modalBackdrop} contentClassName={modalBkg}>
        {/* <Modal.Header> */}

          {/* NO HEADER JUST PUT EVERYTHING IN THE BODY??? -> PROBABLY NEED TO TEST AND LOOK AT ->  */}
          
            
         
           {/* <Modal.Title>
          <h3>
               <b>Selected Post</b>
               </h3>
               </Modal.Title>  */}
               
              
          
        {/* </Modal.Header> */}
        <Modal.Body>

        <div className='postModalCloseButton'><Modal.Title>{closeButtonColor}</Modal.Title></div>

        <div className="locationTitle">

<h5><Badge bg="primary" 
style={{ marginRight: ".2rem" }}>
  {this.props.selectedSearchedPost.city}
  </Badge></h5>

<h5><Badge bg="primary" 
style={{ marginRight: ".2rem" }}>
  {this.props.selectedSearchedPost.region}
  </Badge></h5>

<h5><Badge bg="primary">
  {this.props.selectedSearchedPost.country}</Badge></h5>

</div>
<p></p>
        <div className="cardTitle">
        <h4 style={{ color: "#008de4" }} onClick={() => this.handleNameClick(this.props.selectedSearchedPostName)}>
        {this.props.selectedSearchedPostName}
        </h4>
          

{/* <span onClick={() => this.handleNameClick()}>
    {this.props.tuple[0]}
  </span> */}
  <span>
    {this.state.copiedName?<span>✅</span>:<></>}
    </span>

           

            <span className="textsmaller">
              {this.getRelativeTimeAgo(this.props.selectedSearchedPost.$createdAt, date)}
            </span>
          </div>


<p>{this.props.selectedSearchedPost.description}</p>
          

{this.props.selectedSearchedPost.link !== undefined && this.props.selectedSearchedPost.link !== '' ?
<>
 <a rel="noopener noreferrer" target="_blank" href={this.props.selectedSearchedPost.link}>
            <b>{this.props.selectedSearchedPost.link}</b></a>
              </>

:
<></>
}
<p></p>
{this.props.selectedSearchedPost.category === 'offbiz' ?
<>
<h5>DashGetPaid (Coming Soon)</h5>
<p>I think this will not be a button and will just straight up load the DGPSTore and items!!</p>
</>
:
<></>
}
<div className="BottomBorder" ></div>
<p></p>

{this.state.whichDSODGR === 'DSO' ? 

                  <ButtonGroup className="me-2" aria-label="First group">

                  <Button variant="primary" style={{textDecoration:'underline'}}><b>DashShoutOut</b></Button>

                  <Button variant="primary" onClick={this.triggerDGRButton}><b>DashGetReviews</b></Button> 
                   
                </ButtonGroup>

                  :

                  <ButtonGroup  className="me-2" aria-label="First group">

<Button variant="primary" onClick={this.triggerDSOButton}><b>DashShoutOut</b></Button> 
        
<Button variant="primary" style={{textDecoration:'underline'}}><b>DashGetReviews</b></Button>
                  
                   
      </ButtonGroup>
                  }


<p></p>
{this.state.whichDSODGR === 'DSO'?
<>
{this.props.isLoggedIn ?
<>
{/* <p>Put the DSO dm but no tag just handle behind the scene. I think maybe have a different component probably form from DSO DM modal YEAH </p> */}
<p className='bodytext'>You will be able to send a <b>DashShoutOut DM</b> to the post owner, once completed!</p>
</>
  :
<>
<p className='bodytext'>When logged in, you will be able to send a <b>DashShoutOut DM</b> to the post owner.</p>
</>
}
</>
:
<>
<p className='bodytext'><b>DashGetReviews</b> is the next dapp! (Coming Soon!)</p>
</>
}





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
