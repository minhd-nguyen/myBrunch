import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Yelp_logo from '../assets/YelpLogo_Trademark/Yelp_trademark_RGB.png'; 


class RestaurantList extends Component {

    constructor(props) {
        super(props);
        //props.state is linked with the result sending back from its child a.k.a the result we returned in SearchForm element
        this.state = {
            //leverage the state to store the information return from API to make loading faster
            results: [],
            errorState: null,
            loading: false,
        };
    }

    componentDidMount() {
        this.getRestaurantsFromApi('Seattle');
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.searchLocationQuery !== prevProps.searchLocationQuery) {
            this.setState({
                results: [],
            }, () => this.getRestaurantsFromApi(this.props.searchLocationQuery))
        }
    }
    //function to get information from API 
    getRestaurantsFromApi = (locationSearched) => {
        //UI feedback to tell the user when we are retrieving information from the API 
        this.setState({ loading: true })

        //using a proxy server cors-anywhere to get rid of the CROSS problem 
        //SUPER HOT TIP: passing the location variable, which equals to the user's input (see below). Instead of grabbing the entire API, it will only retrieve the restaurants that are closed to the lcoation information we entered. This makes the lodading wayyyyyyy faster.
        axios.get(`${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search?location=${locationSearched}`, {
            //required authorization format from API 
            headers: {
                //to get the API from the .env file use process.env.{variable name}
                Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
            },
            //option params passed to API call to retrieve only breakfast and lunch spots 
            params: {
                categories: 'breakfast_brunch',
            }
        })
            .then((res) => {
                console.log(res.data.businesses)
                //change the state of App to reflect on the result we are given from the API
                //at the same time, setting the loading state to false 
                this.setState({ results: res.data.businesses, loading: false })
            })
            .catch((err) => {
                //fire the errorState message if there is no information return from the API
                this.setState({ errorState: `Sorry we couldn't find information related to the location you search, do you want to try something else?`, loading: false })
            })
    }

    renderEmptyState() {
        return (
            <h2 className="heading-tertiary">`Hang tight! We are working on getting you the list of best spots in your neighbourhood! `</h2>
        )
    }

    renderRestaurantInfo() {

        const RestaurantList = this.state.results.map((result) => {

            return (
                <div
                    className="RestaurantInfo"
                    key={result.id}
                >
                    <img src={result.image_url} alt="" className="RestaurantInfo__img" />
                    <h2 className="heading-tertiary RestaurantInfo__name">{result.name}</h2>

                    <p className="RestaurantInfo__para">
                        <FontAwesomeIcon
                            icon="map-marker-alt"
                            className="RestaurantInfo__icon"
                            area-label="address:" />
                        {result.location.display_address[0]}, {result.location.display_address[1]}
                    </p>

                    <p className="RestaurantInfo__para">
                        <FontAwesomeIcon
                            icon="phone"
                            className="RestaurantInfo__icon"
                            area-label="phone number:" />
                        {result.phone}
                    </p>

                    <img
                        src={require(`../assets/yelp_stars/${result.rating}.png`)}
                        alt={`yelp ratings: ${result.rating}/5`}
                        className="RestaurantInfo__rating" />

                    <p className="RestaurantInfo__reviewCount"> Based on {result.review_count} Reviews</p>

                    <a
                        href={result.url}
                        className="RestaurantInfo__website">
                        More information on Yelp
                    </a>

                    <img
                        src={Yelp_logo} alt="yelp"
                        className="RestaurantInfo__yelp" />
                </div>
            );
        });

        return (
            <div className="RestaurantList__gallery">{RestaurantList}</div>
        )
    }

    render() {
        return (

            <section className="RestaurantList">
                {this.state.results.length ? this.renderRestaurantInfo() : this.renderEmptyState()}

                {/*conditional rendering for error state - when this.state.errorState is not true*/}
                {!!this.state.errorState &&
                    <h1>{this.state.error}</h1>
                }
            </section>
        )
    }

}
export default RestaurantList
