// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
export default function handler(req, res) {
  axios.get('https://api.faceit.com/stream/v2/streamings?competition_id=ef607668-a51a-4ea6-8b7b-dab07e0ab151&competition_type=hub&limit=10&offset=0').then(response => {
    res.status(200).json(response.data)
  });
}
