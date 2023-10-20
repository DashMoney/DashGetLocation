import React from 'react';
import Badge from 'react-bootstrap/Badge';
//import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
    };
  }

  handleNameClick = (nameLabel) => {
    navigator.clipboard.writeText(nameLabel);
    this.setState({
      copiedName: true,
    });
  };

  // handleName = (msgDoc) =>{
  //   if(msgDoc.$ownerId === this.props.identity){
  //   return <span style={{ color: "#008de4" }}>{this.props.uniqueName}</span>
  //   }

  //   //*** *** */
  //     let nameDoc = this.props.PostNames.find(doc => {
  //       return msgDoc.$ownerId === doc.$ownerId
  //     })

  //     if(nameDoc === undefined){
  //       return 'Not Found'
  //     }

  //     return <span style={{ color: "#008de4" }} onClick={() => this.handleNameClick(nameDoc.label)}>
  //       {nameDoc.label}
  //       </span>
    
  // }

  getRelativeTimeAgo(messageTime, timeNow){

    //timeStamp: 2546075019551 - Date.now(), 

    //How do I make the adjustments....
    //So the messageTime is the time Stamp
    // So messageTime = 2546075019551 - Time of message
    //So I want Time of message
    //There4 TOM = 2546075019551 - timeStamp -> okay

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
  
  render() { 
    let cardBkg;
    let cardText;

    if (this.props.mode === "primary") {
      cardBkg = "white";
      cardText = "dark";

    } else {
      cardBkg = "dark";
      cardText = "white";
    }
 
     let nameDocToPass = ''; //this is the nameDoc and not the label

     if(this.props.post.$ownerId === this.props.identity){
      let myNameDoc ={
        $ownerId: this.props.identity,
        label: this.props.uniqueName,
      }
        nameDocToPass = myNameDoc;

      }else{

        nameDocToPass = this.props.PostNames.find(doc => {
          return this.props.post.$ownerId === doc.$ownerId
        })
      }

      //Pass the entire NameDoc!! => 
      // if(nameToPass === undefined){
      //   nameToPass = 'Not Found'
      // }else{
      //   nameToPass = nameToPass.label;
      // }

      

    return (
      <>
       <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
        <Card.Body onClick={()=>this.props.handleSearchedPost(this.props.post, nameDocToPass)}>

          <div className="locationTitle" style={{ marginBottom: ".5rem"  }}>

          <Badge bg="primary" 
          style={{ marginRight: ".5rem" }}>
            {this.props.post.city}
            </Badge>

          <Badge bg="primary" 
          style={{ marginRight: ".5rem" }}>
            {this.props.post.region}
            </Badge>

          <Badge bg="primary">{this.props.post.country}</Badge>
          </div>


          <Card.Title className="cardTitle">
          {/* {this.handleName(this.props.post)} */}

          <span style={{ color: "#008de3" }}
          // onClick={() => this.handleNameClick(nameDocToPass.label)}
          >
        {nameDocToPass.label}
        </span>


  {/* <span>
    {this.state.copiedName?<span>✅</span>:<></>}
    </span> */}

           
            <span className="textsmaller">
              {this.getRelativeTimeAgo(this.props.post.$createdAt, this.props.date)}
            </span>

          </Card.Title>

          <Card.Text
          
          
          >
            {this.props.post.description}
          </Card.Text>
       
        </Card.Body>
      </Card>
      </>
    );
  }
}
 
export default Post;
