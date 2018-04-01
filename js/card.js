URL = "https://cscdefault01.ngrok.io";

var dateparser = function (date) {
    date = date.split(" ");
    return date[1] + " - " + date[2];
};

class ForumBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstfilter: "All",
            secondfilter: "All",
            posts: []
        };
        this.updatePosts = this.updatePosts.bind(this);
        this.updateFirstFilter = this.updateFirstFilter.bind(this);
        this.updateSecondFilter = this.updateSecondFilter.bind(this);
    }

    updatePosts(filter1, filter2) {
        console.log("trying to update" + filter1 + filter2);
        var ajaxURL = URL + "/api/page" + "?first=" + filter1 + "&second=" + filter2;
        fetch(ajaxURL).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(json => {
            this.setState({ posts: json.posts });
        });
    }

    componentWillMount() {
        this.updatePosts("All", "All");
    }

    render() {
        return React.createElement(
            "div",
            { className: "block" },
            React.createElement(
                "div",
                { className: "forumtab" },
                React.createElement(FirstFilterList, { updateFilter: this.updateFirstFilter }),
                React.createElement("hr", null),
                React.createElement(SecondFilterList, { updateFilter: this.updateSecondFilter })
            ),
            React.createElement(PostList, { postlist: this.state.posts, filter1: this.state.firstfilter, filter2: this.state.secondfilter }),
            React.createElement(PostEditor, { filter1: this.state.firstfilter, filter2: this.state.secondfilter, forceupdater: () => this.updatePosts(this.state.filter1, this.state.filter2) })
        );
    }

    updateFirstFilter(choice) {
        var currfilter = document.getElementById("upper" + this.state.firstfilter + "Filter");
        currfilter.className = currfilter.className.replace(" active", "");
        var targetfilter = document.getElementById("upper" + choice + "Filter");
        targetfilter.className += " active";
        this.setState({ firstfilter: choice });
        this.updatePosts(choice, this.state.secondfilter);
    }

    updateSecondFilter(choice) {
        var currfilter = document.getElementById("lower" + this.state.secondfilter + "Filter");
        currfilter.className = currfilter.className.replace(" active", "");
        var targetfilter = document.getElementById("lower" + choice + "Filter");
        targetfilter.className += " active";
        this.setState({ secondfilter: choice });
        this.updatePosts(this.state.firstfilter, choice);
    }
}

class FirstFilterList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement(
            "div",
            { className: "block" },
            React.createElement(
                "ul",
                null,
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "upperAllFilter", className: " active", onClick: () => {
                                this.props.updateFilter("All");
                            } },
                        "All"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "upperStoriesFilter", onClick: () => {
                                this.props.updateFilter("Stories");
                            } },
                        "Stories"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "upperAdoptionFilter", onClick: () => {
                                this.props.updateFilter("Adoption");
                            } },
                        "Adoption"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "upperLostFilter", onClick: () => {
                                this.props.updateFilter("Lost");
                            } },
                        "Lost"
                    )
                )
            )
        );
    }
}

class SecondFilterList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement(
            "div",
            { className: "block" },
            React.createElement(
                "ul",
                null,
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "lowerAllFilter", className: " active", onClick: () => {
                                this.props.updateFilter("All");
                            } },
                        "All"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "lowerDogFilter", onClick: () => {
                                this.props.updateFilter("Dog");
                            } },
                        "Dog"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "lowerCatFilter", onClick: () => {
                                this.props.updateFilter("Cat");
                            } },
                        "Cat"
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "button",
                        { id: "lowerOthersFilter", onClick: () => {
                                this.props.updateFilter("Others");
                            } },
                        "Others"
                    )
                )
            )
        );
    }
}

class PostList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currpageposts: [],
            pagenum: 1,
            filter1: "",
            filter2: ""
        };
        this.nextpage = this.nextpage.bind(this);
        this.prevpage = this.prevpage.bind(this);
        this.updatecurrpage = this.updatecurrpage.bind(this);
    }

    componentWillUpdate() {
        if (this.props.filter1 != this.state.filter1 || this.props.filter2 != this.state.filter2) {
            this.updatecurrpage(1);
            this.setState({ pagenum: 1 });
            this.setState({ filter1: this.props.filter1 });
            this.setState({ filter2: this.props.filter2 });
        }
    }

    updatecurrpage(pagenum) {
        var temp = [];
        var starti = (pagenum - 1) * 10;
        var endi = pagenum * 10;
        for (var i = starti; i < endi && i < this.props.postlist.length; i++) {
            temp.push(this.props.postlist[i]);
        }
        this.setState({ currpageposts: temp });
    }

    nextpage(e) {
        var maxpagenum = Math.ceil(this.props.postlist.length / 10);
        if (this.state.pagenum + 1 <= maxpagenum) {
            this.updatecurrpage(this.state.pagenum + 1);
            this.setState({ pagenum: this.state.pagenum + 1 });
        }
    }

    prevpage(e) {
        if (this.state.pagenum - 1 >= 1) {
            this.updatecurrpage(this.state.pagenum - 1);
            this.setState({ pagenum: this.state.pagenum - 1 });
        }
    }

    render() {
        var maxpagenum = Math.max(Math.ceil(this.props.postlist.length / 10), 1);
        return React.createElement(
            "div",
            { className: "block" },
            React.createElement(PostPage, { post: this.state.currpageposts }),
            React.createElement(PageSelector, { max: maxpagenum, curr: this.state.pagenum, next: this.nextpage, prev: this.prevpage })
        );
    }
}

class PostPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return React.createElement(
            "ul",
            null,
            this.props.post.map(item => React.createElement(Post, { post: item }))
        );
    }
}

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            folded: true
        };
        this.flipPostState = this.flipPostState.bind(this);
    }

    flipPostState(e) {
        this.setState({ folded: !this.state.folded });
    }

    render() {
        if (this.state.folded) {
            return React.createElement(
                "div",
                { className: "postfolded" },
                React.createElement(
                    "div",
                    { className: "posttitle" },
                    React.createElement(
                        "h3",
                        null,
                        this.props.post.title
                    )
                ),
                React.createElement(
                    "div",
                    { className: "postauthor", style: { textAlign: "right", paddingRight: 30, color: "#93969b" } },
                    React.createElement(
                        "i",
                        null,
                        "by ",
                        this.props.post.username + "   " + dateparser(this.props.post.currentTime)
                    )
                ),
                React.createElement("img", { onClick: this.flipPostState, src: "https://res.cloudinary.com/dfpktpjp8/image/upload/v1522608454/down.png", width: "20px" }),
                React.createElement("hr", null)
            );
        } else {
            return React.createElement(
                "div",
                { className: "postunfolded" },
                React.createElement(
                    "div",
                    { className: "posttitle" },
                    React.createElement(
                        "h3",
                        null,
                        this.props.post.title
                    )
                ),
                React.createElement("br", null),
                React.createElement(
                    "div",
                    { className: "postcontent" },
                    this.props.post.content
                ),
                React.createElement("br", null),
                React.createElement(PostImageViewer, { images: this.props.post.images }),
                React.createElement("br", null),
                React.createElement(
                    "div",
                    { className: "postauthor", style: { textAlign: "right", paddingRight: 30 } },
                    React.createElement(
                        "i",
                        null,
                        "by ",
                        this.props.post.username + "   " + dateparser(this.props.post.currentTime)
                    )
                ),
                React.createElement("br", null),
                React.createElement(PostReplies, { replies: this.props.post.reply }),
                React.createElement("br", null),
                React.createElement(Reply, { postId: this.props.post.postId }),
                React.createElement("br", null),
                React.createElement("img", { onClick: this.flipPostState, src: "https://res.cloudinary.com/dfpktpjp8/image/upload/v1522608454/up.png", width: "20px" }),
                React.createElement("hr", null)
            );
        }
    }
}

class PostReplies extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.replies == null) {
            return null;
        } else {
            return React.createElement(
                "ul",
                null,
                this.props.replies.map(reply => React.createElement(PostReply, { content: reply }))
            );
        }
    }
}

function PostReply(props) {
    return React.createElement(
        "li",
        null,
        React.createElement(
            "div",
            { className: "postreply", style: { borderLeft: "2px", textAlign: "left", paddingLeft: "60px" } },
            props.content.content,
            "       ",
            props.content.username
        )
    );
}

class Reply extends React.Component {
    constructor(props) {
        super(props);
        this.submitReply = this.submitReply.bind(this);
    }

    submitReply() {
        var content = document.getElementById("postReply" + this.props.postId).value;
        var correct = 1;
        var id = this.props.postId;
        if (content.length < 5) {
            correct = 0;
            alert("Reply too short");
        }
        if (correct == 1) {
            $(function () {
                $.ajax({
                    url: URL + "/api/reply",
                    type: "POST",
                    data: { 'username': currentUser,
                        'postId': id,
                        'content': content },
                    dataType: "json",
                    success: function (response) {
                        if (response["success"] == "success") {
                            alert("Replied");
                        } else {
                            alert("Failed to reply. Please try again");
                        }
                    }
                });
            });
        }
    }

