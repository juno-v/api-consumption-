import React, { Component } from 'react';
import "./GetTimepointDepartures.css"; 

class GetTimepointDepartures extends Component {
    state = { 
        leavingFrom: this.props.leavingFrom,
        selectedDirection: this.props.selectedDirection, 
        selectedStop: this.props.selectedStop,  
        selectedStopname: this.props.selectedStopname, 
        scheduledDepartures: '',
        selectedDeparture: '', 
        showFinalResult: false,

    }

    async getDeparture () {
        try {
          
          let route = parseInt(this.state.leavingFrom); 
          let direction = parseInt(this.state.selectedDirection);
          let stop = this.state.selectedStop; 
    
          let response = await fetch(`http://svc.metrotransit.org/NexTrip/${route}/${direction}/${stop}?format=json`);
    
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
    
          else { 
            response.json().then((data) => {
                this.setState({
                    scheduledDepartures: data, 
                })
            });
          }
        }
        catch { 
          console.log('we have in error in fetchData component!!!!');
        }
      }

      selectDeparture = (event) => {
        this.setState({
            ...this.state, 
            selectedDeparture: event.target.value, 
        })
      }

      checkFinalResult = () => {
        console.log(`check overall selections`, this.state); 
      }

      check = () => {
          console.log(this.state.selectedDeparture[0])
      }

     componentDidMount () {
         this.getDeparture(); 
     }


    render() { 


        let direction = this.state.selectedDirection; 
        if (direction === "4") {
            direction = 'NORTH'; 
        }
        else if (direction === "3") {
            direction = 'WEST';
        }

        else if (direction === "2") {
            direction = 'EAST';
        }
        else if (direction === "1") {
            direction = 'SOUTH';
        }
        else {
            direction = 'Error, unable to retrieve direction. Try again later.'; 
        }


        let time; 
        if (this.state.selectedDeparture[0] > 12) {
            time = "PM"
        } 
        else {
            time = "AM"; 
        }

        return ( 
            <div>
              
                <h1 onClick={this.check}> SELECT SCHEDULE DEPARTURE TIME</h1>
                <hr/>

                {this.state.scheduledDepartures.length > 0 ?
                this.state.scheduledDepartures.map((stop, index) => {
                    return( 
                        <div className="stops"
                        key={index}>
                            {/* <p>{stop["DepartureTime"]}</p> */}
                            <p>{stop["DepartureText"]} {time}</p>

                            <button
                            onClick={this.selectDeparture}
                            value={stop["DepartureText"]}>
                                SELECT THIS STOP
                            </button>
                        </div>
                    )
                }) : null} 
                <hr/> 

                <h1 onClick={this.checkFinalResult} >DETAILS ABOUT SELECTED ROUTE</h1>
                <hr/>

                {this.state.selectedDeparture.length > 0 ? 
                <div>
                    <p>Leaving From: {this.state.leavingFrom}</p>
                    <p>Going To: {this.state.selectedStopname}</p>
                    <p>Direction: {direction} </p>
                    <p>Date/Time departing: {this.state.selectedDeparture} {time} </p>
                </div>
                :
                <p>Please select a departure option to see your final route details!</p>}
            </div>
         );
    }
}
 
export default GetTimepointDepartures;