import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef, useState } from "react";

export default function MatchCard({ match, streamers }) {
  const [expanded, setExpanded] = useState(false);
  const parent = useRef(null)
  const players1 = useRef(null)
  const players2 = useRef(null)
  useEffect(() => {
    parent.current && autoAnimate(parent.current)
    players1.current && autoAnimate(players1.current)
    players2.current && autoAnimate(players2.current)
  }, [parent])

  const expand = () => setExpanded(!expanded)
  const verifyStream = (id) => {
    const playerStreaming = streamers.filter((stream) => {
      return stream.profile.id == id;
    });

    return playerStreaming[0];
  };
  const hasStreamInMatch = () => {
    let stream = false;
    streamers.forEach(streamer => {
      if (streamer.match_id == match.id) stream = true;
    });
    return stream;
  }
  const verifyResult = (score1, score2) => {
    if (score1 == score2) {
      return "stat-value text-gray-400 font-semibold font-play text-3xl";
    } else if (score1 > score2) {
      return "stat-value text-green-500 font-semibold font-play text-3xl";
    }

    return "stat-value text-red-500 text-opacity-50 font-play font-semibold text-3xl";
  };

  const getMap = (maps, pick, allMaps) => {
    const map = maps?.filter((map) => {
      return map.class_name == pick;
    })[0];
    if (!map) {
      if (!allMaps)
        return {
          class_name: "Picking map",
          image_lg:
            "https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png",
        };
      return allMaps[0];
    }
    return map;
  };

  return (
    <div key={match.id} className={`w-full card overflow-visible rounded-none !rounded-md border-4 border-gray-700 bg-card relative ${hasStreamInMatch() ? '!border-indigo-500' : ''}`}>
      {hasStreamInMatch() && <div className="absolute flex font-red-hat font-semibold text-sm items-center gap-2 text-gray-300 top-0 w-full card-bg left-0 p-2 py-1 bg-card"><div className="h-2 w-2 animate-ping rounded-full bg-indigo-500"></div><div className="h-2 w-2 absolute rounded-full bg-indigo-500"></div> Stream on</div>}
      <div className="card-bg flex absolute w-full h-full">
        <figure>
          <img
          className="object-cover"
            src={match.teams.faction1.avatar}
            alt={match.teams.faction1.name}
          />
        </figure>
        <figure>
          <img
          className="object-cover"
            src={match.teams.faction2.avatar}
            alt={match.teams.faction2.name}
          />
        </figure>
      </div>
      <div className="p-4 px-8 pb-8 card-body">
        <div onClick={expand} className="active:scale-95 z-10 absolute right-0 left-0 lg:bottom-4 bottom-2 hover:bg-indigo-500 hover:text-white hover:scale-110 transition mx-auto cursor-pointer h-8 w-8 lg:h-8 lg:w-8 h-7 w-7 flex justify-center items-center rounded-full border-2 text-indigo-500 border-indigo-500"><span className="material-symbols-outlined">{expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span></div>
        <div className="relative flex flex-col">
          <div className="scoreboard flex justify-center mb-4 w-full gap-8">
            <h2 className="w-1/2 mr-auto flex items-center font-red-hat text-2xl gap-2 text-white font-medium min-w-fit">
              {match.teams.faction1.name}
            </h2>
            <div className="score flex gap-2 pt-1 pb-2 px-4 rounded-lg font-semibold text-3xl flex items-center">
              <div
                className={verifyResult(
                  match.summaryResults?.factions?.faction1.score,
                  match.summaryResults?.factions?.faction2.score
                )}
              >
                {match.summaryResults?.factions?.faction1.score < 10
                  ? `0${match.summaryResults?.factions?.faction1.score}`
                  : match.summaryResults?.factions?.faction1.score}
              </div>
              <span className="lg:h-12 lg:w-12 h-7 w-7 rounded-full bg-gray-700 bg-opacity-50 grid font-play text-indigo-500 text-sm place-items-center">VS</span>
              <div
                className={verifyResult(
                  match.summaryResults?.factions?.faction2.score,
                  match.summaryResults?.factions?.faction1.score
                )}
              >
                {match.summaryResults?.factions?.faction2.score < 10
                  ? `0${match.summaryResults?.factions?.faction2.score}`
                  : match.summaryResults?.factions?.faction2.score}
              </div>
            </div>
            <h2 className="w-1/2 ml-auto justify-end flex text-2xl font-red-hat items-center gap-2 text-white font-medium min-w-fit">
              {match.teams.faction2.name}
            </h2>
          </div>
        </div>
        {expanded && <div className="w-full h-fit flex justify-center">
          <div className="map-card border-2 border-gray-700 shadow-lg h-fit p-1 rounded-lg flex items-center justify-center w-52 image-full">
            <figure>
              <img
                src={
                  getMap(
                    match.voting?.map.entities,
                    match.voting?.map.pick,
                    match.maps
                  )?.image_lg
                }
                className="rounded-lg"
                alt={
                  getMap(
                    match.voting?.map.entities,
                    match.voting?.map.pick,
                    match.maps
                  )?.class_name
                }
              />
            </figure>
            <div className="map-card-body h-8 flex items-center justify-center">
              <h2 className="text-gray-200 font-play text-base mx-auto">
                {
                  getMap(
                    match.voting?.map.entities,
                    match.voting?.map.pick,
                    match.maps
                  )?.class_name
                }
              </h2>
            </div>
          </div>
        </div>}
        {expanded && <div className="flex overflow-hidden justify-between">
          <div className="flex flex-col gap-4">
            {match.teams.faction1.roster.map((player) => {
              return (
                <div key={player.id} className="flex h-10 gap-2 items-center">
                  <div className="avatar">
                    <div
                      className={
                        verifyStream(player.id)
                          ? "w-8 h-fit rounded-full border-purple-500 border-2"
                          : "w-8 border-2 border-white h-fit rounded-full"
                      }
                    >
                      <img src={player.avatar} />
                    </div>
                  </div>
                  <div className="flex flex-col font-play text-gray-400 font-medium text-base">
                    {player.nickname}
                    {verifyStream(player.id) ? (
                      <a
                        className="flex items-center"
                        target="blank"
                        href={verifyStream(player.id).stream.channel_url}
                      >
                        <span className="flex gap-2 font-medium text-purple-500 transition px-1 pl-0.5 rounded hover:bg-indigo-500 hover:text-white">
                          {verifyStream(player.id).stream.channel_name}
                          <div className="mb-auto gap-1 text-red-500 font-medium flex items-center">
                            <span className="text-red-500 text-base font-bold material-symbols-outlined">
                              person
                            </span>
                            {verifyStream(player.id).stream.viewers}
                          </div>
                        </span>
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-4 items-end">
            {match.teams.faction2.roster.map((player) => {
              return (
                <div
                  key={player.id}
                  className="flex p-1 h-10 gap-2 items-center"
                >
                  <div className="flex flex-col font-play items-end font-medium text-gray-400 text-base">
                    {player.nickname}
                    {verifyStream(player.id) ? (
                      <a
                        className="flex items-center"
                        target="blank"
                        href={verifyStream(player.id).stream.channel_url}
                      >
                        <span className="flex gap-2 font-medium text-purple-500 transition px-1 pr-0.5 rounded hover:bg-indigo-500 hover:text-white">
                          <div className="mb-auto gap-1 text-red-500 font-medium flex items-center">
                            {verifyStream(player.id).stream.viewers}
                            <span className="text-red-500 text-base font-bold material-symbols-outlined">
                              person
                            </span>
                          </div>
                          {verifyStream(player.id).stream.channel_name}
                        </span>
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="avatar">
                    <div
                      className={
                        verifyStream(player.id)
                          ? "w-8 h-fit rounded-full border-purple-500 border-2"
                          : "w-8 border-2 border-white h-fit rounded-full"
                      }
                    >
                      <img src={player.avatar} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>}

      </div>
    </div>
  );
}
