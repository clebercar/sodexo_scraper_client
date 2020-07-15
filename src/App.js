import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as cpfValidator from "@fnando/cpf";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import { 
  Box,
  Container, 
  Typography, 
  CssBaseline, 
  Avatar, 
  Button, 
  TextField
} from '@material-ui/core';

import useStyles from './styles';

export default function App() {
  const classes = useStyles();
  
  const [data, setData] = useState(null);
  const [cpf, setCpf] = useState({ error: false, value: null });
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post('http://localhost:3333/scrappers', { 
        cpf: cpfValidator.strip(cpf.value), password
      })

      setData(data);
      setLoading(false);
    }catch(error) {
      const { response: { data } } = error

      toast.error(data.message);
      setLoading(false);
    }
  }

  function handleCPFvalidate(e) {
    const isValid = cpfValidator.isValid(e.target.value);
  
    if(isValid) {
      setCpf({ error: false, value: e.target.value });

      return;
    }
    
    setCpf({ ...cpf, error: true });
  }

  function handleChange(e) {
    setCpf({ ...cpf, value: cpfValidator.format(e.target.value )})
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sodexo
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            error={cpf.error}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="cpf"
            label="CPF" 
            name="cpf"
            value={cpf.value ? cpf.value : '' }
            onChange={handleChange}
            onBlur={(e) => handleCPFvalidate(e)}
            autoFocus
            helperText={cpf.error ? 'CPF inválido.' : null }
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            onBlur={e => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading || cpf.error}
            className={classes.submit}
          >
            Extrair dados
          </Button>
        </form>
        {loading && <Alert severity="info">Buscando informações.</Alert>}

        { data && (
          <Alert severity="success">
            <Box display="flex" flexDirection="column">
              <span>
                <strong>Saldo atual:</strong>
               {data.balance}
              </span>
              <span>
                <strong>4 últimos dígitos do cartão:</strong>
                {data.cardNumber}
              </span>
              <span>
                <strong>Último benefício:</strong>
                {data.lastBenefit}
              </span>
              <span>
                <strong>Próximo benefício:</strong>
                {data.nextBenefit}
              </span>
            </Box>
          </Alert>
        )}
        
      </div>
    </Container>
  );
}