// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const response = await axios.get(
      `https://api.faceit.com/match/v2/match?entityType=hub&entityId=${id}&state=SUBSTITUTION,CAPTAIN_PICK,VOTING,CONFIGURING,READY,ONGOING,MANUAL_RESULT,PAUSED,ABORTED&limit=20&offset=0`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
