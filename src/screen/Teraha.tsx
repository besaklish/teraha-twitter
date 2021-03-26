import React from 'react';
import TerahaInfo from "./Teraha.json";

// interfaces
interface terahaState{
  series: number,
  part: number,
  episode: number,
  searchWord: string,
};

// main component
class Teraha extends React.Component<{}, terahaState>{
  constructor(props: {}){
    super(props);
    this.state = {
      series: 1,
      part: 1,
      episode: 1,
      searchWord: "テラハ"
    };

    this.generateTwitterLink = this.generateTwitterLink.bind(this);
    this.addDays = this.addDays.bind(this);
    this.handleSeriesChange = this.handleSeriesChange.bind(this);
    this.handlePartChange = this.handlePartChange.bind(this);
    this.handleEpisodeChange = this.handleEpisodeChange.bind(this);
    this.handleSearchWordChange = this.handleSearchWordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  addDays(date: string, days: number): Date{
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  generateTwitterLink(series: number, part: number, episode: number, searchWord: string, untilDays: number = 3): string {
    try{
      console.log(`generateTwitterLink, series ${series}, part ${part}, episode ${episode}`);
      const episodeInfo = TerahaInfo[series - 1].parts[part - 1].episodes[episode - 1];
      if (episodeInfo) {
        const since = episodeInfo.date;
        const untilDate = this.addDays(since, untilDays);
        const until = untilDate.toISOString().slice(0, 10);
        return `https://twitter.com/search?q=${searchWord}%20until%3A${until}%20since%3A${since}`;
      }
      return "https://twitter.com/home";
    } catch(e){
      console.error(e);
      return "https://twitter.com/home";
    }
  }

  handleSeriesChange(e: React.ChangeEvent<HTMLSelectElement>){
    const tsCopy = JSON.parse(JSON.stringify(this.state));
    tsCopy.series = parseInt(e.target.value);
    this.setState(tsCopy);
  }

  handlePartChange(e: React.ChangeEvent<HTMLSelectElement>){
    const tsCopy = JSON.parse(JSON.stringify(this.state));
    tsCopy.part = parseInt(e.target.value);
    this.setState(tsCopy);
  }

  handleEpisodeChange(e: React.ChangeEvent<HTMLSelectElement>){
    const tsCopy = JSON.parse(JSON.stringify(this.state));
    tsCopy.episode = parseInt(e.target.value);
    this.setState(tsCopy);
  }

  handleSearchWordChange(e: React.ChangeEvent<HTMLInputElement>){
    const tsCopy = JSON.parse(JSON.stringify(this.state));
    tsCopy.searchWord = e.target.value;
    this.setState(tsCopy);
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const series = parseInt(formData.get("series") as string);
    const part = parseInt(formData.get("part") as string);
    const episode = parseInt(formData.get("episode") as string);
    const searchWord = formData.get("searchWord") as string;
    if (series && part && episode){
      this.setState({
        series: series,
        part: part,
        episode: episode
      })
    }
    console.log(`series ${formData.get("series")}, part ${formData.get("part")}, episode ${formData.get("episode")}`)
    const twitterLink = this.generateTwitterLink(series, part, episode, searchWord);
    window.open(twitterLink, "_blank", "noopener,noreferrer");
    console.log(e);
  }

  render(){
    const jsxParts: JSX.Element[] = [];
    const seriesInfo = TerahaInfo[this.state.series - 1];
    for (let i = 1; i <= seriesInfo.parts.length; i++) {
      jsxParts.push(<option value={i} key={i}>Part {i}</option>)
    }
  
    const jsxEpisodes: JSX.Element[] = [];
    const partInfo = seriesInfo.parts[this.state.part - 1];
    if (partInfo){
      for (let i = 1; i <= partInfo.episodes.length; i++) {
        jsxEpisodes.push(<option value={i} key={i}>Episode {i}: {partInfo.episodes[i - 1].title}</option>)
      }
    }

    return (
      <div>
        <h1>テラハ放送直後のTwitter</h1>
        <form onSubmit={this.handleSubmit}>
          {/* Choose Series */}
          <select name="series" id="series" defaultValue={this.state.series} onChange={this.handleSeriesChange}>
            <option value="1">BOYS×GIRLS NEXT DOOR (2012–2014, 湘南)</option>
            <option value="2">BOYS & GIRLS IN THE CITY (2015-2016, 東京)</option>
            <option value="3">ALOHA STATE (2016-2017, ハワイ)</option>
            <option value="4">OPENING NEW DOORS (2017-2018, 軽井沢)</option>
            <option value="5">TOKYO (2019-2020, 東京)</option>
          </select>
          {/* Choose Part */}
          <select name="part" id="part" defaultValue={this.state.part} onChange={this.handlePartChange}>
            {jsxParts}
          </select>
          {/* Choose Episode */}
          <select name="episode" id="episode" defaultValue={this.state.episode} onChange={this.handleEpisodeChange}>
            {jsxEpisodes}
          </select>
          <input type="text" name="searchWord" id="searchWord" defaultValue={this.state.searchWord} onChange={this.handleSearchWordChange}/>
          <button type="submit">Twitterへのリンク</button>
        </form>
      </div>
    )
  }

}

export default Teraha;
