// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const response = await axios.get(
      `https://api.faceit.com/stream/v2/streamings?competition_id=${id}&competition_type=hub&limit=10&offset=0`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
