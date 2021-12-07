import React from 'react'
import moment from 'moment'
import axios from 'axios'
import './App.less'

export default class App extends React.Component {
  state = {
    interval: null,
    countdown: null
  }

  getEventTime = async () => {
    // const res = await axios.get('http://dl.ragestudio.net/mem/rel.json')
  }

  componentDidMount = async () => {
    const eventTime = moment("2021-12-31 18:00:00", "YYYY-MM-DD HH:mm:ss")
    const currentTime = moment()

    let duration = moment.duration(eventTime.diff(currentTime))

    const interval = setInterval(() => {
      duration = moment.duration(duration - 1000, 'milliseconds')

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

  render() {
    if (!this.state.countdown) {
      return <div>
        Loading
      </div>
    }

    const countdown = this.state.countdown

    const days = countdown.days()
    const hours = countdown.hours()
    const minutes = countdown.minutes()
    const seconds = countdown.seconds()

    return (
      <div className="App">
        <div className="countdown">
          {this.renderCountdown({ days, hours, minutes, seconds })}
        </div>
      </div>
    )
  }
}