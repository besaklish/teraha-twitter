import React, { useState } from 'react';
import TerahaInfo from "./Teraha.json";


function addDays(date: string, days: number): Date {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const generateTwitterLink = (series: number, part: number, episode: number, searchWord: string, untilDays: number = 3): string => {
  try{
    console.log(`generateTwitterLink, series ${series}, part ${part}, episode ${episode}`);
    const episodeInfo = TerahaInfo[series - 1].parts[part - 1].episodes[episode - 1];
    if (episodeInfo) {
      const since = episodeInfo.date;
      const untilDate = addDays(since, untilDays);
      const until = untilDate.toISOString().slice(0, 10);
      return `https://twitter.com/search?q=${searchWord}%20until%3A${until}%20since%3A${since}`;
    }
    return "https://twitter.com/home";
  } catch(e){
    console.error(e);
    return "https://twitter.com/home";
  }
}

const Teraha = () => {
  const [terahaState, setTerahaState] = useState({
    series: 1,
    part: 1,
    episode: 1,
    searchWord: "テラハ",
    twitterLink: generateTwitterLink(1, 1, 1, "テラハ")
  });

  const jsxParts: JSX.Element[] = [];

  const seriesInfo = TerahaInfo[terahaState.series - 1];
  for (let i = 1; i <= seriesInfo.parts.length; i++) {
    jsxParts.push(<option value={i} key={i}>Part {i}</option>)
  }

  const jsxEpisodes: JSX.Element[] = [];
  const partInfo = seriesInfo.parts[terahaState.part - 1];
  if (partInfo){
    for (let i = 1; i <= partInfo.episodes.length; i++) {
      jsxEpisodes.push(<option value={i} key={i}>Episode {i}: {partInfo.episodes[i - 1].title}</option>)
    }
  }

  return (
    <div>
      <h1>テラハ放送直後のTwitter</h1>
      <form action="">
        {/* Choose Series */}
        <select name="series" id="series" defaultValue={terahaState.series} onChange={ (e) =>{
          setTerahaState(() => {
            const tsCopy = JSON.parse(JSON.stringify(terahaState));
            tsCopy.series = parseInt(e.target.value);
            tsCopy.twitterLink = generateTwitterLink(tsCopy.series, tsCopy.part, tsCopy.episode, tsCopy.searchWord);
            console.log(tsCopy);
            return tsCopy;
          });
        }}>
          <option value="1">BOYS×GIRLS NEXT DOOR (2012–2014, 湘南)</option>
          <option value="2">BOYS & GIRLS IN THE CITY (2015-2016, 東京)</option>
          <option value="3">ALOHA STATE (2016-2017, ハワイ)</option>
          <option value="4">OPENING NEW DOORS (2017-2018, 軽井沢)</option>
          <option value="5">TOKYO (2019-2020, 東京)</option>
        </select>
        {/* Choose Part */}
        <select name="part" id="part" defaultValue={terahaState.part} onChange={ (e) =>{
          setTerahaState(() => {
            const tsCopy = JSON.parse(JSON.stringify(terahaState));
            tsCopy.part = parseInt(e.target.value);
            tsCopy.twitterLink = generateTwitterLink(tsCopy.series, tsCopy.part, tsCopy.episode, tsCopy.searchWord);
            return tsCopy;
          });        
          }}>
          {jsxParts}
        </select>
        {/* Choose Episode */}
        <select name="episode" id="episode" defaultValue={terahaState.episode} onChange={(e) =>{
          setTerahaState(() => {
            const tsCopy = JSON.parse(JSON.stringify(terahaState));
            tsCopy.episode = parseInt(e.target.value);
            tsCopy.twitterLink = generateTwitterLink(tsCopy.series, tsCopy.part, tsCopy.episode, tsCopy.searchWord);
            return tsCopy;
          });       
          }}>
          {jsxEpisodes}
        </select>
        <input type="text" name="searchWord" id="searchWord" defaultValue={terahaState.searchWord} onChange={(e) =>{
          setTerahaState(() => {
            const tsCopy = JSON.parse(JSON.stringify(terahaState));
            tsCopy.searchWord = e.target.value;
            tsCopy.twitterLink = generateTwitterLink(tsCopy.series, tsCopy.part, tsCopy.episode, tsCopy.searchWord);
            return tsCopy;
          });
        }}/>
      </form>
      <div>
        <a href={terahaState.twitterLink} target="_blank" rel="noopener noreferrer"><h2>Twitterへのリンク</h2></a>
      </div>
    </div>
  )
}

export default Teraha;
