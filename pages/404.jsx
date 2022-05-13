import Layout from "../components/Layout";

export default function Robertify404() {
    return (
        <Layout showLogin={false} showFooter={false} title='Robertify - Page Not Found'>
            <main className='four-o-four'>
                <h1>404</h1>
                <h2>Oh no!</h2>
                <h3>This page doesn&apos;t exist</h3>
                <p>If you believe this is an error, please, <a href='https://discord.gg/x9YxheBSzE'>let us know!</a></p>
            </main>
        </Layout>
    )
}