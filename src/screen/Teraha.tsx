import React from "react";
import TerahaInfo from "./Teraha.json";
import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// bad variables
const WRONG_TWITTER_LINK = "https://twitter.com/home";
const WRONG_DATE_STRING = "1900-01-01";

// interfaces
interface terahaState {
  series: number;
  part: number;
  episode: number;
  searchWord: string;
  broadcastType: "Netflix" | "TV";
}

// main component
class Teraha extends React.Component<{}, terahaState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      series: 1,
      part: 1,
      episode: 1,
      searchWord: "テラハ",
      broadcastType: "Netflix",
    };

    this.generateTwitterLink = this.generateTwitterLink.bind(this);
    this.generateSearchWord = this.generateSearchWord.bind(this);
    this.addDays = this.addDays.bind(this);
    this.calcEpisodeNumber = this.calcEpisodeNumber.bind(this);
    this.handleSeriesChange = this.handleSeriesChange.bind(this);
    this.handlePartChange = this.handlePartChange.bind(this);
    this.handleEpisodeChange = this.handleEpisodeChange.bind(this);
    this.handleSearchWordChange = this.handleSearchWordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  addDays(date: string, days: number): Date {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  generateTwitterLink(
    series: number,
    part: number,
    episode: number,
    searchWord: string,
    broadcastType: "Netflix" | "TV",
    untilDays: number = 3
  ): string {
    try {
      const episodeInfo =
        TerahaInfo[series - 1].parts[part - 1].episodes[episode - 1];
      if (episodeInfo) {
        const since =
          broadcastType === "Netflix"
            ? episodeInfo.netflixDate
            : episodeInfo.tvDate;
        if (since === WRONG_DATE_STRING) {
          return WRONG_TWITTER_LINK;
        }
        const untilDate = this.addDays(since, untilDays);
        const until = untilDate.toISOString().slice(0, 10);
        return `https://twitter.com/search?q=${searchWord}%20until%3A${until}%20since%3A${since}`;
      }
      return WRONG_TWITTER_LINK;
    } catch (e) {
      console.error(e);
      return WRONG_TWITTER_LINK;
    }
  }

  calcEpisodeNumber(): number {
    const season = TerahaInfo[this.state.series - 1];
    const parts = season.parts;
    if (!parts) {
      return -1;
    }
    const episodes = [];
    for (let i = 0; i < this.state.part - 1; i++) {
      for (const episode of parts[i].episodes) {
        episodes.push(episode);
      }
    }
    return episodes.length + this.state.episode;
  }

  generateSearchWord() {
    // get members
    const members = TerahaInfo[this.state.series - 1].members;
    const events = TerahaInfo[this.state.series - 1].events;
    const epNum = this.calcEpisodeNumber();
    const randomSearchWords = [];

    if (members) {
      const appearingMembers = members.filter((member) => {
        return member.startEp <= epNum && member.endEp >= epNum;
      });

      const nicknames: string[] = [];
      for (const m of appearingMembers) {
        for (const nn of m.nicknames) {
          nicknames.push(nn);
        }
      }

      randomSearchWords.push(...nicknames);
    }

    if (events) {
      const happeningEvents = events.filter((event) => {
        return event.startEp <= epNum && event.endEp >= epNum;
      });

      const happeningEventNames: string[] = [];
      for (const event of happeningEvents) {
        happeningEventNames.push(event.name);
      }

      randomSearchWords.push(...happeningEventNames);
    }

    const randomSearchWord =
      randomSearchWords[Math.floor(Math.random() * randomSearchWords.length)];

    if (randomSearchWord) {
      this.setState({ searchWord: `テラハ ${randomSearchWord}` });
    } else {
      alert("検索ワードの生成に失敗しました");
    }
  }

  handleSeriesChange(e: React.ChangeEvent<{ value: unknown }>) {
    const tsCopy = JSON.parse(JSON.stringify(this.state));
    tsCopy.series = parseInt(e.target.value as string);
    this.setState(tsCopy);
  }

  handlePartChange(e: React.ChangeEvent<{ value: unknown }>) {
    const tsCopy = JSON.parse(JSON.stringify(this.state));
    tsCopy.part = parseInt(e.target.value as string);
    this.setState(tsCopy);
  }

  handleEpisodeChange(e: React.ChangeEvent<{ value: unknown }>) {
    const tsCopy = JSON.parse(JSON.stringify(this.state));
    tsCopy.episode = parseInt(e.target.value as string);
    this.setState(tsCopy);
  }

  handleSearchWordChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ searchWord: e.target.value });
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const series = parseInt(formData.get("series") as string);
    const part = parseInt(formData.get("part") as string);
    const episode = parseInt(formData.get("episode") as string);
    const searchWord = formData.get("searchWord") as string;
    const broadcastType = formData.get("broadcastType") as "Netflix" | "TV";
    if (series && part && episode) {
      this.setState({
        series: series,
        part: part,
        episode: episode,
      });
    }
    const twitterLink = this.generateTwitterLink(
      series,
      part,
      episode,
      searchWord,
      broadcastType
    );

    if (twitterLink === WRONG_TWITTER_LINK) {
      alert(
        "リンクの作成に失敗しました。\nNetflixは東京編以降(2015.09~2019.10)をサポートしています。\nTVは東京(2015-2016)のパート1,エピソード1～軽井沢(2017-2018)のパート3,エピソード6までをサポートしています。"
      );
    } else {
      window.open(twitterLink, "_blank", "noopener,noreferrer");
      console.error(e);
    }
  }

  render() {
    const jsxParts: JSX.Element[] = [];
    const seriesInfo = TerahaInfo[this.state.series - 1];
    for (let i = 1; i <= seriesInfo.parts.length; i++) {
      jsxParts.push(
        <MenuItem value={i} key={i}>
          Part {i}
        </MenuItem>
      );
    }

    const jsxEpisodes: JSX.Element[] = [];
    const partInfo = seriesInfo.parts[this.state.part - 1];
    if (partInfo) {
      for (let i = 1; i <= partInfo.episodes.length; i++) {
        jsxEpisodes.push(
          <MenuItem value={i} key={i}>
            Episode {i}: {partInfo.episodes[i - 1].title}
          </MenuItem>
        );
      }
    }

    return (
      <div>
        <h1>テラハ配信直後のTwitter</h1>
        <form onSubmit={this.handleSubmit}>
          <Box mb={2} color="text.primary">
            <FormControl>
              {/* Choose Series */}
              <InputLabel>シリーズ</InputLabel>
              <Select
                name="series"
                id="series"
                defaultValue={this.state.series}
                onChange={this.handleSeriesChange}
              >
                <MenuItem value="1">
                  BOYS×GIRLS NEXT DOOR (2012–2014, 湘南)
                </MenuItem>
                <MenuItem value="2">
                  BOYS & GIRLS IN THE CITY (2015-2016, 東京)
                </MenuItem>
                <MenuItem value="3">ALOHA STATE (2016-2017, ハワイ)</MenuItem>
                <MenuItem value="4">
                  OPENING NEW DOORS (2017-2018, 軽井沢)
                </MenuItem>
                <MenuItem value="5">TOKYO (2019-2020, 東京)</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <FormControl>
              {/* Choose Part */}
              <InputLabel>パート</InputLabel>
              <Select
                name="part"
                id="part"
                defaultValue={this.state.part}
                onChange={this.handlePartChange}
              >
                {jsxParts}
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <FormControl>
              {/* Choose Episode */}
              <InputLabel>エピソード</InputLabel>
              <Select
                name="episode"
                id="episode"
                defaultValue={this.state.episode}
                onChange={this.handleEpisodeChange}
              >
                {jsxEpisodes}
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <FormControl>
              {/* Choose Broadcast type */}
              <InputLabel>放送</InputLabel>
              <Select
                name="broadcastType"
                id="broadcastType"
                defaultValue={this.state.broadcastType}
              >
                <MenuItem value="Netflix">Netflix</MenuItem>
                <MenuItem value="TV">TV</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mb={5}>
            <FormControl>
              <TextField
                type="text"
                name="searchWord"
                id="searchWord"
                value={this.state.searchWord}
                onChange={this.handleSearchWordChange}
                variant="outlined"
              />
              <Button variant="outlined" onClick={this.generateSearchWord}>
                ランダムキーワード
              </Button>
            </FormControl>
          </Box>
          <Box mb={5}>
            <div>
              <Button type="submit" variant="outlined">
                👉Twitterへのリンク👈
              </Button>
            </div>
          </Box>
        </form>
        <Box fontSize={15}>
          Netflixは東京編以降(2015.09~2019.10)をサポートしています。
        </Box>
        <Box fontSize={15} mb={2}>
          TVは東京(2015-2016)のパート1,エピソード1～軽井沢(2017-2018)のパート3,
          エピソード6までをサポートしています。
        </Box>
      </div>
    );
  }
}

export default Teraha;
