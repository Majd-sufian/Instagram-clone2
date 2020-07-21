import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post'
import { db } from './firebase'
import { makeStyles, Button, Modal, Input, Link } from '@material-ui/core';
import { auth } from 'firebase';
import { storage } from 'firebase';
import InstagramEmbed from 'react-instagram-embed';
import ImageUpload from './ImageUpload';


function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles()
  const[modalStyle] = useState(getModalStyle)
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail ] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() =>{
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({id: doc.id, post: doc.data()})))
    })
  }, [])

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        setUser(authUser)

        if (authUser.dispalyName) {
          // dont update username
        } else {
          // if we just created someone
          return authUser.updateProfile({
            dispalyName: username,
          })
        }

      } else {
        // user has logged out
        setUser(null)
      }  
    })

    return () => {
      unsubscribe()
    }
  }, [user, username])
  
  const signUp = (event) => {
    event.preventDefault()
    auth()
    .createUserWithEmailAndPassword(email, password) 
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault()
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

      setOpenSignIn(false)
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      > 
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram"
              />
            </center>
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={ e => setUsername(e.target.value)} 
              />
              <Input
                type="text"
                placeholder="email"
                value={email}
                onChange={ e => setEmail(e.target.value)} 
              />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={ e => setPassword(e.target.value)} 
              />
              <Button type="submit" onClick={signUp}>sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      > 
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram"
              />
            </center>
              <Input
                type="text"
                placeholder="email"
                value={email}
                onChange={ e => setEmail(e.target.value)} 
              />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={ e => setPassword(e.target.value)} 
              />
              <Button type="submit" onClick={signIn}>sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
         className="app__headerImage"
         src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
         alt="instagram"
        /> 

        {user ? (
          <div className="app__loginContainer">
          <Button onClick={() => auth().signOut()}>Logout</Button>
          <Button className="upload-link" variant="outlined" color="secondary">
            <a href="#upload">Upload a Post</a>
          </Button>
          </div>
        ): (
          <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postLift">
          {
            posts.map(({id, post}) => (
              <Post user={user.displayName} key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app__postRight">
          <InstagramEmbed 
            url="https://www.instagram.com/p/CCI3RUZAKbH/"
            maxWidth={320}
            hideCaption={false}
            containerTagNam="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          /> 
        </div>
      </div>
 
      <div id="upload">
          {user?.dispalyName ? (
            <ImageUpload username={user.displayName} />
            ): (
              <h3>Login to upload</h3>
            )
          }
      </div>
    </div>
  );
}

export default App;
