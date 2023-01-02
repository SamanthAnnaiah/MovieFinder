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
        .then(async data => {
            await Promise.all(data.results.map(getccr), data.results.map(getVideo))  
            // dataProcess()
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
            array[index] = {
                ...e,
                ...data
            };
            /* mdata_rt will store the additional information of records on trending movies */
            mdata_rt[index] = data
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
        })
}

// function getVideo(ck) {
//     let vid_obj = mdata_vd[ck]
//     let vid = vid_obj.results
//     if (vid.length > 0) {
//         for (let k = 0; k < vid.length; k++) {
//             if (vid.type.search(/trailer/i)) {
//                 console.log('video-link', "https://www.youtube.com/watch?v=" + vid.type)
//             }
//         }
//     }
// }