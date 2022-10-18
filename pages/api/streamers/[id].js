// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
export default function handler(req, res) {
  const { id } = req.query;
  axios
    .get(
      `https://api.faceit.com/stream/v2/streamings?competition_id=${id}&competition_type=hub&limit=10&offset=0`
    )
    .then((response) => {
      res.status(200).json(response.data);
    });
}
