import React, { useState } from 'react';
import TerahaInfo from "./Teraha.json";


function addDays(date: string, days: number): Date {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const generateTwitterLink = (series: number, part: number, episode: number, searchWord: string, untilDays: number = 3): string => {
  try{
    const episodeInfo = TerahaInfo[series - 1].parts[part - 1].episodes[episode - 1];
    if (episodeInfo) {
      const since = episodeInfo.date;
      const untilDate = addDays(since, untilDays);
      const until = untilDate.toISOString().slice(0, 10);
      return `https://twitter.com/search?q=${searchWord}%20until%3A${until}%20since%3A${since}`;
    }
    return "https://twitter.com/home";
  } catch(e){
    return "https://twitter.com/home";
  }
}

const Teraha = () => {
  const [series, setSeries] = useState(1);
  const [part, setPart] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [searchWord, setSearchWord] = useState("テラハ");
  const [twitterLink, setTwitterLink] = useState("https://twitter.com/home");

  const jsxParts: JSX.Element[] = [];

  const seriesInfo = TerahaInfo[series - 1];
  for (let i = 1; i <= seriesInfo.parts.length; i++) {
    jsxParts.push(<option value={i}>Part {i}</option>)
  }

  const jsxEpisodes: JSX.Element[] = [];
  const partInfo = seriesInfo.parts[part - 1];
  if (partInfo){
    for (let i = 1; i <= partInfo.episodes.length; i++) {
      jsxEpisodes.push(<option value={i}>Episode {i}: {partInfo.episodes[i - 1].title}</option>)
    }
  }

  return (
    <div>
      <h1>テラハ放送直後のTwitter</h1>
      <form action="">
        {/* Choose Series */}
        <select name="series" id="series" defaultValue={series} onChange={(e) =>{
          setSeries(parseInt(e.target.value));
          setTwitterLink(generateTwitterLink(series, part, episode, searchWord));
        }}>
          <option value="1">BOYS×GIRLS NEXT DOOR (2012–2014, 湘南)</option>
          <option value="2">BOYS & GIRLS IN THE CITY (2015-2016, 東京)</option>
          <option value="3">ALOHA STATE (2016-2017, ハワイ)</option>
          <option value="4">OPENING NEW DOORS (2017-2018, 軽井沢)</option>
          <option value="5">TOKYO (2019-2020, 東京)</option>
        </select>
        {/* Choose Part */}
        <select name="part" id="part" defaultValue={part} onChange={(e) =>{
          setPart(parseInt(e.target.value));
          setTwitterLink(generateTwitterLink(series, part, episode, searchWord));
        }}>
          {jsxParts}
        </select>
        {/* Choose Episode */}
        <select name="episode" id="episode" defaultValue={episode} onChange={(e) =>{
          setEpisode(parseInt(e.target.value));
          setTwitterLink(generateTwitterLink(series, part, episode, searchWord));
        }}>
          {jsxEpisodes}
        </select>
        <input type="text" name="searchWord" id="searchWord" defaultValue={searchWord} onChange={(e) =>{
          setSearchWord(e.target.value);
          setTwitterLink(generateTwitterLink(series, part, episode, searchWord));
        }}/>
      </form>
      <div>
        <a href={twitterLink} target="_blank" rel="noopener noreferrer"><h2>Twitterへのリンク</h2></a>
      </div>
    </div>
  )
}

export default Teraha;
