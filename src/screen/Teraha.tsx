import React from "react";
import TerahaInfo from "./Teraha.json";
import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// interfaces
interface terahaState {
  series: number;
  part: number;
  episode: number;
  searchWord: string;
}

// main component
class Teraha extends React.Component<{}, terahaState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      series: 1,
      part: 1,
      episode: 1,
      searchWord: "テラスハウス",
    };

    this.generateTwitterLink = this.generateTwitterLink.bind(this);
    this.addDays = this.addDays.bind(this);
    this.handleSeriesChange = this.handleSeriesChange.bind(this);
    this.handlePartChange = this.handlePartChange.bind(this);
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
    untilDays: number = 3
  ): string {
    try {
      console.log(
        `generateTwitterLink, series ${series}, part ${part}, episode ${episode}`
      );
      const episodeInfo =
        TerahaInfo[series - 1].parts[part - 1].episodes[episode - 1];
      if (episodeInfo) {
        const since = episodeInfo.netflixDate;
        const untilDate = this.addDays(since, untilDays);
        const until = untilDate.toISOString().slice(0, 10);
        return `https://twitter.com/search?q=${searchWord}%20until%3A${until}%20since%3A${since}`;
      }
      return "https://twitter.com/home";
    } catch (e) {
      console.error(e);
      return "https://twitter.com/home";
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

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const series = parseInt(formData.get("series") as string);
    const part = parseInt(formData.get("part") as string);
    const episode = parseInt(formData.get("episode") as string);
    const searchWord = formData.get("searchWord") as string;
    if (series && part && episode) {
      this.setState({
        series: series,
        part: part,
        episode: episode,
      });
    }
    console.log(
      `series ${formData.get("series")}, part ${formData.get(
        "part"
      )}, episode ${formData.get("episode")}`
    );
    const twitterLink = this.generateTwitterLink(
      series,
      part,
      episode,
      searchWord
    );
    window.open(twitterLink, "_blank", "noopener,noreferrer");
    console.log(e);
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
        <Box>Netflix配信直後のTwitterの様子を確認できます。</Box>
        <Box mb={2}>
          現在は東京編以降(2015.09~2019.10)をサポートしています。
        </Box>
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
              >
                {jsxEpisodes}
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <FormControl>
              <TextField
                type="text"
                name="searchWord"
                id="searchWord"
                defaultValue={this.state.searchWord}
                variant="outlined"
              />
            </FormControl>
          </Box>
          <Box mb={2}>
            <div>
              <Button type="submit">👉Twitterへのリンク👈</Button>
            </div>
          </Box>
        </form>
      </div>
    );
  }
}

export default Teraha;
