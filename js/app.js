class App {

    constructor() {
        console.log('Starting Request API');
        this.RandomUser = new RandomUser();
        this.users      = [];

        //Elements
        this.gallery = document.getElementById('gallery');
        this.form    = document.getElementsByTagName('form')[0];

        //Events
        //Handle the card click and retrieve the correct user data to display a modal
        this.gallery.addEventListener('click', event => {
            let element = event.target;
            let parent  = $(element).parents('.card')[0];

            if (element.classList.contains('card'))
                parent = element;

            if (!parent)
                return;

            let email = $(parent).data('email');
            let user  = window.app.getUser(email);
            
            window.app.displayModal(user, parent);
        });

        this.form.addEventListener('submit', event => {
            event.preventDefault();

            let form   = event.target;
            let input  = form.querySelector('#search-input');
            let search = input.value;
            let users  = window.app.users;

            if (search.length > 0)            
                users  = window.app.searchUsers(search);
            
            window.app.renderUsers(users);
        });
    }

    //Add the users loaded from api to html
    renderUsers(users) {
        console.log('Clearing current users');
        this.gallery.innerHTML = '';
        
        console.log('Rendering Users');        

        let cards = '';
        $.each(users, (key, user) => {
            let card = this.createCard(user)
            cards += card;
        });

        $(this.gallery).append(cards);
    }

    //Create the card element based on the template and return it
    createCard(user) {
        let template = `
            <div class="card" data-email="${user.email}">
                <div class="card-img-container">
                    <img class="card-img" src="${user.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="card-text">${user.email}</p>
                    <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                </div>
            </div>
        `;

        return template;
    }

    //Create the modal element based on the template and add to the body
    displayModal(user, element) {
        let prevElement = element.previousElementSibling;
        let nextElement = element.nextElementSibling;
        let prev     = `
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        `;
        let next     = `
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        `;
        let template = `
            <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                        <p class="modal-text">${user.email}</p>
                        <p class="modal-text cap">${user.location.city}</p>
                        <hr>
                        <p class="modal-text">${user.phone}</p>
                        <p class="modal-text">${user.location.street}, ${user.nat} ${user.location.postcode}</p>
                        <p class="modal-text">Birthday:${user.dob.date}</p>
                    </div>
                </div>
                <div class="modal-btn-container">
                    ${prevElement? prev : ''}
                    ${nextElement? next : ''}
                </div>
            </div>
        `;

        $('body').append(template);

        $('#modal-close-btn').click(event => {
            $('.modal-container').remove();
        });

        $('#modal-prev').click(event => {
            $('.modal-container').remove();
            let email = $(prevElement).data('email');
            let user  = window.app.getUser(email);
            window.app.displayModal(user, prevElement);
        });

        $('#modal-next').click(event => {
            $('.modal-container').remove();
            let email = $(nextElement).data('email');
            let user  = window.app.getUser(email);
            window.app.displayModal(user, nextElement);
        });
    }

    //Retrieve the user object by email
    getUser(email) {
        return this.users.find((user, index, users) => {
            return user.email === email;
        });
    }

    searchUsers(search) {
        let squery = search.toLowerCase();
        return this.users.filter((user, index, users) => {
            return user.name.first.indexOf(squery) >= 0 || user.name.last.indexOf(squery) >= 0;
        });
    }

}

//Load the app after everything is set up
document.addEventListener('DOMContentLoaded', event => {
    console.log('DOM loaded');
    window.app = new App();
});

