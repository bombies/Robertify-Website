import type { NextApiRequest, NextApiResponse } from 'next'
import client from '../../../lib/paypal'
import paypal from '@paypal/checkout-server-sdk'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
    const PaypalClient = client();
    const request = new paypal.orders.OrdersCreateRequest();
    request.headers['prefer'] = 'return=representation';
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: 'USD',
                    value: '3.99'
                }
            }
        ]
    });

    const response = await PaypalClient.execute(request);
    if (response.statusCode !== 201)
        res.status(500);

    res.json({ orderID: response.result.id })
}