// api url = 'https://sdg-astro-api.herokuapp.com/api/'
let copyrightText = ''
let launchIndex = 0
let launchArray = []
let interval

class Launch {
  constructor(launchInfo) {
    this.launchName = launchInfo.mission_name
    if (launchInfo.details == null) {
      this.launchDescription = 'No description available yet.'
    } else {
      this.launchDescription = launchInfo.details
    }
    this.launchTime = launchInfo.launch_date_utc
    this.launchLocation = launchInfo.launch_site.site_name_long
  }
}

const main = () => {
  getBackground()
  getLaunches()
}

const getBackground = () => {
  fetch('https://sdg-astro-api.herokuapp.com/api/Nasa/apod')
    .then(resp => {
      return resp.json()
    })
    .then(potd => {
      document.getElementById('nasaimg').style.backgroundImage = `url(${
        potd.hdUrl
      })`
      if (potd.copyright == null) {
        copyrightText = 'no copyright'
      } else {
        copyrightText = potd.copyright
      }
      document.querySelector('.copytitle-text').textContent =
        'copyright: ' + copyrightText + ' | title: ' + potd.title
    })
}

const getLaunches = () => {
  fetch('https://sdg-astro-api.herokuapp.com/api/SpaceX/launches/upcoming')
    .then(resp => {
      return resp.json()
    })
    .then(launches => {
      for (let i = 0; i < launches.length; i++) {
        launchArray.push(new Launch(launches[i]))
      }
      render(launchIndex)
    })
}

const navigate = direction => {
  if (direction === 'right') {
    if (launchIndex === launchArray.length - 1) {
      launchIndex = 0
    } else {
      launchIndex++
    }
  } else if (direction === 'left') {
    if (launchIndex === 0) {
      launchIndex = launchArray.length - 1
    } else {
      launchIndex--
    }
  }
  render(launchIndex)
}

const render = index => {
  const parent = document.querySelector('.launch-data')
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
  const nameElement = document.createElement('span')
  nameElement.classList.add('launch-element')
  nameElement.classList.add('name-element')
  parent.appendChild(nameElement)

  const nameLogo = document.createElement('i')
  nameLogo.classList.add('fas')
  nameLogo.classList.add('fa-space-shuttle')
  nameElement.appendChild(nameLogo)

  const nameText = document.createElement('h3')
  nameText.classList.add('launch-name')
  nameText.textContent = launchArray[index].launchName
  nameElement.appendChild(nameText)

  const descriptionElement = document.createElement('span')
  descriptionElement.classList.add('launch-element')
  descriptionElement.classList.add('description-element')
  parent.appendChild(descriptionElement)

  const descriptionLogo = document.createElement('i')
  descriptionLogo.classList.add('fas')
  descriptionLogo.classList.add('fa-info-circle')
  descriptionElement.appendChild(descriptionLogo)

  const descriptionText = document.createElement('p')
  descriptionText.classList.add('launch-description')
  descriptionText.textContent = launchArray[index].launchDescription
  descriptionElement.appendChild(descriptionText)
  
  const timeElement = document.createElement('span')
  timeElement.classList.add('launch-element')
  timeElement.classList.add('time-element')
  parent.appendChild(timeElement)

  clearInterval(interval)
  interval = setInterval(() => {
    countdown(index)
  }, 1000)

  
  const locationElement = document.createElement('span')
  locationElement.classList.add('launch-element')
  locationElement.classList.add('location-element')
  parent.appendChild(locationElement)

  const locationLogo = document.createElement('i')
  locationLogo.classList.add('fas')
  locationLogo.classList.add('fa-map-marked-alt')
  locationElement.appendChild(locationLogo)

  const locationText = document.createElement('p')
  locationText.classList.add('launch-location')
  locationText.textContent = launchArray[index].launchLocation
  locationElement.appendChild(locationText)
}

countdown = index => {
  let launchTimeFormatted = new Date(launchArray[index].launchTime).getTime()
  let now = new Date().getTime()
  let distance = launchTimeFormatted - now
  let days = Math.floor(distance / (1000 * 60 * 60 * 24))
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = Math.floor((distance % (1000 * 60)) / 1000)
  let countdownString =
    days +
    ' days, ' +
    hours +
    ' hours, ' +
    minutes +
    ' mins, ' +
    seconds +
    ' seconds'

  const timeText = document.createElement('p')
  timeText.classList.add('launch-time')
  let timeParent = document.getElementsByClassName('time-element')[0]

  while (timeParent.firstChild) {
    timeParent.removeChild(timeParent.firstChild)
  }

  const timeLogo = document.createElement('i')
  timeLogo.classList.add('fas')
  timeLogo.classList.add('fa-clock')
  timeParent.appendChild(timeLogo)
  timeParent.appendChild(timeText)

  if (distance < 0) {
    timeText.textContent = 'Launched'
  } else {
    timeText.textContent = countdownString
  }
}

document
  .querySelector('.left-arrow')
  .addEventListener('click', () => navigate('left'))
document
  .querySelector('.right-arrow')
  .addEventListener('click', () => navigate('right'))
document.addEventListener('DOMContentLoaded', main)