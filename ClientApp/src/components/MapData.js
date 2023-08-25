import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import FlightDetails from './FlightDetails'
import redJet from '../images/redjet.png'
import auth from '../auth'
import ReactLoading from 'react-loading'
import algeria from '../images/algeria.png'
import australia from '../images/australia.png'
import austria from '../images/austria.png'
import argentina from '../images/argentina.png'
import azerbaijan from '../images/azerbaijan.png'
import bahrain from '../images/bahrain.png'
import belgium from '../images/belgium.png'
import bolivia from '../images/bolivia.png'
import brazil from '../images/brazil.png'
import canada from '../images/canada.png'
import chile from '../images/chile.png'
import czechrepublic from '../images/czechrepublic.png'
import denmark from '../images/denmark.png'
import ecuador from '../images/ecuador.png'
import egypt from '../images/egypt.png'
import finland from '../images/finland.png'
import france from '../images/france.png'
import germany from '../images/germany.png'
import greece from '../images/greece.png'
import hungary from '../images/hungary.png'
import india from '../images/india.png'
import ireland from '../images/ireland.png'
import italy from '../images/italy.png'
import israel from '../images/israel.png'
import japan from '../images/japan.png'
import kuwait from '../images/kuwait.png'
import malaysia from '../images/malaysia.png'
import mexico from '../images/mexico.png'
import netherlands from '../images/netherlands.png'
import newzealand from '../images/newzealand.png'
import nigeria from '../images/nigeria.png'
import oman from '../images/oman.png'
import poland from '../images/poland.png'
import portugal from '../images/portugal.png'
import saudiarabia from '../images/saudiarabia.png'
import slovakia from '../images/slovakia.png'
import slovenia from '../images/slovenia.png'
import spain from '../images/spain.png'
import sweden from '../images/sweden.png'
import switzerland from '../images/switzerland.png'
import taiwan from '../images/taiwan.png'
import turkey from '../images/turkey.png'
import unitedkingdom from '../images/unitedkingdom.png'
import nato from '../images/unitednations.png'
import unitedstates from '../images/unitedstates.png'
import qatar from '../images/qatar.png'

const flags = {
  algeria,
  argentina,
  australia,
  austria,
  azerbaijan,
  bahrain,
  belgium,
  bolivia,
  brazil,
  canada,
  chile,
  czechrepublic,
  denmark,
  ecuador,
  egypt,
  finland,
  france,
  germany,
  greece,
  hungary,
  india,
  ireland,
  israel,
  italy,
  japan,
  kuwait,
  malaysia,
  mexico,
  nato,
  netherlands,
  newzealand,
  nigeria,
  oman,
  poland,
  portugal,
  saudiarabia,
  slovenia,
  slovakia,
  spain,
  sweden,
  switzerland,
  taiwan,
  turkey,
  unitedkingdom,
  unitedstates,
  qatar
}

