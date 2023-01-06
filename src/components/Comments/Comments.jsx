import react, {useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {Button, TextField} from '@mui/material';
import "./comments.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import {createNewVector } from '../Vectors/Vectors'


const openSelectCommentFromVector = () => {
    
}

const CommentsDrawer = () => {
    const {drawer, setDrawer, newVctr, setNewVctr, vectors, setVectors} = useContext(AppContext);

    const [errorMessage, setErrorMessage] = useState('');
    const [edit, setEdit] = useState(false);
    const [newComment, setNewComment] = useState({
            title: 'title',
            content: "lorem ipsum",
            selected: false,
            edit: false,
    });

    useEffect(() => {
        setEdit(false);
    }, [edit]);

    const handleChange = (e, key) => {
        const tmpArr = [...vectors];
        console.log(tmpArr)
        tmpArr[key].comment = {
            ...tmpArr[key].comment,
            [e.target.id]: e.target.value
        }
        return [...tmpArr]
    }

    const handleTitleChange = (e) => {
        const vec = vectors[vectors.length -1]
        vec.comment.title = e.target.value;
    }

    const handleContentChange = (e) => {
        const vec = vectors[vectors.length -1]
        vec.comment.content = e.target.value;
    }

    const addComment = () => {
        if (vectors[vectors.length-1].comment.title === '' 
        || vectors[vectors.length-1].comment.content === '')
            setErrorMessage("Title and Content can't be empty for comments !");
        else {
            createNewVector(vectors);
            setErrorMessage('');
            setEdit(true);
            setNewVctr(false);
        }
    }

    return (
        <>
            <Button className="toggleBtn" onClick={() => {
                setDrawer(drawer ? false : true)
                setNewVctr(false);
            }}>
                {"<"}
            </Button>
            <Drawer
                sx={{left: "60vw"}}
                hideBackdrop={true}
                anchor={'right'}
                open={drawer}
                onClose= {() => {
                    setDrawer(drawer ? false : true)
                }}
            >
                <Box                
                    sx={{ width: "40vw", height: "100vh"}}
                    role="presentation"
                    className='commentsBox'
                >
                    <Button className="toggleBtnIn"
                        onClick={() => {
                            setDrawer(drawer ? false : true);
                        }}
                    >
                        {">"}
                    </Button>
                    <div>
                        {!newVctr &&
                            <div className='comments'>
                                <h2>Commentaires</h2>
                                {vectors.length > 0 && 
                                vectors.map((vector, key) => {
                                    return (vector.comment.edit == false ?
                                    <div key={key}
                                        className={`commentBlock ${vector.comment.selected ? 'selectedComment' : 'comment'}`}
                                        onClick={() => {
                                        vector.comment.vector.selected = vector.comment.selected ? false : true;
                                        setEdit(true);
                                    }}
                                    >
                                        <div className='(commentContent'>
                                            <p>{vector.comment.title}</p>
                                            <p>{vector.comment.content}</p>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                vector.comment.edit = true;
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
                                                onChange={(e) => {
                                                    const vecs = handleChange(e, key);
                                                    setVectors(vecs);
                                                }}
                                                value={vector.comment.title}
                                            />
                                            <TextField
                                                id="content"
                                                label="content"
                                                onChange={(e) => {
                                                    const vecs = handleChange(e, key);
                                                    setVectors(vecs);
                                                }}
                                                value={vector.comment.content}
                                            />
                                        </div>
                                        <Button
                                            onClick={() => {
                                                vector.comment.edit = false;
                                                setEdit(true);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faFloppyDisk} />
                                        </Button>
                                    </div>);
                                })}
                            </div>
                        }
                        {newVctr &&
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
                                    {errorMessage != '' &&
                                        <p>{ errorMessage }</p>
                                    }
                                </div>
                                <Button
                                    onClick={(e) => {
                                        addComment(e);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </Button>
                            </div>
                        }
                    </div>
                    
                </Box>
            </Drawer>
        </>
    );
}

export { CommentsDrawer, openSelectCommentFromVector } 