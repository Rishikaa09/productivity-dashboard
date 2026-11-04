function openFeatures() {
    var allElems = document.querySelectorAll('.elem')
    var fullElemPage = document.querySelectorAll('.fullElem')
    var fullElemPageBackBtn = document.querySelectorAll('.fullElem .back')

    allElems.forEach(function (elem) {
        elem.addEventListener('click', function () {
            fullElemPage[elem.id].style.display = 'block'
        })
    })

    fullElemPageBackBtn.forEach(function (back) {
        back.addEventListener('click', function () {
            back.closest('.fullElem').style.display = 'none'
        })
    })
}

openFeatures()


function todoList() {

    var currentTask = []

    if (localStorage.getItem('currentTask')) {
        currentTask = JSON.parse(localStorage.getItem('currentTask'))
    } else {
        console.log('Task list is Empty');
    }



    function renderTask() {

        var allTask = document.querySelector('.allTask')

        var sum = ''

        currentTask.forEach(function (elem, idx) {
            sum = sum + `<div class="task">
        <h5>${elem.task} <span class=${elem.imp}>imp</span></h5>
        <button id=${idx}>Mark as Completed</button>
        </div>`
        })

        allTask.innerHTML = sum

        localStorage.setItem('currentTask', JSON.stringify(currentTask))

        document.querySelectorAll('.task button').forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentTask.splice(Number(btn.id), 1)
                renderTask()
            })
        })
    }
    renderTask()

    let form = document.querySelector('.addTask form')
    let taskInput = document.querySelector('.addTask form #task-input')
    let taskDetailsInput = document.querySelector('.addTask form textarea')
    let taskCheckbox = document.querySelector('.addTask form #check')

    form.addEventListener('submit', function (e) {
        e.preventDefault()
        currentTask.push(
            {
                task: taskInput.value,
                details: taskDetailsInput.value,
                imp: taskCheckbox.checked
            }
        )
        renderTask()

        taskCheckbox.checked = false
        taskInput.value = ''
        taskDetailsInput.value = ''
    })



}

todoList()


