import './login.scss';
import {fetchPost} from "../../utils/fetch";
import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import {Button, TextField} from "@mui/material";
import Alert from '../Alert/Alert';
import AppContext from "../../context/AppContext";

const Login = ({ setSessionToken }) => {
  // Hook de navigation
  const navigate = useNavigate();

  // On récupère les variables d'environnement
  const { REACT_APP_LOGIN } = process.env;

  // On récupère le context
  const { openSuccess, setOpenSuccess, openError, setOpenError, handleCloseSuccess, handleCloseError } = useContext(AppContext);

  // On définit un state par défaut pour les credentials
  const emptyCredentials = {
    username: '',
    password: ''
  }

  // Tous les states de Login.jsx
  const [credentials, setCredentials] = useState(emptyCredentials);

  // Fonction de login
  const handleLogin = async(e) => {
    e.preventDefault();

    try{
      await fetchPost(REACT_APP_LOGIN, credentials)
        .then(res => {
          // Si le login est correct, on stocke le token dans le localStorage et on redirige vers la page d'accueil
          if(res.status === true){
            localStorage.setItem('token', res.token);
            setSessionToken(res.token);
            setOpenSuccess(true);
            navigate('/');
          }
          // Sinon on affiche un message d'erreur et on réinitialise les champs
          else{
            setOpenError(true);
            navigate('/login');
            throw new Error(res.message);
          }
        })
    } catch(e) {
      console.error(e);
    }
  }

  // Fonction de mise à jour du formulaire
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.id]: e.target.value}
    );
  }

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__container__wrapper">
          <h1>Log in</h1>
          <form action="/login" method="POST">
            <div className="login__container__wrapper__input">
              <TextField id="username" className="formInput" label="Username" color="primary" onChange={(e) => handleChange(e)} />
              <TextField id="password" className="formInput" label="Password" type="password" color="primary" onChange={(e) => handleChange(e)} />
            </div>
            <Button variant="outlined" type="submit" className="login__container__wrapper__button" onClick={(e) => handleLogin(e)}>
              Log in
            </Button>
          </form>
          <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
            <Alert onClose={handleCloseSuccess} severity="error" sx={{ width: '100%' }}>
              You've successfully signed out !
            </Alert>
          </Snackbar>
          <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
            <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
              Logs are incorrect, try again
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
}

export default Login;