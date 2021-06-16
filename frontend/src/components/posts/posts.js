import React from 'react';
import {withRouter} from 'react-router-dom';
import NavBarContainer from '../nav_bar/nav_bar_container';
import PostBox from './post_box';
import './posts_index.scss';
import PostIndexMap from '../google_maps/post_index_map';

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
    console.log(this.state)
    console.log(this.props.posts)
  }

  componentWillMount() {
    this.props.fetchPosts();
  }

  componentWillReceiveProps(newState) {
    this.setState({ posts: newState.posts })
  }

  goToCreate(e) {
    this.props.history.push("/posts/create")
  }

  render() {
    if (!this.state.posts) return null;
    if (this.state.posts.length === 0) {
      return (
        <div>
          <NavBarContainer/>
          <h3>There are currently no posts.</h3>
          <button onClick={(e) => this.goToCreate()}>Create a Post</button>
        </div>
      )
    } else {
      return (
        <div>
          <NavBarContainer/>
          <h2>All Posts</h2>
          <button onClick={(e) => this.goToCreate()}>Create a Post</button>
          <div className="post-index-main-content">
            <div className="posts-index-container">
              {this.state.posts.map(post => (
                <PostBox key={post.id} post={post} />
              ))}
            </div>
            <div className="maps-container">
              <PostIndexMap posts={this.state.posts} />
            </div>
          </div>
        </div>
      )
    }
  }
}

export default withRouter(Posts);