function dailyPlanner() {
    var dayPlanner = document.querySelector('.day-planner')

    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {}

    var hours = Array.from({ length: 18 }, (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`)


    var wholeDaySum = ''
    hours.forEach(function (elem, idx) {

        var savedData = dayPlanData[idx] || ''

        wholeDaySum = wholeDaySum + `<div class="day-planner-time">
    <p>${elem}</p>
    <input id=${idx} type="text" placeholder="..." value=${savedData}>
</div>`
    })

    dayPlanner.innerHTML = wholeDaySum


    var dayPlannerInput = document.querySelectorAll('.day-planner input')

    dayPlannerInput.forEach(function (elem) {
        elem.addEventListener('input', function () {
            console.log('hello');
            dayPlanData[elem.id] = elem.value

            localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData))
        })
    })
}

dailyPlanner()


function motivationalQuote() {
    var motivationQuoteContent = document.querySelector('.motivation-2 h1')
    var motivationAuthor = document.querySelector('.motivation-3 h2')

    async function fetchQuote() {
        let response = await fetch('https://api.quotable.io/random')
        if (!response.ok) {
            throw new Error(`Quote request failed: ${response.status}`)
        }
        let data = await response.json()

        motivationQuoteContent.textContent = data.content
        motivationAuthor.textContent = data.author
    }

    fetchQuote().catch(function (error) {
        console.error('Unable to load motivational quote:', error)
        motivationQuoteContent.textContent = 'Quote unavailable. Please try again later.'
        motivationAuthor.textContent = ''
    })
}

motivationalQuote()


function pomodoroTimer() {


    let timer = document.querySelector('.pomo-timer h1')
    var startBtn = document.querySelector('.pomo-timer .start-timer')
    var pauseBtn = document.querySelector('.pomo-timer .pause-timer')
    var resetBtn = document.querySelector('.pomo-timer .reset-timer')
    var session = document.querySelector('.pomodoro-fullpage .session')
    var isWorkSession = true

    let totalSeconds = 25 * 60
    let timerInterval = null

    function updateTimer() {
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = totalSeconds % 60

        timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    function startTimer() {
        clearInterval(timerInterval)

        if (isWorkSession) {

            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = false
                    clearInterval(timerInterval)
                    timer.innerHTML = '05:00'
                    session.innerHTML = 'Take a Break'
                    session.style.backgroundColor = 'var(--blue)'
                    totalSeconds = 5 * 60
                }
            }, 1000)
        } else {


            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = true
                    clearInterval(timerInterval)
                    timer.innerHTML = '25:00'
                    session.innerHTML = 'Work Session'
                    session.style.backgroundColor = 'var(--green)'
                    totalSeconds = 25 * 60
                }
            }, 1000)
        }

    }

    function pauseTimer() {
        clearInterval(timerInterval)
    }
    function resetTimer() {
        totalSeconds = 25 * 60
        clearInterval(timerInterval)
        updateTimer()

    }
    startBtn.addEventListener('click', startTimer)
    pauseBtn.addEventListener('click', pauseTimer)
    resetBtn.addEventListener('click', resetTimer)



}

pomodoroTimer()



function weatherFunctionality() {
    var header1Time = document.querySelector('.header1 h1')
    var header1Date = document.querySelector('.header1 h2')
    var header2Temp = document.querySelector('.header2 h2')
    var header2Condition = document.querySelector('.header2 h4')
    var locationLabel = document.querySelector('.header2 .weather-location')
    var precipitation = document.querySelector('.header2 .precipitation')
    var humidity = document.querySelector('.header2 .humidity')
    var wind = document.querySelector('.header2 .wind')

    async function weatherAPICall() {
        if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported by this browser.')
        }

        header2Condition.textContent = 'Finding local weather...'
        locationLabel.textContent = 'Finding your location...'

        var position = await new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: false,
                timeout: 12000,
                maximumAge: 600000
            })
        })
        var latitude = position.coords.latitude
        var longitude = position.coords.longitude

        var params = new URLSearchParams({
            latitude: String(latitude),
            longitude: String(longitude),
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code',
            temperature_unit: 'celsius',
            wind_speed_unit: 'kmh',
            timezone: 'auto'
        })
        var response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
        if (!response.ok) {
            throw new Error(`Weather request failed: ${response.status}`)
        }
        var data = await response.json()
        if (!data.current) {
            throw new Error('Weather response did not contain current conditions.')
        }

        var current = data.current
        var conditions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Rime fog',
            51: 'Light drizzle',
            53: 'Drizzle',
            55: 'Heavy drizzle',
            61: 'Light rain',
            63: 'Rain',
            65: 'Heavy rain',
            71: 'Light snow',
            73: 'Snow',
            75: 'Heavy snow',
            80: 'Rain showers',
            81: 'Rain showers',
            82: 'Heavy rain showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with hail',
            99: 'Thunderstorm with hail'
        }

        header2Temp.textContent = `${Math.round(current.temperature_2m)}°C`
        header2Condition.textContent = conditions[current.weather_code] || 'Current conditions'
        wind.textContent = `Wind: ${Math.round(current.wind_speed_10m)} km/h`
        humidity.textContent = `Humidity: ${current.relative_humidity_2m}%`
        precipitation.textContent = `Feels like: ${Math.round(current.apparent_temperature)}°C`

        try {
            var reverseGeocodeUrl = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client')
            reverseGeocodeUrl.search = new URLSearchParams({
                latitude: String(latitude),
                longitude: String(longitude),
                localityLanguage: 'en'
            })
            var locationResponse = await fetch(reverseGeocodeUrl)
            if (!locationResponse.ok) throw new Error('Location name lookup failed')

            var place = await locationResponse.json()
            var locality = place.city || place.locality || place.principalSubdivision
            var country = place.countryName
            locationLabel.textContent = [locality, country && country !== locality ? country : '']
                .filter(Boolean)
                .join(', ') || 'Your location'
        } catch (error) {
            console.warn('Unable to look up the location name:', error)
            locationLabel.textContent = 'Your current location'
        }
    }

    weatherAPICall().catch(function (error) {
        console.error('Unable to load weather:', error)
        header2Temp.textContent = '--°C'
        if (error.code === 1) {
            locationLabel.textContent = 'Location permission denied'
            header2Condition.textContent = 'Allow location access for local weather'
        } else if (error.code === 2) {
            locationLabel.textContent = 'Location unavailable'
            header2Condition.textContent = 'Could not determine your location'
        } else if (error.code === 3) {
            locationLabel.textContent = 'Location timed out'
            header2Condition.textContent = 'Try refreshing the page'
        } else if (error.code !== undefined) {
            locationLabel.textContent = 'Location unavailable'
            header2Condition.textContent = 'Enable location access for local weather'
        } else {
            header2Condition.textContent = 'Weather unavailable'
        }
        wind.textContent = 'Wind: --'
        humidity.textContent = 'Humidity: --'
        precipitation.textContent = 'Feels like: --'
    })


    function timeDate() {
        const totalDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var date = new Date()
        var dayOfWeek = totalDaysOfWeek[date.getDay()]
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        var tarik = date.getDate()
        var month = monthNames[date.getMonth()]
        var year = date.getFullYear()

        header1Date.innerHTML = `${tarik} ${month}, ${year}`

        var displayHour = hours % 12 || 12
        var period = hours >= 12 ? 'PM' : 'AM'
        header1Time.textContent = `${dayOfWeek}, ${String(displayHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`
    }

    timeDate()
    setInterval(() => {
        timeDate()
    }, 1000);

}

weatherFunctionality()


function changeTheme() {

    var theme = document.querySelector('.theme')
    var rootElement = document.documentElement

    var flag = 0
    theme.addEventListener('click', function () {

        if (flag == 0) {
            rootElement.style.setProperty('--pri', '#F8F4E1')
            rootElement.style.setProperty('--sec', '#222831')
            rootElement.style.setProperty('--tri1', '#948979')
            rootElement.style.setProperty('--tri2', '#393E46')
            flag = 1
        } else if (flag == 1) {
            rootElement.style.setProperty('--pri', '#F1EFEC')
            rootElement.style.setProperty('--sec', '#030303')
            rootElement.style.setProperty('--tri1', '#D4C9BE')
            rootElement.style.setProperty('--tri2', '#123458')
            flag = 2
        } else if (flag == 2) {
            rootElement.style.setProperty('--pri', '#F8F4E1')
            rootElement.style.setProperty('--sec', '#381c0a')
            rootElement.style.setProperty('--tri1', '#FEBA17')
            rootElement.style.setProperty('--tri2', '#74512D')
            flag = 0
        }

    })


}

changeTheme()