class RandomUser {

    constructor() {
        console.log('Random User Api initialized');
        this.config = null;
        this.load();
    }

    //Load the config file
    load() {
        $.getJSON( "data/randomUser.json", this.init);
    }

    //Contains config information and load the users based on the default query
    init(data) {
        window.app.RandomUser.config = data;
        window.app.RandomUser.loadUsers('?results=12&nat=us,gb');
    }

    //On loading the users render to the page
    loadUsers(query) {
        $.ajax({
            url: this.config.url + query,
            dataType: 'json',
            success: function(data) {
                if (data.results) {
                    window.app.users = data.results;
                    window.app.renderUsers(window.app.users);
                }
            }
        });
    }

}