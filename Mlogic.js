let main_var = "Y"
let sub_api = 0
let page_count = 19
var frombutton = 0 
let searchapiurl = " "

let keysearch_1 = document.getElementById("keysearch")
keysearch_1.addEventListener("click", searchkey)
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const genres = new Map([
    [28, "Action"],
    [12, "Adventure"],
    [16, "Animation"],
    [35, "Comedy"],
    [80, "Crime"],
    [99, "Documentary"],
    [18, "Drama"],
    [10751, "Family"],
    [14, "Fantasy"],
    [36, "History"],
    [27, "Horror"],
    [10402, "Music"],
    [9648, "Mystery"],
    [10749, "Romance"],
    [878, "Science Fiction"],
    [10770, "TV Movie"],
    [53, "Thriller"],
    [10752, "War"],
    [37, "Western"]
])
const genres_colors = new Map([
    [28, "#26de81"],
    [12, "#ffeaa7"],
    [16, "#fed330"],
    [35, "#FF0069"],
    [80, "#30336b"],
    [99, "hsla(27, 84%, 44%, 1)"],
    [18, "#81ecec"],
    [10751, "#00b894"],
    [14, "#EFB549"],
    [36, "#a55eea"],
    [27, "#EE6756"],
    [10402, "#95afc0"],
    [9648, "#6c5ce7"],
    [10749, "#C39bfe"],
    [878, "#C39B"],
    [53, "#956765"],
    [10770, "#0190FF"],
    [10752, "#0190c0"],
    [37, "#01919c"]
])
const mimg = "https://image.tmdb.org/t/p/w200"
let mdata = ""
let mdata_rt = []

let movie = {
    movie_id: 0,
    movie_image: " ",
    movie_rel: " ",
    movie_lang: " ",
    movie_time: 0,
    movie_rating: 0,
    movie_votes: 0,
    movie_mrtrv: [],
    movie_init: function () {
        this.movie_id = 0
        this.movie_image = " "
        this.movie_rel = " "
        this.movie_lang = " "
        this.movie_time = 0
        this.movie_rating = 0
        this.movie_votes = 0
        this.movie_mrtrv = []
    },
    movie_rel_date: function (dte) {
        let relDate = new Date(dte)
        let relmonth = relDate.getMonth()
        let mrel = relDate.getDate() + " " + months[relmonth] + " " + relDate.getFullYear()
        return mrel
    },
    movie_genre: function (gen) {
        let genre = genres.get(gen)
        return genre
    },
    movie_genre_color: function (gen) {
        let genre_color = genres_colors.get(gen)
        return genre_color
    }
}
let pinurl = "https://api.themoviedb.org/3/discover/movie?api_key=047b539e360a4ef948b20ca485f87ce8&&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate"
let mainvar = mainLoad(pinurl)
mainvar
    .then((data) => {
        mdata = ""
        mdata_rt = []
        sub_api = 0
        mdata = data
        data = ""
        const mid_api = "https://api.themoviedb.org/3/movie/"
        for (let k = 0; k < mdata.results.length; k++) {
            let mid_id = mdata.results[k].id
            const api_key = "?api_key=047b539e360a4ef948b20ca485f87ce8"
            let api_url = mid_api + mid_id + api_key
            let subvar = getMoviert(api_url)
            subvar
                .then((data) => mdata_rt[k] = data)
                .catch((error) => {
                    window.alert('Invalid response ' + error, error)
                })
                .finally(() => {
                    if (sub_api > page_count) {
                        postProcess(mdata, mdata_rt)
                    }
                });
        }
    })

    .catch((error) => {
        window.alert(error)
    })

async function mainLoad(prl) {
    if (frombutton == 1 ) {
        frombutton = 0
        prl = searchapiurl
    }
    let response = ""
    response = await fetch(prl)
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        throw new error(error)
    }
}

async function keysearchLoad(krl) {
    let response = ""
    response = await fetch(krl) 
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        throw new error(error)
    }
}

async function getMoviert(apiurl) {
    let response = await fetch(apiurl)
    if (response.ok) {
        const data = await response.json()
        sub_api++
        return data
    } else {
        throw new error(error)
    }
}

async function getMoviesrc(apiurl) {
    let response = ""
    response = await fetch(apiurl)
    if (response.ok) {
        const data = await response.json()
        sub_api++
        return data
    } else {
        throw new error(error)
    }
}

async function searchkey() {

    frombutton = 1
    searchapiurl = " "
    let keyword_inp = document.getElementById("keyword")
    let keyword = keyword_inp.value
    keyword = keyword.trim()
    let apiurlstart = "https://api.themoviedb.org/3/search/movie?api_key=047b539e360a4ef948b20ca485f87ce8&query="
    let apiparam = "&page=1&include_adult=false"
    searchapiurl = apiurlstart + keyword + apiparam
    fetch(searchapiurl)
        .then((response) => response.json())
        .then((data) => console.log(data));

    // let mvar = await keysearchLoad(apiurl)
    // mvar
    //     .then((data) => {
    //         mdata = ""
    //         mdata_rt = []
    //         sub_api = 0
    //         mdata = data
    //         let len = mdata.results.length
    //         data = ""
    //         const mid_api = "https://api.themoviedb.org/3/movie/"
    //         for (let k = 0; k < mdata.results.length; k++) {
    //             let mid_id = mdata.results[k].id
    //             const api_key = "?api_key=047b539e360a4ef948b20ca485f87ce8"
    //             let api_url = mid_api + mid_id + api_key
    //             let subvar = getMoviesrc(api_url)
    //             subvar
    //                 .then((data) => mdata_rt[k] = data)
    //                 .catch((error) => {
    //                     window.alert('Invalid response ' + error, error)
    //                 })
    //                 .finally(() => {
    //                     if (sub_api > len) {
    //                         postProcess(mdata, mdata_rt)
    //                     }
    //                 });
    //         }
    //     })
}

function postProcess(mdata, mdata_rt) {
    let mcontent = mdata.results
    let movie_data = document.getElementById("info_data")
    movie_data.innerHTML = ""

    for (let k = 0; k < mcontent.length; k++) {
        movie.movie_init

        let movie_card = document.createElement("div")
        movie_card.classList.add("movie_card")
        movie_card.innerHTML = ""

        movie.movie_genre = mcontent[k].genre_ids[0]
        movie_card.style.backgroundColor = movie.movie_genre_color(movie.movie_genre)

        movie.movie_image = document.createElement("img")
        let temp_img = mimg + mcontent[k].poster_path
        movie.movie_image.src = temp_img
        movie_card.appendChild(movie.movie_image)

        movie.movie_rel = document.createElement("p")
        movie.movie_rel.classList.add("reldate")
        let temp_rel = mcontent[k].release_date
        movie.movie_rel.textContent = movie.movie_rel_date(temp_rel)
        movie_card.appendChild(movie.movie_rel)

        let movie_row1 = document.createElement("div")
        movie_row1.classList.add("movie_row1")

        let movie_rt = document.createElement("div")
        movie_rt.classList.add("t1")
        movie_rt.textContent = mdata_rt[k].runtime + "mins"
        movie_row1.appendChild(movie_rt)

        let movie_rt1 = document.createElement("div")
        movie_rt1.classList.add("t1")
        movie_rt1.classList.add("r1")
        movie.movie_rating = mcontent[k].vote_average
        movie_rt1.textContent = movie.movie_rating
        movie_row1.appendChild(movie_rt1)

        movie_card.appendChild(movie_row1)

        movie_data.appendChild(movie_card)
    }
}