    render() {
        if (currentUser == "") {
            return null;
        } else {
            return React.createElement(
                "div",
                null,
                React.createElement("input", { type: "text", id: "postReply" + this.props.postId }),
                React.createElement(
                    "button",
                    { onClick: this.submitReply },
                    "Reply"
                )
            );
        }
    }
}

class PostImageViewer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.images != "") {
            return React.createElement(
                "ul",
                null,
                this.props.images.map(item => React.createElement(SingleImage, { url: item }))
            );
        } else {
            return null;
        }
    }
}

function SingleImage(props) {
    return React.createElement(
        "li",
        null,
        React.createElement("img", { src: props.url, width: "300px" })
    );
}

class PageSelector extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return React.createElement(
            "div",
            { className: "block" },
            React.createElement(
                "ul",
                null,
                React.createElement(
                    "button",
                    { onClick: this.props.prev },
                    "Prev Page"
                ),
                React.createElement(
                    "div",
                    null,
                    this.props.curr,
                    "/",
                    this.props.max
                ),
                React.createElement(
                    "button",
                    { onClick: this.props.next },
                    "Next Page"
                )
            )
        );
    }
}

class PostEditor extends React.Component {
    constructor(props) {
        super(props);
        this.makePost = this.makePost.bind(this);
    }

    render() {
        if (currentUser == "" || this.props.filter1 == "All" || this.props.filter2 == "All") {
            return null;
        } else {
            return React.createElement(
                "div",
                { className: "postEditor block", id: "postEditor" },
                React.createElement(
                    "h1",
                    null,
                    "Title:"
                ),
                React.createElement(
                    "section",
                    { className: "makePosts" },
                    React.createElement(
                        "div",
                        { className: "stretch" },
                        React.createElement("input", { type: "text", id: "postTitle" })
                    )
                ),
                React.createElement(
                    "h1",
                    null,
                    "Content: "
                ),
                React.createElement(
                    "section",
                    { className: "makePosts" },
                    React.createElement("textarea", { className: "stretch", rows: "20", id: "postContent" })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "label",
                        { htmlFor: "postImgUpload", style: { float: "left" } },
                        "Insert IMG"
                    ),
                    React.createElement("input", { type: "file", id: "postImgUpload", style: { float: "left" }, accept: ".jpg, .jpeg, .png", multiple: true }),
                    React.createElement(
                        "button",
                        { id: "post", style: { float: "right" }, onClick: () => {
                                this.makePost(this.props.filter1, this.props.filter2);
                            } },
                        "Post"
                    )
                )
            );
        }
    }

    makePost(filter1, filter2) {
        var submitButton = document.getElementById('post');
        var title = document.getElementById("postTitle").value;
        var content = document.getElementById("postContent").value;
        var correct = 1;
        var updater = this.props.forceupdater;
        if (title.length < 5) {
            correct = 0;
            alert("Title too short.");
        }

        if (content.length < 5) {
            correct = 0;
            alert("Content too short.");
        }
        if (correct == 1) {
            var images = document.getElementById("postImgUpload").files;
            if (images.length > 0) {
                var img_url = [];
                for (var i = 0; i < images.length; i++) {
                    var formData = new FormData();
                    formData.append('file', images[i]);
                    formData.append('upload_preset', 'tsqi28bt');
                    axios({
                        url: "https://api.cloudinary.com/v1_1/dfpktpjp8/image/upload",
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: formData
                    }).then(function (res) {
                        img_url.push(res['data']['secure_url']);
                        if (img_url.length == images.length) {
                            $(function () {
                                $.ajax({
                                    url: URL + "/api/posts",
                                    type: "POST",
                                    data: {
                                        title: title,
                                        username: currentUser,
                                        content: content,
                                        images: img_url,
                                        filter1: filter1,
                                        filter2: filter2
                                    },
                                    dataType: "json",
                                    success: function (response) {
                                        if (response['success'] != 'success') {
                                            alert("failed to post");
                                        } else {
                                            $("#postTitle").val("");
                                            $("#postContent").val("");
                                            $("#postImgUpload").val(null);
                                            alert("posted");
                                            updater(filter1, filter2);
                                        }
                                    }
                                });
                            });
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                }
            } else {
                $(function () {
                    $.ajax({
                        url: URL + "/api/posts",
                        type: "POST",
                        data: {
                            title: title,
                            username: currentUser,
                            content: content,
                            images: null,
                            filter1: filter1,
                            filter2: filter2
                        },
                        dataType: "json",
                        success: function (response) {
                            if (response['success'] != 'success') {
                                alert("failed to post");
                            } else {
                                alert("posted");
                                updater();
                            }
                        }
                    });
                });
            }
        }
    }
}

ReactDOM.render(React.createElement(ForumBody, null), document.getElementById("forum"));

