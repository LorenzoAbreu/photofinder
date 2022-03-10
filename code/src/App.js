import './style.css';
import { Container, TextField, Modal, Box, Fade, Backdrop, Button, Typography} from '@mui/material';
import * as Icon from '@mui/icons-material'
import { DMode } from './styled';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [pesquisa,setPesquisa] = useState();
  const [hits,setHits] = useState(0);
  const [photos,setPhotos] = useState();
  const [modalRedirectState,setModalRedirectState] = useState(false);
  const [modalHistoricState,setModalHistoricState] = useState(false);
  const [redirectLink,setRedirectLink] = useState('');
  const [historic,setHistoric] = useState('[]');
  const [darkMode,setDarkMode] = useState(false);

  if (!localStorage.getItem('historic')){
    localStorage.setItem('historic', '[]');
    setHistoric(localStorage.getItem('historic'));
  }

  const searchIMG = () => {
    if (pesquisa){
      axios.get(`https://pixabay.com/api/?key=26053346-572c7a1f7515b114d0df627b1&q=${encodeURIComponent(pesquisa)}&image_type=photo`).then(({data}) => {
        setHits(data.total);
        setPhotos(data.hits);
      })
    }
  }

  const handleHistoric = () => {
    let historic = JSON.parse(localStorage.getItem('historic') || '[]');
    historic.push({
      pesquisa
    });
    localStorage.setItem('historic', JSON.stringify(historic));
    setHistoric(localStorage.getItem('historic'));
  }
  
  const handleKey = (e) => {
    if (e.key === 'Enter'){
      if (pesquisa){
        searchIMG()
        handleHistoric()
      }
    }
  }

  const handleRedirectModal = () => {
    setModalRedirectState(!modalRedirectState);
  }

  const handleHistoricModal = () => {
    setModalHistoricState(!modalHistoricState);
  }

  const toggleDarkmode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('dmode', !darkMode);
  }

  useEffect(() => {
    setHistoric(localStorage.getItem('historic'));
    if (localStorage.getItem('dmode') === 'true'){
      setDarkMode(true);
    }
    else{
      setDarkMode(false);
    }
  }, [])

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    maxWidth: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  return (
    <div className="App">
      <DMode dmode={darkMode} />
      <header>
        <span style={{
          color: darkMode === true ? '#f5f5f5' : '#000',
          borderBottom: darkMode === true ? '3px solid #fff' : '3px solid black'
        }}>PhotoFinder V1</span>
      </header>
      <Container className='container' maxWidth="sm">
        <div className='search-box'>
          <TextField autoComplete='off' style={{ width: '100%',
          backgroundColor: darkMode === true ? '#fff' : 'transparent',
          borderRadius: '4px'
        }}id="outlined-basic" label="Tag... (ex.: dog, cat, friends)" variant="outlined"
          color='info'
          onChange={({target}) => {
            const content = target.value;
            setPesquisa(content);
          }}
          onKeyDown={handleKey}
          />
          <a className='historic' onClick={() => {
            handleHistoricModal();
          }}>
            <Icon.History sx={{fontSize: 40}} style={{
              color: darkMode ? '#f5f5f5' : '#000'
            }} />
          </a>
        </div>
        <div className='fotos-container'>
          {
            photos ? photos.map((photo) => {
              return (
                <div className='foto-container' key={photo.id}>
                  <a target='_blank' rel='noreferrer' href={photo.largeImageURL}>
                  <img className='foto' title={photo.tags} src={photo.largeImageURL} alt={photo.tags} />
                  </a>
                  <div>
                  <Button style={{width: '100%', marginTop: 10}} variant="outlined" onClick={() => {
                      handleRedirectModal()
                      setRedirectLink(photo.pageURL)
                    }}><Icon.Download style={{marginRight: 5}} /> <b>Download</b> <Icon.Download style={{marginLeft: 5}} />
                  </Button>
                  </div>
                </div>
              )
            }) : false
          }
        </div>
      </Container>
      
        <footer style={{marginBottom: 50}} />
        
        <a className='darkmode' onClick={() => {
          toggleDarkmode();
        }}>
          {
            darkMode === true ? <Icon.DarkMode sx={{fontSize: 40}} style={{
              color: '#f5f5f5'
            }} /> : <Icon.DarkModeOutlined sx={{fontSize: 40}} />
          }
        </a>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={modalRedirectState}
        onClose={handleRedirectModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout:  500,
        }}
      >
        <Fade in={modalRedirectState}>
          <Box sx={style}>
          <Typography id="modal-modal-description" style={{
            marginBottom: 30
          }}>
            Você será redirecionado para <b>{redirectLink.substring(0,25)}...</b>, deseja continuar?
          </Typography>
            <Button style={{
              marginRight: 10
            }} variant="contained" target='_blank' href={redirectLink} onClick={() => {
              handleRedirectModal()
            }}>Continuar</Button>
            <Button style={{marginLeft: 10}} variant="text" onClick={() => {
              handleRedirectModal()
            }}>Cancelar</Button>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={modalHistoricState}
        onClose={handleHistoricModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalHistoricState}>
          <Box sx={style}>
            <h1>Histórico</h1>
            <div style={{
                marginTop: 10,
                marginBottom: 10,
                height: 300,
                overflowY: 'scroll'
              }}>
              {
                historic != '[]' ? JSON.parse(historic).map((h) => {
                  return (
                    <p key={Math.floor(Math.random() * 9999999)}>
                      <b>{'>'} </b> {h.pesquisa}
                    </p>
                  )
                }) : (() => {
                  return (
                    <p style={{opacity: .6}} key={Math.floor(Math.random() * 9999999)}>
                      Nenhuma pesquisa encontrada.
                    </p>
                  )
                })()
              }
            </div>
            <Button style={{marginRight: 10}} variant="contained" onClick={() => {
              localStorage.setItem('historic', '[]');
              setHistoric('[]');
            }}>Limpar</Button>
            <Button variant="text" onClick={() => {
              handleHistoricModal()
            }}>Fechar</Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );

}

export default App;
