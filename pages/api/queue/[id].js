// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
export default function handler(req, res) {
  const { id } = req.query;
  const config = {
    headers: { Authorization: `Bearer ${process.env.TOKEN_FACEIT}` },
  };
  axios
    .get(`https://api.faceit.com/queue/v1/player/${id}?limit=15`, config)
    .then((response) => {
      res.status(200).json(response.data || []);
    });
}
