import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }

  capitalizeFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1); 
  }
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
      setProgress: 0,
    };
    document.title = `${this.capitalizeFirst(this.props.category)} - NewsMonkey`
  }
  fetchMoreData = async() => {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0d9e0ba9fb14456b9d1c67150bff0978&page=${this.state.page + 1}&pagesize=${this.props.pageSize}`;
    this.setState({
      page: this.state.page + 1,
    })
    let data = await fetch(url);
    let parsedData = await data.json();
    // console.log(data);
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
    });
  };
  async updateNews(){
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0d9e0ba9fb14456b9d1c67150bff0978&page=${this.state.page}&pagesize=${this.props.pageSize}`;
    this.setState({loading : true})
    let data = await fetch(url);
    let parsedData = await data.json();
    // console.log(data);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading : false,
    });
    this.props.setProgress(100)
  }
  componentDidMount = async() => {
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0d9e0ba9fb14456b9d1c67150bff0978&page=${this.state.page}&pagesize=${this.props.pageSize}`;
    this.setState({loading : true})
    let data = await fetch(url);
    let parsedData = await data.json();
    // console.log(data);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading : false,
    });
  };

  handleNextClick = async () => {
    // console.log("next");
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=d77c12dcf154494989287ba4ce541483&page=${this.state.page + 1}&pagesize=${this.props.pageSize}`;
    // this.setState({loading : true})
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // this.setState({
    //   page: this.state.page + 1,
    //   articles: parsedData.articles,
    //   loading : false,
    // });
    this.setState({page: this.state.page + 1});
    this.updateNews();
  };

  handlePrevClick = async () => {
    // console.log("prev");
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=d77c12dcf154494989287ba4ce541483&page=${this.state.page - 1
    //   }&pagesize=${this.props.pageSize}`;
    // this.setState({loading : true})
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // // console.log(parsedData);
    // this.setState({
    //   page: this.state.page - 1,
    //   articles: parsedData.articles,
    //   loading : false,
    // });
    this.setState({page: this.state.page - 1});
    this.updateNews();

  };
  render() {
    return (
      <>
        <h1 className="text-center">NewsMonkey - Top {this.capitalizeFirst(this.props.category)} Headlines </h1>
        <div className="container">
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<h1><Spinner/></h1>}
        >
       <div className="container">
        <div className="row">
          {this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={
                      element.title !== null
                        ? element.title.slice(0, 45) + "..."
                        : ""
                    }
                    description={
                      element.description !== null
                        ? element.description.slice(0, 88) + "..."
                        : ""
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date = {new Date(element.publishedAt).toGMTString()}
                    source = {element.source["name"]}
                  />
                </div>
              );
            })
          }
        </div>
        </div>
        </InfiniteScroll>
        </div>
      </>
    );
  }
}

export default News;
