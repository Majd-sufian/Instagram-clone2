import React, { useState, useEffect } from 'react'
import './post.css'
import { db } from './firebase'
import Avatar from "@material-ui/core/Avatar"
import firebase from "firebase"

function Post( {user, postId, username , caption, imageUrl}) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe
        if (postId) {
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()))
            })
        }

        return () => {
            unsubscribe()
        }
    },[postId])

    const postComment = (event) => {
        event.preventDefault()
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg"
                />    
                <h3>{username}</h3>

            </div>

            <img className="post__image" src={imageUrl} />

            <h4 className="post__text"><strong class="post__comment__user">{username}</strong> <span> {caption}</span></h4>
        

            <div className={comments.length > 0 ? 'post__comments' : ''} >
                {comments.map((comment) => (
                    <p className="post__comment__text">
                        <strong class="post__comment__user">{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

        <form className="post__commentBox">
            <input 
                className="post__input"
                tyoe="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button 
                className="post__button"
                tyoe="submit"
                disabled={!comment}
                onClick={postComment}
            >Post</button>    
        </form>
       
       
        </div>
        
    )
}

export default Post
