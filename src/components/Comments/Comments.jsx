import react, {useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {Button, TextField} from '@mui/material';
import "./comments.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';



const openSelectCommentFromVector = ({vector, comments, updateComments}) => {
    console.log(comments);
    let tmpArr = [...comments];
    comments.map((comment, key) => {
        if (comment.vector === vector) {
            tmpArr[key] = {
                ...tmpArr[key],
                selected: true
            }
            updateComments([...tmpArr])
        }
    })
}

const CommentsDrawer = ({ comments, updateComments }) => {
    
    const [state, setState] = useState(false);
    const [edit, setEdit] = useState(false);
    const [newComment, setNewComment] = useState({
            id: comments[comments.length-1].id++,
            title: 'title',
            content: "lorem ipsum",
            author: 'Jhon Doe',
            vector: undefined,
            selected: false,
            edit: false,
    });

    useEffect(() => {
        setEdit(false);
    }, [edit]);

    const handleChange = (e, key) => {
        const tmpArr = [...comments];
        tmpArr[key] = {
            ...tmpArr[key],
            [e.target.id]: e.target.value
        }
        updateComments([...tmpArr]);
    }

    const handleTitleChange = (e) => {
        setNewComment({
            ...newComment,
            title: e.target.value
        })
    }

    const handleContentChange = (e) => {
        setNewComment({
            ...newComment,
            content: e.target.value
        })
    }

    const addComment = () => {
        updateComments([
            ...comments,
            newComment
        ]);
        setEdit(true);
    }

    return (
        <>
            <Button className="toggleBtn" onClick={() => {
                setState(state ? false : true)
            }}>
                {"<"}
            </Button>
            <Drawer
                sx={{left: "60vw"}}
                hideBackdrop={true}
                anchor={'right'}
                open={state}
                onClose= {() => {
                    setState(state ? false : true)
                }}
            >
                <Box                
                    sx={{ width: "40vw", height: "100vh"}}
                    role="presentation"
                    className='commentsBox'
                >
                    <Button className="toggleBtnIn"
                        onClick={() => {
                            setState(state ? false : true);
                        }}
                    >
                        {">"}
                    </Button>
                    <div>
                        <div className='comments'>
                            <h2>Commentaires</h2>
                            {comments.map((comment, key) => {
                                return (comment.edit == false ?
                                <div key={key}
                                    className={`commentBlock ${comment.selected ? 'selectedComment' : 'comment'}`}
                                    onClick={() => {
                                    comment.selected = comment.selected ? false : true;
                                    setEdit(true);
                                }}
                                >
                                    <div className='(commentContent'>
                                        <p>{comment.title}</p>
                                        <p>{comment.content}</p>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            comment.edit = true;
                                            setEdit(true);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </Button>
                                </div>
                                :
                                <div key={key}>
                                    <div className='commentContent'>
                                        <TextField
                                            id="title"
                                            label="title"
                                            onChange={(e) => handleChange(e, key)}
                                            value={comment.title}
                                        />
                                        <TextField
                                            id="content"
                                            label="content"
                                            onChange={(e) => handleChange(e, key)}
                                            value={comment.content}
                                        />
                                    </div>
                                    <Button
                                        onClick={() => {
                                            comment.edit = false;
                                            setEdit(true);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faFloppyDisk} />
                                    </Button>
                                </div>);
                            })}
                        </div>
                        <div className='addComment'>
                            <h2>Ajouter un commentaire:</h2>
                            <div className='commentContent'>
                                <TextField
                                    id="title"
                                    label="title"
                                    onChange={(e) => handleTitleChange(e)}
                                />
                                <TextField
                                    id="content"
                                    label="content"
                                    onChange={(e) => handleContentChange(e)}
                                />
                            </div>
                            <Button
                                onClick={(e) => {
                                    addComment(e);
                                }}
                            >
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </Button>
                        </div>
                    </div>
                    
                </Box>
            </Drawer>
        </>
    );
}

export { CommentsDrawer, openSelectCommentFromVector } 