export default function MapSetHooks(props) {

  // if (!auth.isAuthenticated()) {
  //   window.location.href = "/login"
  // }

  const [loading, setLoading] = useState(true)
  const [flight, setFlight] = useState('')


  const [data, setData] = useState(
    { lat: 0, lon: 0 }
  )
  const flightICAO = props.match.params.flighticao
  const dataKey = `${flightICAO}-data`

  const [viewport, setViewPort] = useState({
    longitude: 25,
    latitude: 25,
    zoom: 6
  })

  // const postFlightForUser = () => {
  //   // TODO : add logic to only post if the user is logged in
  //   axios.post(`/user/${flightICAO}/adduserflight`, {}, { headers: { "Authorization": auth.authorizationHeader() } })
  // }

  //const fpost = (data) => axios.post('flightinfo/addflight', data)

  const axiosGet = () => {
    console.log("running get")
    axios(
      {
        method: 'GET',
        url: `https://adsbexchange-com1.p.rapidapi.com/icao/${flightICAO}/`,
        headers: {
          'X-RapidAPI-Key': process.env.ADSB_TOKEN,
          'X-RapidAPI-Host': 'adsbexchange-com1.p.rapidapi.com'
        }
      }
    ).then(resp => {
      // resp.data = undefined
      if (resp && resp.data && resp.data.ac && resp.data.ac) {
        setData(resp.data.ac[0])
        // setUserData(sessionStorage.getItem(access_token), resp.data.ac[0].icao)
        const data = resp.data.ac[0]
        //fpost(data)
        sessionStorage.setItem(dataKey, JSON.stringify(data))
        sessionStorage.setItem(dataKey + '-timeStampFlight', new Date().getTime())
        setViewPort(vp => {
          //console.log("svp", { vp }, { data })
          vp.latitude = parseFloat(data.lat)
          vp.longitude = parseFloat(data.lon)
          return vp
        })
        setLoading(false)
        //console.log("myinfo", data)
      } else {
        const sessionData = JSON.parse(sessionStorage.getItem("myData")).filter(f => f.icao === flightICAO)
        console.log("sessionData", sessionData)
        setViewPort(vp => {
          //console.log("svp", { vp }, { data })
          vp.latitude = parseFloat(data.lat)
          vp.longitude = parseFloat(data.lon)
          return vp
        })
        setData(sessionData[0])
        setLoading(false)
      }

    })
  }





  useEffect(() => {
    console.log("running effect")
    const storedTime = sessionStorage.getItem(dataKey + '-timeStampFlight')
    const cachedData = sessionStorage.getItem(dataKey)

    //postFlightForUser()

    if (new Date().getTime() - storedTime > (5 * 60 * 1000) || !cachedData) {
      console.log('api calling')
      axiosGet()
    } else {
      console.log('using session')
      const data = JSON.parse(cachedData)
      setData(data)
      setViewPort(vp => {
        vp.latitude = parseFloat(data.lat)
        vp.longitude = parseFloat(data.lon)
        return vp
      })
      setLoading(false)
    }

  }, [])

  const render = () => {
    if (loading === true) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ReactLoading type={"bars"} color={"rgb(0,131,240)"} height={'20%'} width={'20%'} />
        </div>
      )
    } else {
      return (
        <>

          <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
            mapStyle='mapbox://styles/ddjango/cjy5w2fle12rc1dp6ibud3rtw'
            onViewportChange={viewport => {
              setViewPort(viewport)
            }}
            width='100vw'
            height='415px'
          >
            <Marker latitude={parseFloat(data.lat)} longitude={parseFloat(data.lon)}>
              <button
                style={{ border: 'none' }}
                onClick={e => {
                  e.preventDefault();
                  setFlight(data)
                }}
              >
                <img style={{ width: '25px', transform: `rotate(${data.trak + 'deg'})` }} src={redJet} />
              </button>
            </Marker>
            {flight ? (
              <Popup
                latitude={parseFloat(data.lat)}
                longitude={parseFloat(data.lon)}
                onClose={() => {
                  setFlight(null)
                }}
              >
                <div className='flight-marker'>
                  <img style={{ width: '25px', margin: '0' }} src={flags[data.cou.replace(/\s/g, '').toLowerCase()]} />
                  <p>{data.cou}</p>
                  <p>Model: {data.type}</p>
                  <p>Call: {data.call ? data.call : 'n/a'}</p>
                  <p>Speed: {data.spd ? data.spd + 'kn' : 'n/a'}</p>
                  <p>Altitude: {data.alt ? data.alt + 'ft' : 'n/a'}</p>
                </div>
              </Popup>
            ) : null}
          </ReactMapGL>
          <img style={{ width: '55px', margin: '0' }} src={flags[data.cou.replace(/\s/g, '').toLowerCase()]} />
          <FlightDetails
            {...data} />
        </>
      )
    }

  }


  return (
    <>

      <div>{render()}</div>

    </>
  )

}



{/* <button onClick={(e) => {
  e.preventDefault()
  setViewPort(
    {
      longitude: parseFloat(flight.lat),
      latitude: parseFloat(flight.lon),
      zoom: 7,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator()
    }
  )
}}></button> */}