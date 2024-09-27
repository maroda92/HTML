//Variables used by the functions to keep track on what posts to fetch
//and if posts are currently being loaded.
let loading = false;
let start = 0;
//the number of posts to be loaded from the api
const toLoad = 3;

//Fetch posts from jsonplaceholder api
function getPostsFromJsonPlaceholder() {
    //Checks if posts are beeing loaded, and prevents more posts to be loaded
    //at the same time.
    if(loading){
        return;
    }
    
    loading = true;

    //Fetches 3 posts from jasonplaceholder.
    //https://github.com/typicode/json-server - shows how to fetch only 3 of the posts at a time.
    //cold not find this on jasonplaceholder.typicode.com ... :P
    fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${toLoad}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('HTTP error! could not fetch posts from api.');
        }
        return response.json();
    }) .then(data => {
        updateDataForHtmlSection(data);
        //after fetching the 3 first posts, the startpoint ("start" in the url)
        //of for the data to fetch is incremented by 3 ("limit" in the url) to prevent the
        //same posts from being fetched again.
        start = start + toLoad;
        loading = false;
    }) .catch(error => {
        console.error('Error', error);
        loading = false;
    });
}


//Updates the webpage with new posts.
function updateDataForHtmlSection(fetchedData) {
    //Finds the html element that will hold the fetched posts by
    //searching for the given element id.
    const htmlPlaceholder = document.getElementById("jasonplaceholder");
    
    //Verify that the html element to hold the posts exist in the
    //html file.
    checkIfHtmlPlaceholderExist(htmlPlaceholder);

            //Takes the fetched posts and create the html structure
            //needed to display the posts one post at a time.
            fetchedData.forEach(fetchedElement => {

                //Create new div to hold the posts.
                const htmldiv = document.createElement('div');
                //Add the elements to the div.
                htmldiv.classList.add('fetchedElement');

                //Create heading and paragraph for the html
                //that will hold the title and content of each post.
                const heading = document.createElement('h2');
                const paragraph = document.createElement('p');

                //Initialize heading and paragraph with content of the post.
                heading.textContent = fetchedElement.title;
                paragraph.textContent = fetchedElement.body;

                //Append the heading and paragraph to the div "fetchedElement"
                //that was created earlier.
                htmldiv.appendChild(heading);
                htmldiv.appendChild(paragraph);

                //Append the div that was created earlier to the intended
                //html element in the html file.
                htmlPlaceholder.appendChild(htmldiv);
            });
}

//Ensures that the html needed to show posts is present in the html file.
function checkIfHtmlPlaceholderExist(htmlPlaceholder) {
    if (!htmlPlaceholder) {
        console.error('No element found with id "jasonplaceholder" in HTML file');
        return;
    }
}

//Based on the screen heigth, new posts are loaded if the the website page is
//scrolled to the bottom.
//This helped me implement so that content loaded when the webpage is scrolled:
//https://www.linkedin.com/pulse/implementing-infinite-scrolling-html-javascript-volodymyr-zhyliaev-wtmne/
function loadWithScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        getPostsFromJsonPlaceholder();
    }
}

//When the dynamic objects modules have been loaded, get the ferst 3 posts
//then wait for the page to be scrolled before loading the next 3 posts.
document.addEventListener("DOMContentLoaded", () => {
    getPostsFromJsonPlaceholder();
    window.addEventListener('scroll', loadWithScroll);
});