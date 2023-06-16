import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer'
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import {api} from '../utils/Api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import {auth} from '../utils/AuthApi'
import InfoTooltip from './InfoTooltip';



function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    // const [isDeletePlacePopupOpen, setIsDeletePlacePopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [alarm, setAlarm] = useState({
        logo: '',
        text: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        api.getUserInfo()
        .then(res => {
            setCurrentUser(res);
        })
        .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        Promise.all([api.getInitialCards()])
        .then(res => {
            setCards(...cards, res[0])
        })
        .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        handleTokenCheck();
    }, []);

    const handleTokenCheck = () => {
        if (localStorage.getItem('jwt')) {
            const jwt = localStorage.getItem('jwt');
            auth.checkToken(jwt).then((res) => {
                if (res) {
                    setIsLoggedIn(true);
                    setEmail(res.data.email)
                    navigate('/', {replace: true})
                }
            })
            .catch((err) => {
                setIsLoggedIn(false);
                console.log(err);
            });
        }
    }

    const handleLogin = (email) => {
        setEmail(email);
        setIsLoggedIn(true);
    }

    const signOut = () => {
        localStorage.removeItem('jwt');
        setIsLoggedIn(false);
    }

    const insertAlarm = (data) => {
        setAlarm(data);
    }

    const handleEditProfileClick = () => {
        setIsEditProfilePopupOpen(true);
    }

    const handleEditAvatarClick = () => {
        setIsEditAvatarPopupOpen(true);
    }

    const handleAddPlaceClick = () => {
        setIsAddPlacePopupOpen(true);
    }

    
    // const handleDeletePlaceClick = () => {
    //     setIsDeletePlacePopupOpen(true);
    // }

    const handleInfoTooltipOpen = () => {
        setIsInfoTooltipOpen(true);
    }

    const handleCloseAllPopups = () => {
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsAddPlacePopupOpen(false);
        // setIsDeletePlacePopupOpen(false);
        setSelectedCard(null);
        setIsInfoTooltipOpen(false);
    }

    const handleCardClick = (item) => {
        setSelectedCard(item);
    }

    const handleLikeClick = (card) => {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        
        api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => console.log(err));
    }

    const handleDeleteClick = (card) => {
        api.deleteCard(card._id).then(() => {
            setCards((state) => state.filter((item) => item._id !== card._id));
        })
        .catch((err) => console.log(err));
    }

    const handleUpdateUser = (data) => {
        api.setProfileInfo(data)
        .then((res) => {
            setCurrentUser(res);
            handleCloseAllPopups();
        })
        .catch((err) => console.log(err));
    }

    const handleUpdateAvatar = (data) => {
        api.setAvatar(data)
        .then((res) => {
            setCurrentUser(res);
            handleCloseAllPopups();
        })
        .catch((err) => console.log(err));
    }

    const handlePlaceSubmit = (data) => {
        api.addNewCard(data)
        .then((res) => {
            setCards([res, ...cards]);
            handleCloseAllPopups();
        })
        .catch((err) => console.log(err));
    }
 

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="body">
                <div className="page">
                    <Routes>
                        <Route 
                            path='/'
                            element={
                                <>
                                    <Header onSignOut={signOut} email={email} />
                                    <ProtectedRoute 
                                        element={Main}
                                        onEditProfile={handleEditProfileClick}
                                        onEditAvatar={handleEditAvatarClick}
                                        onAddPlace={handleAddPlaceClick}
                                        onCardClick={handleCardClick}
                                        onTrashClick={handleDeleteClick}
                                        onLikeClick={handleLikeClick}
                                        cards={cards}
                                        isLoggedIn={isLoggedIn}
                                    />
                                </>
                            }
                            
                        />
                        <Route 
                            path='sign-up'
                            element={<Register handleOpenPopup={handleInfoTooltipOpen} insertAlarm={insertAlarm} />}
                        />
                        <Route 
                            path='sign-in'
                            element={<Login  handleLogin={handleLogin} />}
                        />
                        <Route
                            path='*'
                            element={isLoggedIn ? <Navigate to='/' replace /> : <Navigate to='sign-in' replace/>}
                        />
                    </Routes>
                    {/* <Header /> */}
                    {/* <Main 
                        onEditProfile={handleEditProfileClick}
                        onEditAvatar={handleEditAvatarClick}
                        onAddPlace={handleAddPlaceClick}
                        onCardClick={handleCardClick}
                        onTrashClick={handleDeleteClick}
                        onLikeClick={handleLikeClick}
                        cards={cards}
                    /> */}

                    <Footer />
                    <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={handleCloseAllPopups} onUpdateUser={handleUpdateUser} />
                    <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={handleCloseAllPopups} onUpdateAvatar={handleUpdateAvatar} />
                    <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={handleCloseAllPopups} onAddPlace={handlePlaceSubmit} />
                    <InfoTooltip isOpen={isInfoTooltipOpen} onClose={handleCloseAllPopups} alarm={alarm} />
                    {/* <PopupWithForm
                        name="delete"
                        title="Вы уверены?"
                        isOpen={isDeletePlacePopupOpen}
                        onClose={handleCloseAllPopups}
                        btnValue="Удалить"
                    /> */}
                    
                    <ImagePopup
                        card={selectedCard}
                        onClose={handleCloseAllPopups}
                    /> 
                    
                </div>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
