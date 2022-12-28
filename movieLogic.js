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

mainProcess()

async function mainProcess() {
    mdata = ""
    mdata_rt = []
    let pinurl = "https://api.themoviedb.org/3/discover/movie?api_key=047b539e360a4ef948b20ca485f87ce8&&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate"
    fetch(pinurl)
        .then(response => response.json())
        .then(data => {
            mdata = data
            return data;
        })
        .then(async data => {
            await Promise.all(data.results.map((e, index, array) => {
                let apiurl = "https://api.themoviedb.org/3/movie/" + e.id + "?api_key=047b539e360a4ef948b20ca485f87ce8"
                return fetch(apiurl)
                    .then(response => response.json())
                    .then(data => {
                        array[index] = {
                            ...e,
                            ...data
                        };
                        mdata_rt[index] = data
                    })
            }));
            dataProcess()
        });
}

function dataProcess() {
    postProcess(mdata, mdata_rt)
}

function postProcess(mdata, mdata_rt) {
    let mcontent = mdata.results
    if (mcontent.length == 0) {
        window.alert("Movie(s) not found")
        return 
    }
    let movie_data = document.getElementById("info_data")
    movie_data.innerHTML = ""

    for (let k = 0; k < mcontent.length; k++) {
        movie.movie_init

        let temp_img = mcontent[k].poster_path
        if (!temp_img) {
            continue 
        }

        let movie_card = document.createElement("div")
        movie_card.classList.add("movie_card")
        movie_card.innerHTML = ""

        movie.movie_genre = mcontent[k].genre_ids[0]
        let tmgn = movie.movie_genre
        let movie_ccolor = ""
        if (!tmgn) {
            movie_card.style.backgroundColor = "#C39B" 
            movie_ccolor = "#C39B"
        }else {
            movie_card.style.backgroundColor = movie.movie_genre_color(movie.movie_genre)
            movie_ccolor = movie.movie_genre_color(movie.movie_genre)
        }
        movie_card.style.boxShadow = movie_ccolor + " 0px 5px 10px 2px"

        movie.movie_image = document.createElement("img")
        temp_img = ""
        temp_img = mimg + mcontent[k].poster_path
        movie.movie_image.src = temp_img
        movie_card.appendChild(movie.movie_image)

        movie.movie_rel = document.createElement("p")
        movie.movie_rel.classList.add("reldate")
        let temp_rel = mcontent[k].release_date
        if (temp_rel) {
            movie.movie_rel.textContent = movie.movie_rel_date(temp_rel)
        }
        else {
            movie.movie_rel.textContent = "NA/TBA"
        }
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
        let mr_num = Number(movie.movie_rating) 
        mr_num = mr_num.toFixed(1) 
        movie.movie_rating = mr_num 
        movie_rt1.textContent = movie.movie_rating
        movie_row1.appendChild(movie_rt1)

        movie_card.appendChild(movie_row1)

        movie.movie_lang = document.createElement("p")
        movie.movie_lang.classList.add("t1")
        let temp_lan = mdata_rt[k].original_language
        let languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
        let lang_name = languageNames.of(temp_lan.trim());
        movie.movie_lang.textContent = lang_name 
        movie_card.appendChild(movie.movie_lang)

        let movie_row2 = document.createElement("div")
        movie_row2.classList.add("movie_row1")

        let movie_rt3 = document.createElement("div")
        movie_rt3.classList.add("hidden")
        let full_title = ""
        if (mdata_rt[k].tagline) {
            full_title = mdata_rt[k].original_title + " : " + mdata_rt[k].tagline  
        } else {
            full_title = mdata_rt[k].original_title 
        }
        movie_rt3.textContent = full_title 
        movie_row2.appendChild(movie_rt3)
        
        let movie_ovr = document.createElement("button")
        movie_ovr.classList.add("button-24")
        movie_ovr.setAttribute("role","button") 
        // movie_ovr.addEventListener("click", getOvr)
        movie_ovr.addEventListener('click', function(e) {
            var target = e.target
            console.log(target) 
            getOvr(target)
        }, false);
        movie_ovr.textContent = "Overview"
        movie_row2.appendChild(movie_ovr)

        let movie_rt2 = document.createElement("div")
        movie_rt2.classList.add("hidden")
        movie_rt2.textContent = mdata_rt[k].overview 
        movie_row2.appendChild(movie_rt2)

        movie_card.appendChild(movie_row2)

        movie_data.appendChild(movie_card)
    }
}

function getOvr(tgt) {
    let overview = tgt.nextSibling.textContent
    let titlem = tgt.previousSibling.textContent 
    overview = overview.trim()
    let mtitle = document.getElementById("modalTitle") 
    mtitle.textContent = titlem 
    mtitle.classList.add("mtitle")
    let mbody = document.getElementById("modalBody")
    mbody.textContent = ""
    mbody.textContent = overview 
    mbody.classList.add("t1")
    var myModal = new bootstrap.Modal(document.getElementById("modalOvr"));
    myModal.show();
}

async function searchkey() {

    mdata = ""
    mdata_rt = []
    frombutton = 1
    searchapiurl = " "
    let keyword_inp = document.getElementById("keyword")
    let keyword = keyword_inp.value
    keyword = keyword.trim()
    let apiurlstart = "https://api.themoviedb.org/3/search/movie?api_key=047b539e360a4ef948b20ca485f87ce8&query="
    let apiparam = "&page=1&include_adult=false"
    searchapiurl = apiurlstart + keyword + apiparam
    fetch(searchapiurl)
        .then(response => response.json())
        .then(data => {
            mdata = data
            return data;
        })
        .then(async data => {
            await Promise.all(data.results.map((e, index, array) => {
                let apiurl = "https://api.themoviedb.org/3/movie/" + e.id + "?api_key=047b539e360a4ef948b20ca485f87ce8"
                return fetch(apiurl)
                    .then(response => response.json())
                    .then(data => {
                        array[index] = {
                            ...e,
                            ...data
                        };
                        mdata_rt[index] = data
                    })
            }));

            dataProcess()
        });
}