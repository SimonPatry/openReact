import './signin.scss';
import {Button, TextField} from "@mui/material";
import {fetchPost} from "../../utils/fetch";
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Alert from "../Alert/Alert";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import AppContext from "../../context/AppContext";

const SignIn = () => {
  // Hook de navigation
  const navigate = useNavigate();

  // On récupère les variables d'environnement
  const { REACT_APP_SIGNIN } = process.env;

  // On récupère le context
  const { openError, setOpenError, handleCloseError } = useContext(AppContext);

  // On réinitialise le state d'ouverture du message d'erreur
  useEffect(() => {
    setOpenError(false);
  }, [])

  // On définit un state par défaut pour les credentials
  const emptyCredentials = {
    username: '',
    password: ''
  }

  // Tous les states de SignIn.jsx
  const [credentials, setCredentials] = useState(emptyCredentials);

  // Fonction de signin
  const handleSignIn = async(e) => {
    e.preventDefault();
    try{
      await fetchPost(REACT_APP_SIGNIN, credentials)
        .then(res => {
          // Si l'utilisateur n'existe pas, on redirige vers la page de login
          if(res.status === true){
            navigate('/login');
          }
          // Sinon on affiche un message d'erreur et on réinitialise les champs
          else{
            setOpenError(true);
            navigate('/sign_in');
            throw new Error(res.message);
          }
        });
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
    <div className="signin">
      <div className="signin__container">
        <div className="signin__container__wrapper">
          <h1>Sign in</h1>
          <form action="/sign_in" method="POST">
            <div className="signin__container__wrapper__input">
              <TextField id="username" className="formInput" label="Username" color="primary" onChange={(e) => handleChange(e)} />
              <TextField id="password" className="formInput" label="Password" type="password" color="primary" onChange={(e) => handleChange(e)} />
            </div>
            <Button variant="outlined" type="submit" className="signin__container__wrapper__button" onClick={(e) => handleSignIn(e)}>
              Sign in
            </Button>
          </form>
          <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
            <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
              User already exists, try again
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
}

export default SignIn;