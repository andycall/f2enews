var React = require('react');
var NewsStore = require('../stores/NewsStore');
var TwittsStore = require('../stores/TwittsStore');
var NavbarStore = require('../stores/NavbarStore');
var UserStore = require('../stores/UserStore');
var News = require('./News.react');
var Navbar = require('./Header.react');
var Button = require('./Button.react');
var Twitts = require('./Twitts.react');
var Dropdown = require('./Dropdown.react');

function getNewsState(){
    return {
        news: NewsStore.getNews(),
        source: NavbarStore.getSource(),
        twitts: TwittsStore.getTwitts()
    }
}

var NewsApp = React.createClass({
    getInitialState: function () {
        var searchStr = location.search.slice(1);
        if (searchStr) {
            var queryList = searchStr.split("&");
            var queryObj = {};
            queryList.forEach(function (item) {
                queryObj[item.split("=")[0]] = item.split("=")[1];
            });
            if (queryList.code) {
                UserStore.oauthGithub();
            }
        }
        return getNewsState();
    },
    getMoreNews: function () {
        NewsActions.getMoreNews(this.state.start);
    },
    componentDidMount: function () {
        this.state.opacity = 0;
        this.state.elemOffsetX = 0;
        this.state.elemOffsetY = 0;
        NewsStore.addChangeListener(this._onChange);
        TwittsStore.addChangeListener(this._onChange);
        NavbarStore.addChangeListener(this._onChange);
    },
    componentWillUnMount: function () {
        NewsStore.removeChageListener(this._onChange);
        TwittsStore.removeChageListener(this._onChange);
    },
    changeSource: function () {
        NewsActions.changeSource();
    },
    render: function () {
    var  dropdownData = [{
        key: "news",
        text: "前端新闻"
    },{
        key: "twitts",
        text: "热门 Twitts"
    },{
        key: "classics",
        text: "前端经典"
    }];

    return (
            <div>
                <Navbar />
                <div class="row">
                    <Dropdown data={dropdownData} clickEvent={this.changeSource.bind(self)}/>
                </div>
                <section id="news">
                    {this.state.source == "news" ? <News news={this.state.news} /> : <Twitts twitts={this.state.twitts} />}
                </section>
            </div>
        )
    },
    _onChange: function () {
        this.setState(getNewsState());
        console.log(this.state.source);
    }
});

module.exports = NewsApp;
