import styles from '../../styles/SignWith.module.css'

export enum SignStatus {
    SIGN_IN,
    SIGN_UP
}

const SignWithGoogle = ({status}: { status: SignStatus }) => {
    return (

        <button type="button" className={styles.loginWithGoogleBtn}>
            Sign {status === SignStatus.SIGN_IN ? "in" : "up"} with Google
        </button>
    );
};

export default SignWithGoogle;