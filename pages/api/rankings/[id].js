// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const response = await axios.get(
      `https://api.faceit.com/leaderboard/v1/ranking/hub/${id}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: e.message });
  }
}
