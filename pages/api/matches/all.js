// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
export default function handler(req, res) {
  axios.get(`https://api.faceit.com/match/v2/match?entityType=hub&entityId=ef607668-a51a-4ea6-8b7b-dab07e0ab151&state=SUBSTITUTION,CAPTAIN_PICK,VOTING,CONFIGURING,READY,ONGOING,MANUAL_RESULT,PAUSED,ABORTED&limit=20&offset=0`).then(response => {
    res.status(200).json(response.data)
  });
}
