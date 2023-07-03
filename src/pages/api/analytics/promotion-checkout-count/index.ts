import axios from 'axios';
import { IAnalytics } from '../../../../Models/Analytics';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const response = await axios.get<IAnalytics[]>(
      process.env.NEXT_PUBLIC_API_URL + `analytics/nbPassageByDay`,
      {
        data: req.body,
        headers: {
          Authorization: `Bearer ${req.cookies.token}`,
        },
      },
    );
    res.status(response.status).json(response.data);
  }
}