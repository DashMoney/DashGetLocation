import React from 'react';

import Post from './Post';

class Posts extends React.Component {
  
  render() { 

    let d = Date.now();
//SO THERE WILL BE A SELECTEDCATEGORYBUTTON SO DO I WANT TO PASS ALL THE CATEGORY POSTS HERE OR JUST THE ONE CATEGORY THAT WILL BE DISPLAYED? 
//i THOUGHT TO JUST PASS THE ONE TO BE DISPLAYED BUT THEN i HAVE TO WORRY ABOUT DISPLAYING THAT ONE ON LOAD CHANGES AND SUCH BUT i THINK IT IS JUST EASIER TO JUST SORT IT HERE AND SO LESS TO WORRY ABOUT IN APP.JS <- HMM YEP
    let postArray = [];
    let postNameArray = [];

    switch (this.props.selectedCategoryButton){
      case 'offrent':
        postArray = this.props.OffRentPosts;
        postNameArray = this.props.OffRentNames;
          break;

      case 'offbiz':
        postArray = this.props.OffBizPosts;
        postNameArray = this.props.OffBizNames;
          break;

      case 'offother':
        postArray = this.props.OffOtherPosts;
        postNameArray = this.props.OffOtherNames;
          break;

      case 'lookrent':
        postArray = this.props.LookRentPosts;
        postNameArray = this.props.LookRentNames;
          break;

      case 'lookother':
        postArray = this.props.LookOtherPosts;
        postNameArray = this.props.LookOtherNames;
          break;

      default:
        postArray= [];
        postNameArray= [];
    }

    let posts = postArray.map(
      (post, index) => {  
        //console.log(post);
        return (
          <Post
          key={index}
          mode={this.props.mode} 
          index={index} 

          post = {post}
          date = {d}

          identity={this.props.identity}
          uniqueName={this.props.uniqueName}
          showModal={this.props.showModal}
          
          handleSearchedPost={this.props.handleSearchedPost}

          PostNames={postNameArray}
        
          />
          
        )
      }
    );

    return (
      <>
      {posts}
      </>
    );
  }
}
 
export default Posts;
