        /* Program - FindTheMovie */
        /* Author - Samanth Annaiah */
        /* Initial Release Date - 28 December 2022  */
        /* Version - version-4, 30 December 2022*/
        /* Version - version-5, 02 January 2022*/
        /*  Using the publicly available TMDB API, we have implemented a simple straight forward movie search application.
        Find information about your favorite movie  and enjoy!!
        - As soon as the app is opened the  top 20 trending movies will be displayed.
        - Next, once we search for a movie, all the available movies that have  that keyword in their title will be displayed.*/
        let sub_api = 0
        let ccount = 4
        let page_count = 19
        let searchapiurl = " "
        const dop = "Director of Photography"
        const omc = "Original Music Composer"

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
            mdata_vd = []
            /* Below is the API URL to pull the top 20 trending movies in the world*/
            let pinurl = "https://api.themoviedb.org/3/discover/movie?api_key=047b539e360a4ef948b20ca485f87ce8&&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate"
            fetch(pinurl)
                .then(response => response.json())
                .then(data => {
                    /* mdata will store the records of trending movies */
                    mdata = data
                    return data;
                })
                /* Each record from the data.results array is read to get the unique movie-id. Using the 
                   movie-id we will then read another end-point to get more details of that corresponding movie.
                        - Now, the API should be read as many times as the number of movie-ids. Hence we need to iterate through the 
                        movie-ids.
                        - The iteration is achieved using array.map 
                        - Using Promise.all and async-await we make sure to wait until all the fetch promises of the api read are 
                        fulfilled. 
                        - We need to use async-await because we need all the data to be read completely from the APIs to proceed
                        further. */
                // .then(async data => {
                // await Promise.all(data.results.map((e, index, array) => {
                //     let vurl = "https://api.themoviedb.org/3/movie/" + e.id + "/videos?api_key=047b539e360a4ef948b20ca485f87ce8"
                //     let apiurl = "https://api.themoviedb.org/3/movie/" + e.id + "?api_key=047b539e360a4ef948b20ca485f87ce8"
                //     return fetch(apiurl)
                //         .then(response => response.json())
                //         .then(data => {
                //             array[index] = {
                //                 ...e,
                //                 ...data
                //             };
                //             /* mdata_rt will store the additional information of records on trending movies */
                //             mdata_rt[index] = data
                //         })
                // }));
                // dataProcess()
                .then(async data => {
                    await Promise.all(data.results.map(getccr))
                    dataProcess()
                })
                .catch((error) => {
                    window.alert('Invalid response ' + error, error);
                });
        }

        function getccr(e, index, array) {
            let apiurl = "https://api.themoviedb.org/3/movie/" + e.id + "?api_key=047b539e360a4ef948b20ca485f87ce8"
            return fetch(apiurl)
                .then(response => response.json())
                .then(data => {
                    mdata_rt[index] = data
                })
                .then(async data => {
                    /* mdata_rt will store the additional information of records on trending movies */
                    await Promise.all(mdata_rt.map(getVideo))
                    // console.log('ccr',mdata_rt[index])
                })
        }

        function getVideo(e, index, array) {
            let vurl = "https://api.themoviedb.org/3/movie/" + e.id + "/videos?api_key=047b539e360a4ef948b20ca485f87ce8"
            return fetch(vurl)
                .then(response => response.json())
                .then(data => {
                    array[index] = {
                        ...e,
                        ...data
                    };
                    /* mdata_rt will store the additional information of records on trending movies */
                    mdata_vd[index] = data
                    // console.log('video', mdata_vd[index])
                })
        }


        function dataProcess() {
            postProcess(mdata, mdata_rt, mdata_vd)
        }

        function postProcess(mdata, mdata_rt, mdata_vd) {
            let mcontent = mdata.results
            if (mcontent.length == 0) {
                window.alert("Movie(s) not found")
                return
            }
            let movie_data = document.getElementById("info_data")
            movie_data.innerHTML = ""

            /* Iterate through all the records obtained from API and populate them in the corresponding 
            html element(s)*/
            // for (let j = 0; j < mdata_vd.length; j++) {
            //     let mvd = mdata_vd[j].results
            //     let len = mdata_vd[j].results.length
            //     for (let r = 0; r < len; r++) {
            //         if ((mvd[r].type == "Trailer") || (mvd[r].type == "Official trailer")) {
            //             console.log(mvd[r].name + " " + mvd[r].type)
            //             console.log('video-link', "https://www.youtube.com/watch?v=" + mvd[r].key)
            //             break
            //         }
            //     }
            // }
            for (let k = 0; k < mcontent.length; k++) {
                movie.movie_init

                /* Exit if the movie poster is not found */
                let temp_img = mcontent[k].poster_path
                if (!temp_img) {
                    continue
                }

                let movie_card = document.createElement("div")
                movie_card.classList.add("movie_card")
                movie_card.innerHTML = ""

                /* Loading the genre color into the card background.*/
                movie.movie_genre = mcontent[k].genre_ids[0]
                let tmgn = movie.movie_genre
                let movie_ccolor = ""
                if (!tmgn) {
                    movie_card.style.backgroundColor = "#C39B"
                    movie_ccolor = "#C39B"
                } else {
                    movie_card.style.backgroundColor = movie.movie_genre_color(movie.movie_genre)
                    movie_ccolor = movie.movie_genre_color(movie.movie_genre)
                }
                movie_card.style.boxShadow = movie_ccolor + " 0px 5px 10px 2px"

                /* Loading the movie poster */
                movie.movie_image = document.createElement("img")
                temp_img = ""
                temp_img = mimg + mcontent[k].poster_path
                movie.movie_image.src = temp_img
                movie_card.appendChild(movie.movie_image)

                /* Loading the release date of the movie */
                movie.movie_rel = document.createElement("p")
                movie.movie_rel.classList.add("reldate")
                let temp_rel = mcontent[k].release_date
                if (temp_rel) {
                    movie.movie_rel.textContent = movie.movie_rel_date(temp_rel)
                } else {
                    movie.movie_rel.textContent = "NA/TBA"
                }
                movie_card.appendChild(movie.movie_rel)

                let movie_row1 = document.createElement("div")
                movie_row1.classList.add("movie_row1")

                /* Loading the run-time of the movie */
                let movie_rt = document.createElement("div")
                movie_rt.classList.add("t1")
                movie_rt.textContent = mdata_rt[k].runtime + "mins"
                movie_row1.appendChild(movie_rt)

                /* Loading the movie rating */
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

                /* Loading the movie language  */
                movie.movie_lang = document.createElement("p")
                movie.movie_lang.classList.add("t1")
                let temp_lan = mdata_rt[k].original_language
                let languageNames = new Intl.DisplayNames(['en'], {
                    type: 'language'
                });
                let lang_name = languageNames.of(temp_lan.trim());
                movie.movie_lang.textContent = lang_name
                movie_card.appendChild(movie.movie_lang)

                let movie_row2 = document.createElement("div")
                movie_row2.classList.add("movie_row2")

                /* Loading the movie title and tag line  */
                let movie_rt3 = document.createElement("div")
                movie_rt3.classList.add("hidden")
                movie_rt3.classList.add("titleid")
                let full_title = ""
                if (mdata_rt[k].tagline) {
                    full_title = mdata_rt[k].original_title + " : " + mdata_rt[k].tagline
                } else {
                    full_title = mdata_rt[k].original_title
                }
                movie_rt3.textContent = full_title
                movie_row2.appendChild(movie_rt3)

                /* Loading the movie-id */
                let movie_rt4 = document.createElement("div")
                movie_rt4.classList.add("hidden")
                movie_rt4.classList.add("movieid")
                movie.movie_id = mcontent[k].id
                movie_rt4.textContent = movie.movie_id
                movie_row2.appendChild(movie_rt4)

                /* Button which when clicked displays the overview/plot of the movie */
                let movie_ovr = document.createElement("button")
                movie_ovr.classList.add("button-24")
                movie_ovr.setAttribute("role", "button")
                movie_ovr.addEventListener('click', function (e) {
                    var target = e.target
                    getOvr(target)
                }, false);
                movie_ovr.textContent = "Overview"
                movie_row2.appendChild(movie_ovr)

                let movie_rt2 = document.createElement("div")
                movie_rt2.classList.add("hidden")
                movie_rt2.classList.add("overviewid")
                movie_rt2.textContent = mdata_rt[k].overview
                movie_row2.appendChild(movie_rt2)

                let movie_ccr = document.createElement("button")
                movie_ccr.classList.add("button-24")
                movie_ccr.setAttribute("role", "button")
                movie_ccr.addEventListener('click', function (e) {
                    var target = e.target
                    getCcr(target)
                }, false);
                movie_ccr.textContent = "Cast&Crew"
                movie_row2.appendChild(movie_ccr)

                movie_card.appendChild(movie_row2)

                let mvd = mdata_vd[k].results
                let len = mdata_vd[k].results.length
                let vurl = ""
                for (let r = 0; r < len; r++) {
                    if (((mvd[r].type == "Trailer") || (mvd[r].type == "Official trailer")) || (len == 1)) {
                        console.log(mvd[r].name + " " + mvd[r].type)
                        vurl = "https://www.youtube.com/watch?v=" + mvd[r].key
                        break
                    }
                }
                if (len != 0) {
                    let movie_row3 = document.createElement('div')
                    movie_row3.classList.add("movie_row3")
                    movie_row3.classList.add("t2")
                    let adata = document.createElement('a')
                    adata.setAttribute("href", vurl)
                    adata.setAttribute("target", "_blank")
                    let youtubelogo = "images/ytlogo.svg"
                    let idata = document.createElement('img')
                    idata.setAttribute("src", youtubelogo)
                    idata.setAttribute("height", "70")
                    idata.setAttribute("width", "100")
                    adata.appendChild(idata)
                    movie_row3.appendChild(adata)
                    movie_card.appendChild(movie_row3)
                }
                // getVideo(k) 
                movie_data.appendChild(movie_card)
            }
        }

        // function getVideo(ck) {
        //     let vid_obj = mdata_vd[ck]
        //     let vid = vid_obj.results
        //     if (vid.length > 0) {
        //         for (let k = 0; k < vid.length; k++) {
        //             if (vid.type.search(/Trailer/i) || vid.type.search(/Official+trailer/i)) {
        //                 console.log('video-link', "https://www.youtube.com/watch?v=" + vid.type)
        //                 break
        //             }
        //         }
        //     }
        // }

        function getOvr(tgt) {
            /* The MODAL feature of Bootstrap is used to display the  movie-title and overview information, in a pop-up window */
            let parent = tgt.parentElement
            let temp_title = parent.querySelector(".titleid").textContent
            let temp_overview = parent.querySelector(".overviewid").textContent
            let overview = temp_overview.trim()
            let titlem = temp_title.trim()
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

        function getCcr(cgt) {
            let apiurl = "https://api.themoviedb.org/3/movie/"
            let apiendpoint = "/credits?api_key=047b539e360a4ef948b20ca485f87ce8"
            let parent = cgt.parentElement
            let temp_mid = parent.querySelector(".movieid").textContent
            temp_mid = temp_mid.trim()
            let apiline = apiurl + temp_mid + apiendpoint
            fetch(apiline)
                .then(response => response.json())
                .then((data) => {
                    processCcr(data, cgt)
                })
                .catch((error) => {
                    window.alert('Invalid response ' + error, error);
                });
        }

        function processCcr(data, cgt) {
            let parent = cgt.parentElement
            let temp_title = parent.querySelector(".titleid").textContent
            let titlem = temp_title.trim()
            let mtitle = document.getElementById("modalTitle")
            mtitle.textContent = titlem
            mtitle.classList.add("mtitle")

            let ccdata = document.createElement("table")
            let ccdata1 = document.createElement("table")

            let ptr1 = document.createElement("tr")
            let ptd1 = document.createElement("td")
            ptd1.classList.add("bg-success")
            ptd1.classList.add("text-center")
            ptd1.textContent = "CAST"
            ptr1.appendChild(ptd1)
            ccdata.appendChild(ptr1)

            let ptr2 = document.createElement("tr")
            let ptd2 = document.createElement("td")
            ptd2.classList.add("bg-success")
            ptd2.classList.add("text-center")
            ptd2.textContent = "CREW"
            ptr2.appendChild(ptd2)
            ccdata1.appendChild(ptr2)

            for (let k = 0; k <= ccount; k++) {
                let ptr = document.createElement("tr")
                if (data.cast[k]) {
                    let ptd1 = document.createElement("td")
                    ptd1.textContent = data.cast[k].name
                    ptr.appendChild(ptd1)
                }
                ccdata.appendChild(ptr)
            }

            for (let k = 0; k <= ccount; k++) {
                let ptr = document.createElement("tr")
                if (data.crew[k]) {
                    let ptd2 = document.createElement("td")
                    let sp1 = document.createElement("span")
                    sp1.classList.add("t2")
                    sp1.textContent = data.crew[k].job + " " + "-" + " "
                    if (data.crew[k].job.trim() == dop) {
                        sp1.textContent = "DOP" + " " + "-" + " "
                    }
                    if (data.crew[k].job.trim() == omc) {
                        sp1.textContent = "Original Music" + " " + "-" + " "
                    }
                    let sp2 = document.createElement("span")
                    sp2.textContent = data.crew[k].name
                    ptd2.appendChild(sp1)
                    ptd2.appendChild(sp2)
                    ptr.appendChild(ptd2)
                }
                ccdata1.appendChild(ptr)
            }

            let mbody = document.getElementById("modalBody")
            mbody.innerHTML = ""
            let ccdata_div = document.createElement("div")
            ccdata_div.appendChild(ccdata)
            let ccdata_div1 = document.createElement("div")
            ccdata_div1.appendChild(ccdata1)
            mbody.appendChild(ccdata_div)
            mbody.appendChild(ccdata_div1)
            mbody.classList.add("t1")
            var myModal = new bootstrap.Modal(document.getElementById("modalOvr"));
            myModal.show();
        }

        /* Once the user enters a keyword of the movie to search the below function will be executed  */
        async function searchkey() {

            mdata = ""
            mdata_rt = []
            mdata_vd = []
            searchapiurl = " "
            let keyword_inp = document.getElementById("keyword")
            let keyword = keyword_inp.value
            keyword = keyword.trim()
            /* Below API url uses the keyword to search for the movie*/
            let apiurlstart = "https://api.themoviedb.org/3/search/movie?api_key=047b539e360a4ef948b20ca485f87ce8&query="
            let apiparam = "&page=1&include_adult=false"
            searchapiurl = apiurlstart + keyword + apiparam
            fetch(searchapiurl)
                .then(response => response.json())
                .then(data => {
                    mdata = data
                    return data;
                })
                // .then(async data => {
                /* Like previously, the data obtained from the previous search is then looped for the movie-id
                and then further information is obtained using the array.map, promise.all, async-await*/
                // await Promise.all(data.results.map((e, index, array) => {
                //     let apiurl = "https://api.themoviedb.org/3/movie/" + e.id + "?api_key=047b539e360a4ef948b20ca485f87ce8"
                //     return fetch(apiurl)
                //         .then(response => response.json())
                //         .then(data => {
                //             array[index] = {
                //                 ...e,
                //                 ...data
                //             };
                //             mdata_rt[index] = data
                //         })
                // }));
                .then(async data => {
                    await Promise.all(data.results.map(getccr))
                    dataProcess()
                })
                .catch((error) => {
                    window.alert('Invalid response ' + error, error);
                });

            // dataProcess()
            // });
        }