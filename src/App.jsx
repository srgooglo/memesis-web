import React from "react"
import moment from "moment"
import * as antd from "antd"
import * as Icons from "feather-reactjs"
import Plyr from "plyr-react"
import ReactPlayer from "react-player"

import "plyr-react/dist/plyr.css"
import "./App.less"

const TrailerVideoSrc = {
  type: "video",
  sources: [
    {
      src: "https://dl.ragestudio.net/mem/trailer.mp4",
      type: "video/mp4",
    },
  ],
}

const TrailerVideoOptions = {
  storage: false,
  autoplay: true,
  hideControls: true,
  muted: true,
  controls: [],
}

const TrailerViewer = (props) => {
  const [configured, setConfigured] = React.useState(false)
  const [videoMuted, setVideoMuted] = React.useState(true)

  const ref = React.useRef()

  const onEnd = () => {
    if (typeof props.onEnd === "function") {
      return props.onEnd()
    } else {
      console.warn("onEnd is not a function")
    }
  }

  const onSkip = () => {
    if (typeof props.onSkip === "function") {
      return props.onSkip()
    } else {
      console.warn("onSkip is not a function")
    }
  }

  const toogleVideoMute = (to = !videoMuted) => {
    if (ref.current.plyr) {
      ref.current.plyr.muted = to
      setVideoMuted(to)
    }
  }

  React.useEffect(() => {
    if (ref.current.plyr.on && !configured) {
      console.debug("Effect")
      ref.current.plyr.on("ended", () => {
        onEnd()
      })
      ref.current.plyr.once("ended", () => {
        onEnd()
      })
      ref.current.plyr.on("play", () => {
        console.debug("PLAYING")
      })
      ref.current.plyr.on("ready", () => {
        ref.current.plyr.play()
      })

      setConfigured(true)
    }

    return
  })

  return <div className="player">
    <div className="overlay">
      <div className="videoControls">
        <div>
          <antd.Button type="link" onClick={() => onSkip()}>Skip</antd.Button>
        </div>
        <div>
          <antd.Button type={videoMuted ? "primary" : "link"} onClick={() => toogleVideoMute()}>{videoMuted ? <Icons.Volume2 /> : <Icons.VolumeX />}</antd.Button>
        </div>
      </div>
    </div>
    <Plyr ref={ref} source={TrailerVideoSrc} options={TrailerVideoOptions} />
  </div>
}

export default class App extends React.Component {
  state = {
    trailerViewed: false,
    interval: null,
    reached: false,
    countdown: null
  }

  componentDidMount = async () => {
    const eventTime = moment("2021-12-31 18:00:00", "YYYY-MM-DD HH:mm:ss")
    const currentTime = moment()

    let duration = moment.duration(eventTime.diff(currentTime))

    const interval = setInterval(() => {
      duration = moment.duration(duration - 1000, "milliseconds")
      const isReached = Math.sign(duration._milliseconds) === -1

      if (isReached) {
        clearInterval(interval)
        return this.setState({
          countdown: true,
          reached: true,
        })
      }

      this.setState({ countdown: duration })
    }, 1000)

    this.setState({
      interval
    })
  }

  componentWillUnmount = () => {
    if (this.state.interval) {
      clearInterval(this.state.interval)
      this.setState({ interval: null })
    }
  }

  renderCountdown = (countdown) => {
    return Object.keys(countdown).map(key => {
      return <div key={key} id={key} className="entry">
        <div className="value">
          {countdown[key]}
        </div>
        <div className="value">
          {countdown[key]}
        </div>
        <div className="value">
          {countdown[key]}
        </div>
        <div className="text">
          {key}
        </div>
        <div className="text">
          {key}
        </div>
        <div className="text">
          {key}
        </div>
      </div>
    })
  }

  toogleTrailerViewed = (to) => {
    this.setState({ trailerViewed: to ?? !this.state.trailerViewed })
    this.forceUpdate()
  }

  onEndTrailer = () => {
    console.debug("onEndTrailer")
    this.toogleTrailerViewed(true)
  }

  onClickDownload = () => {
    const platform = String(navigator.platform).toLowerCase()

    window.open(`https://dl.ragestudio.net/mem/launcher/${platform}/${platform === "win32" ? "setup.exe" : "app"}`, "_blank")
  }

  render() {
    if (!this.state.reached && !this.state.countdown) {
      return null
    }

    if (!this.state.reached && !this.state.trailerViewed) {
      return <TrailerViewer onSkip={() => this.onEndTrailer()} onEnd={() => this.onEndTrailer()} />
    }

    const countdown = this.state.countdown

    return (
      <div className="App">
        <div className="overlayBackground" />
        <div className="content">
          {this.state.reached ? <ReactPlayer url="https://www.twitch.tv/sirgooglo" /> : this.renderCountdown({ days: countdown.days(), hours: countdown.hours(), minutes: countdown.minutes(), seconds: countdown.seconds() })}
        </div>
        <div className="actions">
          <div>
            <antd.Button type="link" onClick={() => this.toogleTrailerViewed(false)}>Watch Trailer</antd.Button>
          </div>
          <div>
            <antd.Button type="link" onClick={() => this.onClickDownload()}>Download Launcher</antd.Button>
          </div>
        </div>
      </div>
    )
  }
}