import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Page from '#components/Page';

interface Props {
    value?: number;
}

const Login = (props: Props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userInfo, setuserInfo] = useState([]);

    // const { userDataMain, loadingUser, error } = useSelector((state: RootState) => state.user);

    // useEffect(() => {
    //     if (!loadingUser) {
    //         setuserInfo(userDataMain);
    //     }
    // }, [loadingUser]);

    const handleUsername = (e) => {
        setUsername(e.target.value);
    };
    const handlePassword = (e) => {
        setPassword(e.target.value);
    };
    // const navigate = useNavigate();
    const loginCrendentials = {
        username,
        password,
    };
    // const dispatch = useDispatch();
    // const handleLogin = () => {
    //     dispatch(userData(loginCrendentials, navigate));
    // };
    // const dothis = (e) => {
    //     if (e.key === 'enter') {
    //         dispatch(userData(loginCrendentials, navigate));
    //     }
    // };


    return (
        <>
            <Page hideFilter hideMap />
            <div className={styles.mainLogin}>
                <div className={styles.mainLoginContainer}>
                    <div className={styles.signIn}>
                        <div className={styles.signinTitles}>
                            <h1>Welcome to BIPAD Admin Portal</h1>
                            <p>
                            An integrated and comprehensive platform to support
                            health data management.
                            </p>
                            <hr />
                        </div>
                        <p style={{ color: 'red', fontSize: '12px', margin: '0px 0px 0px 148px' }}>
                            {' '}
                            {/* {error} */}
                        </p>

                        <div className={styles.formElements}>
                            <div className={styles.newLoginForm}>
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.newinput}
                                        placeholder="Username"
                                        onChange={handleUsername}
                                    // autoFocus
                                    />
                                </div>
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.newinput}
                                        placeholder="Password"
                                        type="password"
                                        onChange={handlePassword}

                                    />
                                </div>

                                <hr className={styles.horzLine} />
                            </div>
                            <div className={styles.loginBtn}>
                                <button
                                    type="submit"
                                    className={styles.newsignIn}
                                // onClick={handleLogin
                                // onKeyDown={e => dothis(e)}
                                >
                                Login
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Login;
function useNavigate() {
    throw new Error('Function not implemented.');
}
