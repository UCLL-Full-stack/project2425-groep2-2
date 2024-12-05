import Head from "next/head";
import Header from "../../components/header";
import UserLoginFrom from "../../components/users/UserLoginForm";

const Login: React.FC = () => {
    return (
        <>
        <Head>
                <title>User Login</title>
        </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                <UserLoginFrom/>
                </section>
            </main>
        </>
    );
};
export default Login;