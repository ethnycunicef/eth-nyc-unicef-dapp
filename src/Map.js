import React, {Component} from 'react';

import {Map, Polygon, Marker, GoogleApiWrapper} from 'google-maps-react';
const data = require('./example_data.json');

export class MapContainer extends Component {
  constructor() {
    super();
    this.state = {
      districts: [],
      loading: true,
    }
  }

  componentWillMount() {
    const polygons = {};
    const districts = data["grouped_by_zip"];
    const processed = Object.keys(districts).map(district => {
      return districts[district].map(school => {
          return {'geo': { 'lat': school['lat'], 'lng': school['lon'] }, 'school': school};
      })
    }).map(p => p);
    this.setState({districts: processed})
  }
  render() {
    const polygons = this.state.districts.map(district => {
      return district.map(school => school.geo);
    });
    console.log(this.state.districts.sort((a, b) => a.length > b.length)[0][0].geo)
      return (
        <Map
        initialCenter={this.state.districts.sort((a, b) => a.length > b.length)[0][0].geo}
        zoom={50}
          google={this.props.google}
          className="map"
          style={{ height: '100%', position: 'relative', width: '100%' }}
          zoom={14}>
          <Polygon
            fillColor="#0000FF"
            fillOpacity={0.35}
            paths={polygons}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2}
          />
          {this.state.districts.map(district => {
            district.map(school => {
              return (
                <Marker
                    name="Dolores park"
                    position={school.geo}
                />
              )
            })
          })}
        </Map>
      );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyCWh9h2jTERGI2OXmKxY20udIdSJnmqp9M"
})(MapContainer)