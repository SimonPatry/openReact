import react, {useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {Button, TextField} from '@mui/material';
import "./comments.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

export default function CommentsDrawer(coms, setComments) {
    
    const comments = coms.comments;
    const [state, setState] = useState(false);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        setEdit(false);
    }, [edit]);

    const handleChange = (e, key) => {
        const tmpArr = [...comments];
        tmpArr[key].title = e.target.title;
        tmpArr[key].content = e.target.content;
        setComments.setComments([...tmpArr]);
      }

    return (
        <>
            <Button className="toggleBtn" onClick={() => {
                setState(state ? false : true)
            }}>
                {"<"}
            </Button>
            <Drawer
                hideBackdrop={true}
                anchor={'right'}
                open={state}
                onClose= {() => {
                    setState(state ? false : true)
                }}
            >
                <Box                
                    sx={{ width: 300 }}
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
                    <div className='comments'>
                        {comments.map((comment, key) => {
                            return (comment.edit == false ?
                            <div key={key}
                                className={`${comment.selected ? 'selectedComment' : 'comment'}`}
                                onClick={() => {
                                comment.selected = comment.selected ? false : true;
                                setEdit(true);
                            }}
                            >
                                <p>{comment.title}</p>
                                <p>{comment.content}</p>
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
                                <TextField
                                    id="title"
                                    label="title"
                                    onChange={(e) => handleChange(e, key)}
                                />
                                <TextField
                                    id="content"
                                    label="content"
                                    onChange={(e) => handleChange(e, key)}
                                />
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
                </Box>
            </Drawer>
        </>
    );
}

/*  */