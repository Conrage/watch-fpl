import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";

export default function Home() {
  const getFromStorage = (key) => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(key);
    }
  };

  const setToStorage = (key, value) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  };

  const translateId = {
    SA: {
      hub_id: "ef607668-a51a-4ea6-8b7b-dab07e0ab151",
      queue_id: "633f0132403c133d88b9832b",
      leaderboard_id: "6346d436feeb182ac0852df8",
    },
    CSA: {
      hub_id: "81752520-7bad-42a7-a70d-d43fd66011de",
      queue_id: "6340418ad7689d5091584220",
      leaderboard_id: "634967c64c180a16e15ded04",
    },
    NA: {
      hub_id: "748cf78c-be73-4eb9-b131-21552f2f8b75",
      queue_id: "5ec3276bf69bec00070a854b",
      leaderboard_id: "6337427bf6d76e5b1c191fb5",
    },
    CNA: {
      hub_id: "b6895a52-a70c-41d6-b096-7d05377720c4",
      queue_id: "5aa05432f4ae3d0007e9e0c8",
      leaderboard_id: "633741aff6d76e5b1c1911e6",
    },
    EU: {
      hub_id: "74caad23-077b-4ef3-8b1d-c6a2254dfa75",
      queue_id: "5a200f64aa4cb20006161700",
      leaderboard_id: "6335bf42bb87d174a4d9bbf8",
    },
    CEU: {
      hub_id: "fd5780d5-dd2f-4479-906c-57b8e41ae9d7",
      queue_id: "5a200f62aa4cb200061616fe",
      leaderboard_id: "6335c033f6d76e5b1c0ae062",
    },
  };
  const [streamers, setStreamers] = useState([]);
  const [queue, setQueue] = useState([]);
  const [matches, setMatches] = useState([]);
  const [ranking, setRanking] = useState({});
  const [entity, setEntity] = useState(
    translateId[getFromStorage("hub_selected")] || translateId.SA
  );

  const handleSelectHub = (hub) => {
    setToStorage("hub_selected", hub);
    setEntity(translateId[hub]);
  };

  const getRanking = () => {
    axios
      .get(
        `/api/rankings/${entity.hub_id}?leaderboard_id=${entity.leaderboard_id}`
      )
      .then((res) => {
        setRanking(res.data.payload);
      });
  };

  const getQueues = () => {
    axios.get(`/api/queue/${entity.queue_id}`).then((res) => {
      setQueue(res.data.payload);
    });
  };

  const getStreamers = () => {
    axios.get(`/api/streamers/${entity.hub_id}`).then((res) => {
      setStreamers(res.data.results);
    });
  };

  const getMatches = () => {
    axios.get(`/api/matches/${entity.hub_id}`).then((res) => {
      setMatches(res.data.payload);
    });
  };

  const verifyStream = (id) => {
    const playerStreaming = streamers.filter((stream) => {
      return stream.profile.id == id;
    });

    return playerStreaming[0];
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
            "https://quoramarketing.com/wp-content/uploads/2022/09/CSGO-All-Maps-in-Competitive-Pool-Active-Duty.jpg",
        };
      return allMaps[0];
    }
    return map;
  };

  const updateStats = () => {
    getMatches();
    getStreamers();
    getQueues();
    getRanking();
  };

  const formatDate = (date) => {
    if(!date) return '';
    var today = new Date(date); // yyyy-mm-dd

    var month = today
      .toLocaleString("default", { month: "short" })
      .replace(".", "");
    month = month.charAt(0).toUpperCase() + month.slice(1);
    var day = today.getDate();
    return month + " " + day;
  };

  const verifyResult = (score1, score2) => {
    if (score1 == score2) {
      return "stat-value text-gray-400 font-semibold text-4xl";
    } else if (score1 > score2) {
      return "stat-value text-green-500 font-semibold text-4xl";
    }

    return "stat-value text-red-500 font-semibold text-4xl";
  };

  useEffect(() => {
    updateStats();
  }, [entity.hub_id, entity.queue_id]);

  return (
    <div className={styles.container}>
      <Head>
        <title>FPL Live Matches</title>
      </Head>
      <main className={styles.main}>
        <div className="select-header flex gap-2">
          <select
            onChange={(e) => handleSelectHub(e.target.value)}
            value={
              getFromStorage("hub_selected") ||
              "ef607668-a51a-4ea6-8b7b-dab07e0ab151"
            }
            className="text-4xl font-play font-bold mb-4 text-center select select-ghost w-fit"
          >
            <option className="text-base font-play font-bold" value="SA">
              FPL CSGO South America
            </option>
            <option className="text-base font-play font-bold" value="CSA">
              FPL C CSGO South America
            </option>
            <option className="text-base font-play font-bold" value="EU">
              FPL CSGO Europe
            </option>
            <option className="text-base font-play font-bold" value="CEU">
              FPL C CSGO Europe
            </option>
            <option className="text-base font-play font-bold" value="NA">
              FPL CSGO North America
            </option>
            <option className="text-base font-play font-bold" value="CNA">
              FPL C CSGO North America
            </option>
          </select>
          <label htmlFor="my-modal" className="ranking-mobile btn modal-button">
            SEE RANKING
          </label>
        </div>
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="badge badge-accent font-bold font-play bg-orange-600 border-orange-600">
            {matches.length} LIVE MATCH{matches.length != 1 ? "ES" : ""}
          </div>
          <div className="dropdown dropdown-hover dropdown-center">
            <label
              tabIndex="0"
              className="badge font-bold font-play badge-primary mb-2"
            >
              {queue.length} PLAYERS ON QUEUE
            </label>
            <ul
              tabIndex="0"
              className="dropdown-content menu text-center p-2 shadow bg-base-100 rounded-box w-full"
            >
              {queue.map((player) => {
                return (
                  <li key={player.nickname}>
                    <a
                      href={`https://www.faceit.com/pt/players/${player.nickname}`}
                      target="blank"
                      className="p-2 font-red-hat font-semibold text-gray-300"
                    >
                      {player.nickname}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="content w-full grid gap-4 grid-cols-8">
          <div className="ranking max-w-fit col-start-1 col-end-3">
            <div className="text-2xl font-play font-bold mb-4 w-fit">
              Ranking{" "}
              <span className="ml-4 stat-desc text-lg font-medium">{` ${formatDate(
                ranking.leaderboard?.start_date
              )} - ${formatDate(ranking.leaderboard?.end_date)}`}</span>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.rankings?.slice(0, 10).map((player) => {
                    return (
                      <tr key={player.position}>
                        <td>{player.position}</td>
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div
                                className={
                                  verifyStream(player.placement.entity_id)
                                    ? "mask mask-squircle w-8 h-8 rounded-full border-purple-500 border-2"
                                    : "mask mask-squircle w-8 h-8 rounded-full"
                                }
                              >
                                <img
                                  src={player.placement.entity_avatar}
                                  alt="Player image"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium font-play text-sm">
                                {player.placement.entity_name}
                              </div>
                              {verifyStream(player.placement.entity_id) ? (
                                <a
                                  className="flex items-center"
                                  target="blank"
                                  href={
                                    verifyStream(player.placement.entity_id)
                                      .stream.channel_url
                                  }
                                >
                                  <span className="flex gap-2 font-medium text-purple-500 hover:font-bold">
                                    {
                                      verifyStream(player.placement.entity_id)
                                        .stream.channel_name
                                    }
                                    <div className="mb-auto gap-1 text-red-500 font-medium flex items-center">
                                      <span className="text-red-500 text-base font-bold material-symbols-outlined">
                                        person
                                      </span>
                                      {
                                        verifyStream(player.placement.entity_id)
                                          .stream.viewers
                                      }
                                    </div>
                                  </span>
                                </a>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </td>
                        <th>
                          {ranking.leaderboard?.prizes[player.position - 1]
                            ?.image_url ? (
                            <img
                              className="h-6 min-w-fit"
                              src={
                                ranking.leaderboard?.prizes[player.position - 1]
                                  ?.image_url
                              }
                            ></img>
                          ) : (
                            <div className="font-normal">
                              <span className="text-orange-600 font-play font-bold mr-2">
                                F
                              </span>
                              {
                                ranking.leaderboard?.prizes[player.position - 1]
                                  ?.faceit_points
                              }
                            </div>
                          )}
                        </th>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="gap-8 col-start-3 col-end-7 flex flex-col">
            {matches.map((match) => {
              return (
                <div
                  key={match.id}
                  className="card rounded-lg max-w-4xl bg-card"
                >
                  <div className="card-bg flex absolute w-full h-full">
                    <figure>
                      <img
                        src={match.teams.faction1.avatar}
                        alt={match.teams.faction1.name}
                      />
                    </figure>
                    <figure>
                      <img
                        src={match.teams.faction2.avatar}
                        alt={match.teams.faction2.name}
                      />
                    </figure>
                  </div>
                  <div className="p-4 px-8 pb-8 card-body">
                    <div className="relative">
                      <div className="scoreboard flex justify-center mb-4 w-full gap-8">
                        <h2 className="w-1/2 mr-auto flex items-center font-red-hat text-2xl gap-2 text-white font-medium min-w-fit">
                          {match.teams.faction1.name}
                        </h2>
                        <div className="score flex gap-2 pt-1 pb-2 px-4 rounded-lg font-semibold text-3xl align-middle">
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
                          :
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
                      <div className="w-full h-fit flex justify-center">
                        <div className="map-card h-fit p-1 rounded-lg flex items-center justify-center w-52 image-full">
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
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col gap-4">
                        {match.teams.faction1.roster.map((player) => {
                          return (
                            <div
                              key={player.id}
                              className="flex h-10 gap-2 items-center"
                            >
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
                                    href={
                                      verifyStream(player.id).stream.channel_url
                                    }
                                  >
                                    <span className="flex gap-2 font-medium text-purple-500 hover:font-bold">
                                      {
                                        verifyStream(player.id).stream
                                          .channel_name
                                      }
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
                                    href={
                                      verifyStream(player.id).stream.channel_url
                                    }
                                  >
                                    <span className="flex gap-2 font-medium text-purple-500 hover:font-bold">
                                      <div className="mb-auto gap-1 text-red-500 font-medium flex items-center">
                                        {verifyStream(player.id).stream.viewers}
                                        <span className="text-red-500 text-base font-bold material-symbols-outlined">
                                          person
                                        </span>
                                      </div>
                                      {
                                        verifyStream(player.id).stream
                                          .channel_name
                                      }
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <input type="checkbox" id="my-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box bg-main relative">
            <label
              htmlFor="my-modal"
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>
            <div>
              <div className="text-2xl font-play font-bold mb-4 w-fit">
                Ranking{" "}
                <span className="ml-4 stat-desc text-lg font-medium">{` ${formatDate(
                  ranking.leaderboard?.start_date
                )} - ${formatDate(ranking.leaderboard?.end_date)}`}</span>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.rankings?.slice(0, 10).map((player) => {
                      return (
                        <tr key={player.position}>
                          <td>{player.position}</td>
                          <td>
                            <div className="flex items-center space-x-3">
                              <div className="avatar">
                                <div
                                  className={
                                    verifyStream(player.placement.entity_id)
                                      ? "mask mask-squircle w-8 h-8 rounded-full border-purple-500 border-2"
                                      : "mask mask-squircle w-8 h-8 rounded-full"
                                  }
                                >
                                  <img
                                    src={player.placement.entity_avatar}
                                    alt="Player image"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-medium font-play text-sm">
                                  {player.placement.entity_name}
                                </div>
                                {verifyStream(player.placement.entity_id) ? (
                                  <a
                                    className="flex items-center"
                                    target="blank"
                                    href={
                                      verifyStream(player.placement.entity_id)
                                        .stream.channel_url
                                    }
                                  >
                                    <span className="flex gap-2 font-medium text-purple-500 hover:font-bold">
                                      {
                                        verifyStream(player.placement.entity_id)
                                          .stream.channel_name
                                      }
                                      <div className="mb-auto gap-1 text-red-500 font-medium flex items-center">
                                        <span className="text-red-500 text-base font-bold material-symbols-outlined">
                                          person
                                        </span>
                                        {
                                          verifyStream(
                                            player.placement.entity_id
                                          ).stream.viewers
                                        }
                                      </div>
                                    </span>
                                  </a>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </td>
                          <th>
                            {ranking.leaderboard?.prizes[player.position - 1]
                              ?.image_url ? (
                              <img
                                className="h-6 min-w-fit"
                                src={
                                  ranking.leaderboard?.prizes[
                                    player.position - 1
                                  ]?.image_url
                                }
                              ></img>
                            ) : (
                              <div className="font-normal">
                                <span className="text-orange-600 font-play font-bold mr-2">
                                  F
                                </span>
                                {
                                  ranking.leaderboard?.prizes[
                                    player.position - 1
                                  ]?.faceit_points
                                }
                              </div>
                            )}
                          </th>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-action">
              <label htmlFor="my-modal" className="btn">
                CLOSE
              </label>
            </div>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          className="font-base max-w-fit"
          href="https://github.com/Conrage"
          target="blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className="ml-1 font-semibold text-blue-500">Crazynn</span>
        </a>
        <a
          target="blank"
          className="font-base p-2 max-w-fit h-fit rounded-lg bg-white"
          href="https://github.com/Conrage/watch-fpl"
        >
          <img className="h-6" src="/github.png"></img>
        </a>
      </footer>
    </div>
  );
}
