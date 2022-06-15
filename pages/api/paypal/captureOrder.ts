import type { NextApiRequest, NextApiResponse } from 'next'
import client from '../../../lib/paypal'
import paypal from '@paypal/checkout-server-sdk'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { orderID } = req.body;
    const PaypalClient = client();
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({ payment_source: undefined });

    const response = await PaypalClient.execute(request);
    if (!response)
        res.status(500);

    res.json({ ...response.result });
}