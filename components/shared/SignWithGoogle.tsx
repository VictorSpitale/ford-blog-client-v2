import styles from '../../styles/SignWith.module.css'

export enum SignStatus {
    SIGN_IN,
    SIGN_UP
}

const SignWithGoogle = ({status}: { status: SignStatus }) => {

    const googleConnect = () => {
        location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
    }

    return (
        <button type="button" className={styles.loginWithGoogleBtn} onClick={googleConnect}>
            Sign {status === SignStatus.SIGN_IN ? "in" : "up"} with Google
        </button>
    );
};

export default SignWithGoogle;