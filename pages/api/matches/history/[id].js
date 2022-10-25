// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
export default async function handler(req, res) {
  const { id } = req.query;

  const getAllPlayers = (matches) => {
    const players = [];

    matches.forEach(match => {
        match.teams.faction1.roster.forEach(player => players.push(player))
        match.teams.faction2.roster.forEach(player => players.push(player))
    });
    return removeDuplicates(players);
  }

  const removeDuplicates = (players) => {
    return players.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
  }
  try {
    const response = await axios.get(
      `https://api.faceit.com/match-history/v4/matches/competition?size=1000&id=${id}&type=hub`
    );
    const players = getAllPlayers(response.data.payload);
    res.status(200).json(players);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
