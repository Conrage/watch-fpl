// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const resLea = await axios.get(
      `https://api.faceit.com/leaderboard/v1/leaderboard/hub/${id}/all`
    );
    const leaderboard_id = resLea.data.payload?.currentLeaderboard?.leaderboardId;
    const response = await axios.get(
      `https://api.faceit.com/leaderboard/v2/ranking/${leaderboard_id}?size=true&limit=15&offset=0`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}
