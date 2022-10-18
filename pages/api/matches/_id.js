// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
export default function handler(req, res) {
  axios.get(`https://api.faceit.com/match/v2/match/${req.params.id}`).then(response => {
    res.status(200).json(response.data)
  });
}
