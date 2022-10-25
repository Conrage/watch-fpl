// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
export default async function handler(req, res) {
  const { id } = req.query;
  const config = {
    headers: { Authorization: `Bearer ${process.env.TOKEN_FACEIT}` },
  };
  try {
    const response = await axios.get(
      `https://api.faceit.com/queue/v1/player/${id}?limit=15`,
      config
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
