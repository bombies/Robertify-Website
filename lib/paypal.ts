import paypal from '@paypal/checkout-server-sdk';

const configureEnvironment = () => {
    const clientID = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    return process.env.NODE_ENV === 'production' ?
        new paypal.core.LiveEnvironment(clientID, clientSecret)
        : new paypal.core.SandboxEnvironment(clientID, clientSecret)
}

const client = () => {
    return new paypal.core.PayPalHttpClient(configureEnvironment());
}

export default client;