/** Browse catalog display metadata — no Spotify URLs (resolved via API seed + search fallback). */

export interface AlbumMetadata {
  id: string;
  title: string;
  artist: string;
  releaseYear: number;
  genre: string;
  imageUrl: string;
}

export interface TrackMetadata {
  id: string;
  title: string;
  albumId: string;
  durationSeconds: number;
}

export interface ArtistMetadata {
  id: string;
  name: string;
  genre: string;
  imageUrl: string;
}

export interface PlaylistMetadata {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export const ALBUM_METADATA: AlbumMetadata[] = [
  {
    "id": "am",
    "title": "AM",
    "artist": "Arctic Monkeys",
    "releaseYear": 2013,
    "genre": "Indie Rock",
    "imageUrl": "/images/albums/am.jpg"
  },
  {
    "id": "favourite-worst-nightmare",
    "title": "Favourite Worst Nightmare",
    "artist": "Arctic Monkeys",
    "releaseYear": 2007,
    "genre": "Indie Rock",
    "imageUrl": "/images/albums/favourite-worst-nightmare.jpg"
  },
  {
    "id": "tranquility-base",
    "title": "Tranquility Base Hotel & Casino",
    "artist": "Arctic Monkeys",
    "releaseYear": 2018,
    "genre": "Indie Rock",
    "imageUrl": "/images/albums/tranquility-base.jpg"
  },
  {
    "id": "the-car",
    "title": "The Car",
    "artist": "Arctic Monkeys",
    "releaseYear": 2022,
    "genre": "Indie Rock",
    "imageUrl": "/images/albums/the-car.jpg"
  },
  {
    "id": "currents",
    "title": "Currents",
    "artist": "Tame Impala",
    "releaseYear": 2015,
    "genre": "Psychedelic Pop",
    "imageUrl": "/images/albums/currents.jpg"
  },
  {
    "id": "the-slow-rush",
    "title": "The Slow Rush",
    "artist": "Tame Impala",
    "releaseYear": 2020,
    "genre": "Psychedelic Pop",
    "imageUrl": "/images/albums/the-slow-rush.jpg"
  },
  {
    "id": "after-hours",
    "title": "After Hours",
    "artist": "The Weeknd",
    "releaseYear": 2020,
    "genre": "R&B",
    "imageUrl": "/images/albums/after-hours.jpg"
  },
  {
    "id": "dawn-fm",
    "title": "Dawn FM",
    "artist": "The Weeknd",
    "releaseYear": 2022,
    "genre": "R&B",
    "imageUrl": "/images/albums/dawn-fm.jpg"
  },
  {
    "id": "melodrama",
    "title": "Melodrama",
    "artist": "Lorde",
    "releaseYear": 2017,
    "genre": "Pop",
    "imageUrl": "/images/albums/melodrama.jpg"
  },
  {
    "id": "random-access-memories",
    "title": "Random Access Memories",
    "artist": "Daft Punk",
    "releaseYear": 2013,
    "genre": "Electronic",
    "imageUrl": "/images/albums/random-access-memories.jpg"
  },
  {
    "id": "midnights",
    "title": "Midnights",
    "artist": "Taylor Swift",
    "releaseYear": 2022,
    "genre": "Pop",
    "imageUrl": "/images/albums/midnights.jpg"
  },
  {
    "id": "folklore",
    "title": "folklore",
    "artist": "Taylor Swift",
    "releaseYear": 2020,
    "genre": "Alternative",
    "imageUrl": "/images/albums/folklore.jpg"
  },
  {
    "id": "1989",
    "title": "1989",
    "artist": "Taylor Swift",
    "releaseYear": 2014,
    "genre": "Pop",
    "imageUrl": "/images/albums/1989.jpg"
  },
  {
    "id": "evermore",
    "title": "evermore",
    "artist": "Taylor Swift",
    "releaseYear": 2020,
    "genre": "Alternative",
    "imageUrl": "/images/albums/evermore.jpg"
  },
  {
    "id": "sos",
    "title": "SOS",
    "artist": "SZA",
    "releaseYear": 2022,
    "genre": "R&B",
    "imageUrl": "/images/albums/sos.jpg"
  },
  {
    "id": "ctrl",
    "title": "Ctrl",
    "artist": "SZA",
    "releaseYear": 2017,
    "genre": "R&B",
    "imageUrl": "/images/albums/ctrl.jpg"
  },
  {
    "id": "blonde",
    "title": "Blonde",
    "artist": "Frank Ocean",
    "releaseYear": 2016,
    "genre": "R&B",
    "imageUrl": "/images/albums/blonde.jpg"
  },
  {
    "id": "channel-orange",
    "title": "channel ORANGE",
    "artist": "Frank Ocean",
    "releaseYear": 2012,
    "genre": "R&B",
    "imageUrl": "/images/albums/channel-orange.jpg"
  },
  {
    "id": "igor",
    "title": "IGOR",
    "artist": "Tyler, The Creator",
    "releaseYear": 2019,
    "genre": "Hip-Hop",
    "imageUrl": "/images/albums/igor.jpg"
  },
  {
    "id": "gkmc",
    "title": "good kid, m.A.A.d city",
    "artist": "Kendrick Lamar",
    "releaseYear": 2012,
    "genre": "Hip-Hop",
    "imageUrl": "/images/albums/gkmc.jpg"
  },
  {
    "id": "tpab",
    "title": "To Pimp a Butterfly",
    "artist": "Kendrick Lamar",
    "releaseYear": 2015,
    "genre": "Hip-Hop",
    "imageUrl": "/images/albums/tpab.jpg"
  },
  {
    "id": "harrys-house",
    "title": "Harry's House",
    "artist": "Harry Styles",
    "releaseYear": 2022,
    "genre": "Pop",
    "imageUrl": "/images/albums/harrys-house.jpg"
  },
  {
    "id": "fine-line",
    "title": "Fine Line",
    "artist": "Harry Styles",
    "releaseYear": 2019,
    "genre": "Pop",
    "imageUrl": "/images/albums/fine-line.jpg"
  },
  {
    "id": "astroworld",
    "title": "ASTROWORLD",
    "artist": "Travis Scott",
    "releaseYear": 2018,
    "genre": "Hip-Hop",
    "imageUrl": "/images/albums/astroworld.jpg"
  },
  {
    "id": "utopia",
    "title": "UTOPIA",
    "artist": "Travis Scott",
    "releaseYear": 2023,
    "genre": "Hip-Hop",
    "imageUrl": "/images/albums/utopia.jpg"
  },
  {
    "id": "future-nostalgia",
    "title": "Future Nostalgia",
    "artist": "Dua Lipa",
    "releaseYear": 2020,
    "genre": "Pop",
    "imageUrl": "/images/albums/future-nostalgia.jpg"
  },
  {
    "id": "is-this-it",
    "title": "Is This It",
    "artist": "The Strokes",
    "releaseYear": 2001,
    "genre": "Indie Rock",
    "imageUrl": "/images/albums/is-this-it.jpg"
  },
  {
    "id": "nfr",
    "title": "Norman Fucking Rockwell!",
    "artist": "Lana Del Rey",
    "releaseYear": 2019,
    "genre": "Pop",
    "imageUrl": "/images/albums/nfr.jpg"
  },
  {
    "id": "born-to-die",
    "title": "Born To Die",
    "artist": "Lana Del Rey",
    "releaseYear": 2012,
    "genre": "Pop",
    "imageUrl": "/images/albums/born-to-die.jpg"
  },
  {
    "id": "un-verano-sin-ti",
    "title": "Un Verano Sin Ti",
    "artist": "Bad Bunny",
    "releaseYear": 2022,
    "genre": "Reggaeton",
    "imageUrl": "/images/albums/un-verano-sin-ti.jpg"
  },
  {
    "id": "dark-side-of-the-moon",
    "title": "The Dark Side of the Moon",
    "artist": "Pink Floyd",
    "releaseYear": 1973,
    "genre": "Rock",
    "imageUrl": "/images/albums/dark-side-of-the-moon.jpg"
  },
  {
    "id": "abbey-road",
    "title": "Abbey Road",
    "artist": "The Beatles",
    "releaseYear": 1969,
    "genre": "Rock",
    "imageUrl": "/images/albums/abbey-road.jpg"
  },
  {
    "id": "rumours",
    "title": "Rumours",
    "artist": "Fleetwood Mac",
    "releaseYear": 1977,
    "genre": "Rock",
    "imageUrl": "/images/albums/rumours.jpg"
  },
  {
    "id": "lemonade",
    "title": "Lemonade",
    "artist": "Beyoncé",
    "releaseYear": 2016,
    "genre": "R&B",
    "imageUrl": "/images/albums/lemonade.jpg"
  },
  {
    "id": "thriller",
    "title": "Thriller",
    "artist": "Michael Jackson",
    "releaseYear": 1982,
    "genre": "Pop",
    "imageUrl": "/images/albums/thriller.jpg"
  },
  {
    "id": "back-to-black",
    "title": "Back to Black",
    "artist": "Amy Winehouse",
    "releaseYear": 2006,
    "genre": "Soul",
    "imageUrl": "/images/albums/back-to-black.jpg"
  },
  {
    "id": "my-beautiful-dark-twisted-fantasy",
    "title": "My Beautiful Dark Twisted Fantasy",
    "artist": "Kanye West",
    "releaseYear": 2010,
    "genre": "Hip-Hop",
    "imageUrl": "/images/albums/my-beautiful-dark-twisted-fantasy.jpg"
  },
  {
    "id": "trans-lateral",
    "title": "Lateralus",
    "artist": "Tool",
    "releaseYear": 2001,
    "genre": "Rock",
    "imageUrl": "/images/albums/trans-lateral.jpg"
  }
];

export const TRACK_METADATA: TrackMetadata[] = [
  {
    "id": "do-i-wanna-know",
    "title": "Do I Wanna Know?",
    "albumId": "am",
    "durationSeconds": 272
  },
  {
    "id": "r-u-mine",
    "title": "R U Mine?",
    "albumId": "am",
    "durationSeconds": 201
  },
  {
    "id": "505",
    "title": "505",
    "albumId": "favourite-worst-nightmare",
    "durationSeconds": 253
  },
  {
    "id": "fluorescent-adolescent",
    "title": "Fluorescent Adolescent",
    "albumId": "favourite-worst-nightmare",
    "durationSeconds": 173
  },
  {
    "id": "four-out-of-five",
    "title": "Four Out of Five",
    "albumId": "tranquility-base",
    "durationSeconds": 245
  },
  {
    "id": "mirror-ball",
    "title": "There'd Better Be A Mirror Ball",
    "albumId": "the-car",
    "durationSeconds": 270
  },
  {
    "id": "let-it-happen",
    "title": "Let It Happen",
    "albumId": "currents",
    "durationSeconds": 467
  },
  {
    "id": "the-less-i-know",
    "title": "The Less I Know The Better",
    "albumId": "currents",
    "durationSeconds": 216
  },
  {
    "id": "is-it-true",
    "title": "Is It True",
    "albumId": "the-slow-rush",
    "durationSeconds": 209
  },
  {
    "id": "borderline",
    "title": "Borderline",
    "albumId": "the-slow-rush",
    "durationSeconds": 244
  },
  {
    "id": "blinding-lights",
    "title": "Blinding Lights",
    "albumId": "after-hours",
    "durationSeconds": 200
  },
  {
    "id": "save-your-tears",
    "title": "Save Your Tears",
    "albumId": "after-hours",
    "durationSeconds": 215
  },
  {
    "id": "take-my-breath",
    "title": "Take My Breath",
    "albumId": "dawn-fm",
    "durationSeconds": 220
  },
  {
    "id": "sacrifice",
    "title": "Sacrifice",
    "albumId": "dawn-fm",
    "durationSeconds": 188
  },
  {
    "id": "green-light",
    "title": "Green Light",
    "albumId": "melodrama",
    "durationSeconds": 234
  },
  {
    "id": "liability",
    "title": "Liability",
    "albumId": "melodrama",
    "durationSeconds": 161
  },
  {
    "id": "get-lucky",
    "title": "Get Lucky",
    "albumId": "random-access-memories",
    "durationSeconds": 248
  },
  {
    "id": "instant-crush",
    "title": "Instant Crush",
    "albumId": "random-access-memories",
    "durationSeconds": 337
  },
  {
    "id": "anti-hero",
    "title": "Anti-Hero",
    "albumId": "midnights",
    "durationSeconds": 200
  },
  {
    "id": "lavender-haze",
    "title": "Lavender Haze",
    "albumId": "midnights",
    "durationSeconds": 202
  },
  {
    "id": "cardigan",
    "title": "cardigan",
    "albumId": "folklore",
    "durationSeconds": 239
  },
  {
    "id": "august",
    "title": "august",
    "albumId": "folklore",
    "durationSeconds": 261
  },
  {
    "id": "shake-it-off",
    "title": "Shake It Off",
    "albumId": "1989",
    "durationSeconds": 219
  },
  {
    "id": "willow",
    "title": "willow",
    "albumId": "evermore",
    "durationSeconds": 214
  },
  {
    "id": "kill-bill",
    "title": "Kill Bill",
    "albumId": "sos",
    "durationSeconds": 153
  },
  {
    "id": "snooze",
    "title": "Snooze",
    "albumId": "sos",
    "durationSeconds": 201
  },
  {
    "id": "love-galore",
    "title": "Love Galore",
    "albumId": "ctrl",
    "durationSeconds": 275
  },
  {
    "id": "nights",
    "title": "Nights",
    "albumId": "blonde",
    "durationSeconds": 307
  },
  {
    "id": "thinkin-bout-you",
    "title": "Thinkin Bout You",
    "albumId": "channel-orange",
    "durationSeconds": 200
  },
  {
    "id": "earfquake",
    "title": "EARFQUAKE",
    "albumId": "igor",
    "durationSeconds": 190
  },
  {
    "id": "see-you-again",
    "title": "See You Again",
    "albumId": "igor",
    "durationSeconds": 180
  },
  {
    "id": "humble",
    "title": "HUMBLE.",
    "albumId": "gkmc",
    "durationSeconds": 177
  },
  {
    "id": "swimming-pools",
    "title": "Swimming Pools (Drank)",
    "albumId": "gkmc",
    "durationSeconds": 247
  },
  {
    "id": "alright",
    "title": "Alright",
    "albumId": "tpab",
    "durationSeconds": 219
  },
  {
    "id": "king-kunta",
    "title": "King Kunta",
    "albumId": "tpab",
    "durationSeconds": 234
  },
  {
    "id": "as-it-was",
    "title": "As It Was",
    "albumId": "harrys-house",
    "durationSeconds": 167
  },
  {
    "id": "late-night-talking",
    "title": "Late Night Talking",
    "albumId": "harrys-house",
    "durationSeconds": 178
  },
  {
    "id": "watermelon-sugar",
    "title": "Watermelon Sugar",
    "albumId": "fine-line",
    "durationSeconds": 174
  },
  {
    "id": "sicko-mode",
    "title": "SICKO MODE",
    "albumId": "astroworld",
    "durationSeconds": 312
  },
  {
    "id": "goosebumps",
    "title": "goosebumps",
    "albumId": "astroworld",
    "durationSeconds": 243
  },
  {
    "id": "fein",
    "title": "FE!N",
    "albumId": "utopia",
    "durationSeconds": 228
  },
  {
    "id": "dont-start-now",
    "title": "Don't Start Now",
    "albumId": "future-nostalgia",
    "durationSeconds": 183
  },
  {
    "id": "levitating",
    "title": "Levitating",
    "albumId": "future-nostalgia",
    "durationSeconds": 203
  },
  {
    "id": "last-nite",
    "title": "Last Nite",
    "albumId": "is-this-it",
    "durationSeconds": 193
  },
  {
    "id": "someday",
    "title": "Someday",
    "albumId": "is-this-it",
    "durationSeconds": 183
  },
  {
    "id": "video-games",
    "title": "Video Games",
    "albumId": "born-to-die",
    "durationSeconds": 281
  },
  {
    "id": "summertime-sadness",
    "title": "Summertime Sadness",
    "albumId": "born-to-die",
    "durationSeconds": 264
  },
  {
    "id": "venice-bitch",
    "title": "Venice Bitch",
    "albumId": "nfr",
    "durationSeconds": 579
  },
  {
    "id": "me-porto-bonito",
    "title": "Me Porto Bonito",
    "albumId": "un-verano-sin-ti",
    "durationSeconds": 178
  },
  {
    "id": "time",
    "title": "Time",
    "albumId": "dark-side-of-the-moon",
    "durationSeconds": 413
  },
  {
    "id": "come-together",
    "title": "Come Together",
    "albumId": "abbey-road",
    "durationSeconds": 259
  },
  {
    "id": "dreams",
    "title": "Dreams",
    "albumId": "rumours",
    "durationSeconds": 257
  },
  {
    "id": "hold-up",
    "title": "Hold Up",
    "albumId": "lemonade",
    "durationSeconds": 221
  },
  {
    "id": "billie-jean",
    "title": "Billie Jean",
    "albumId": "thriller",
    "durationSeconds": 294
  },
  {
    "id": "rehab",
    "title": "Rehab",
    "albumId": "back-to-black",
    "durationSeconds": 215
  },
  {
    "id": "power",
    "title": "POWER",
    "albumId": "my-beautiful-dark-twisted-fantasy",
    "durationSeconds": 292
  },
  {
    "id": "schism",
    "title": "Schism",
    "albumId": "trans-lateral",
    "durationSeconds": 431
  }
];

export const ARTIST_METADATA: ArtistMetadata[] = [
  {
    "id": "arctic-monkeys",
    "name": "Arctic Monkeys",
    "genre": "Indie Rock",
    "imageUrl": "/images/artists/arctic-monkeys.jpg"
  },
  {
    "id": "the-weeknd",
    "name": "The Weeknd",
    "genre": "R&B",
    "imageUrl": "/images/artists/the-weeknd.jpg"
  },
  {
    "id": "tame-impala",
    "name": "Tame Impala",
    "genre": "Psychedelic Pop",
    "imageUrl": "/images/artists/tame-impala.jpg"
  },
  {
    "id": "taylor-swift",
    "name": "Taylor Swift",
    "genre": "Pop",
    "imageUrl": "/images/artists/taylor-swift.jpg"
  },
  {
    "id": "sza",
    "name": "SZA",
    "genre": "R&B",
    "imageUrl": "/images/artists/sza.jpg"
  },
  {
    "id": "frank-ocean",
    "name": "Frank Ocean",
    "genre": "R&B",
    "imageUrl": "/images/artists/frank-ocean.jpg"
  },
  {
    "id": "kendrick-lamar",
    "name": "Kendrick Lamar",
    "genre": "Hip-Hop",
    "imageUrl": "/images/artists/kendrick-lamar.jpg"
  },
  {
    "id": "lorde",
    "name": "Lorde",
    "genre": "Pop",
    "imageUrl": "/images/artists/lorde.jpg"
  },
  {
    "id": "daft-punk",
    "name": "Daft Punk",
    "genre": "Electronic",
    "imageUrl": "/images/artists/daft-punk.jpg"
  },
  {
    "id": "harry-styles",
    "name": "Harry Styles",
    "genre": "Pop",
    "imageUrl": "/images/artists/harry-styles.jpg"
  },
  {
    "id": "travis-scott",
    "name": "Travis Scott",
    "genre": "Hip-Hop",
    "imageUrl": "/images/artists/travis-scott.jpg"
  },
  {
    "id": "tyler-the-creator",
    "name": "Tyler, The Creator",
    "genre": "Hip-Hop",
    "imageUrl": "/images/artists/tyler-the-creator.jpg"
  }
];

export const PLAYLIST_METADATA: PlaylistMetadata[] = [
  {
    "id": "playlist-discover-weekly",
    "title": "Discover Weekly",
    "subtitle": "Your weekly mixtape of fresh music",
    "imageUrl": "/images/playlists/discover-weekly.jpg"
  },
  {
    "id": "playlist-release-radar",
    "title": "Release Radar",
    "subtitle": "Catch all the latest from artists you follow",
    "imageUrl": "/images/playlists/release-radar.jpg"
  },
  {
    "id": "playlist-made-for-you-1",
    "title": "Indie Mixtape",
    "subtitle": "Arctic Monkeys, The Strokes, Tame Impala",
    "imageUrl": "/images/playlists/made-3.jpg"
  },
  {
    "id": "playlist-made-for-you-2",
    "title": "Night Drive",
    "subtitle": "The Weeknd, Frank Ocean, SZA",
    "imageUrl": "/images/playlists/made-4.jpg"
  },
  {
    "id": "playlist-made-for-you-3",
    "title": "Pop Essentials",
    "subtitle": "Taylor Swift, Harry Styles, Dua Lipa",
    "imageUrl": "/images/playlists/made-5.jpg"
  },
  {
    "id": "playlist-made-for-you-4",
    "title": "Hip-Hop Headlines",
    "subtitle": "Kendrick Lamar, Tyler, The Creator, Travis Scott",
    "imageUrl": "/images/playlists/made-6.jpg"
  },
  {
    "id": "playlist-made-for-you-5",
    "title": "Classic Rock",
    "subtitle": "Pink Floyd, Fleetwood Mac, The Beatles",
    "imageUrl": "/images/playlists/made-7.jpg"
  },
  {
    "id": "playlist-made-for-you-6",
    "title": "Soul & R&B",
    "subtitle": "Beyoncé, Amy Winehouse, Frank Ocean",
    "imageUrl": "/images/playlists/made-8.jpg"
  },
  {
    "id": "playlist-made-for-you-7",
    "title": "Electronic Dreams",
    "subtitle": "Daft Punk, Tame Impala, Lorde",
    "imageUrl": "/images/playlists/made-7.jpg"
  },
  {
    "id": "playlist-made-for-you-8",
    "title": "Global Hits",
    "subtitle": "Bad Bunny, Dua Lipa, The Weeknd",
    "imageUrl": "/images/playlists/made-8.jpg"
  },
  {
    "id": "playlist-daily-mix-1",
    "title": "Daily Mix 1",
    "subtitle": "Made for you · updated daily",
    "imageUrl": "/images/playlists/daily-mix-1.jpg"
  },
  {
    "id": "playlist-daily-mix-2",
    "title": "Daily Mix 2",
    "subtitle": "Made for you · updated daily",
    "imageUrl": "/images/playlists/daily-mix-2.jpg"
  },
  {
    "id": "playlist-daily-mix-3",
    "title": "Daily Mix 3",
    "subtitle": "Made for you · updated daily",
    "imageUrl": "/images/playlists/daily-mix-3.jpg"
  },
  {
    "id": "playlist-daily-mix-4",
    "title": "Daily Mix 4",
    "subtitle": "Made for you · updated daily",
    "imageUrl": "/images/playlists/daily-mix-4.jpg"
  },
  {
    "id": "playlist-daily-mix-5",
    "title": "Daily Mix 5",
    "subtitle": "Made for you · updated daily",
    "imageUrl": "/images/playlists/daily-mix-5.jpg"
  },
  {
    "id": "playlist-daily-mix-6",
    "title": "Daily Mix 6",
    "subtitle": "Made for you · updated daily",
    "imageUrl": "/images/playlists/daily-mix-6.jpg"
  },
  {
    "id": "playlist-mix-indie-drive",
    "title": "Indie Drive",
    "subtitle": "Garage rock & indie anthems",
    "imageUrl": "/images/playlists/mix-indie-drive.jpg"
  },
  {
    "id": "playlist-mix-late-night",
    "title": "Late Night",
    "subtitle": "Smooth R&B after dark",
    "imageUrl": "/images/playlists/mix-late-night.jpg"
  },
  {
    "id": "playlist-mix-focus",
    "title": "Deep Focus",
    "subtitle": "Instrumental and ambient",
    "imageUrl": "/images/playlists/mix-focus.jpg"
  },
  {
    "id": "playlist-mix-workout",
    "title": "Beast Mode",
    "subtitle": "High energy training",
    "imageUrl": "/images/playlists/mix-workout.jpg"
  },
  {
    "id": "playlist-mix-chill",
    "title": "Chill Hits",
    "subtitle": "Easy listening favorites",
    "imageUrl": "/images/playlists/mix-chill.jpg"
  },
  {
    "id": "playlist-mix-throwback",
    "title": "Throwback Thursday",
    "subtitle": "2000s essentials",
    "imageUrl": "/images/playlists/mix-throwback.jpg"
  },
  {
    "id": "playlist-mix-hip-hop",
    "title": "RapCaviar Mix",
    "subtitle": "Today's hip-hop",
    "imageUrl": "/images/playlists/mix-hip-hop.jpg"
  },
  {
    "id": "playlist-mix-pop",
    "title": "Pop Mix",
    "subtitle": "Today's top pop",
    "imageUrl": "/images/playlists/mix-pop.jpg"
  },
  {
    "id": "playlist-jump-back-1",
    "title": "Jump Back In #1",
    "subtitle": "Pick up where you left off",
    "imageUrl": "/images/playlists/jump-back-1.jpg"
  },
  {
    "id": "playlist-jump-back-2",
    "title": "Jump Back In #2",
    "subtitle": "Pick up where you left off",
    "imageUrl": "/images/playlists/jump-back-2.jpg"
  },
  {
    "id": "playlist-jump-back-3",
    "title": "Jump Back In #3",
    "subtitle": "Pick up where you left off",
    "imageUrl": "/images/playlists/jump-back-3.jpg"
  },
  {
    "id": "playlist-jump-back-4",
    "title": "Jump Back In #4",
    "subtitle": "Pick up where you left off",
    "imageUrl": "/images/playlists/jump-back-4.jpg"
  },
  {
    "id": "playlist-jump-back-5",
    "title": "Jump Back In #5",
    "subtitle": "Pick up where you left off",
    "imageUrl": "/images/playlists/jump-back-5.jpg"
  },
  {
    "id": "playlist-jump-back-6",
    "title": "Jump Back In #6",
    "subtitle": "Pick up where you left off",
    "imageUrl": "/images/playlists/jump-back-6.jpg"
  },
  {
    "id": "playlist-jump-back-7",
    "title": "Jump Back In #7",
    "subtitle": "Pick up where you left off",
    "imageUrl": "/images/playlists/jump-back-7.jpg"
  },
  {
    "id": "playlist-jump-back-8",
    "title": "Jump Back In #8",
    "subtitle": "Pick up where you left off",
    "imageUrl": "/images/playlists/jump-back-8.jpg"
  },
  {
    "id": "playlist-trending-1",
    "title": "Trending Track #1",
    "subtitle": "Hot right now",
    "imageUrl": "/images/playlists/trending-1.jpg"
  },
  {
    "id": "playlist-trending-2",
    "title": "Trending Track #2",
    "subtitle": "Hot right now",
    "imageUrl": "/images/playlists/trending-2.jpg"
  },
  {
    "id": "playlist-trending-3",
    "title": "Trending Track #3",
    "subtitle": "Hot right now",
    "imageUrl": "/images/playlists/trending-3.jpg"
  },
  {
    "id": "playlist-trending-4",
    "title": "Trending Track #4",
    "subtitle": "Hot right now",
    "imageUrl": "/images/playlists/trending-4.jpg"
  },
  {
    "id": "playlist-trending-5",
    "title": "Trending Track #5",
    "subtitle": "Hot right now",
    "imageUrl": "/images/playlists/trending-5.jpg"
  },
  {
    "id": "playlist-trending-6",
    "title": "Trending Track #6",
    "subtitle": "Hot right now",
    "imageUrl": "/images/playlists/trending-6.jpg"
  },
  {
    "id": "playlist-trending-7",
    "title": "Trending Track #7",
    "subtitle": "Hot right now",
    "imageUrl": "/images/playlists/trending-7.jpg"
  },
  {
    "id": "playlist-trending-8",
    "title": "Trending Track #8",
    "subtitle": "Hot right now",
    "imageUrl": "/images/playlists/trending-8.jpg"
  },
  {
    "id": "playlist-ai-pick-1",
    "title": "AI Mix #1",
    "subtitle": "Curated for you",
    "imageUrl": "/images/playlists/ai-pick-1.jpg"
  },
  {
    "id": "playlist-ai-pick-2",
    "title": "AI Mix #2",
    "subtitle": "Curated for you",
    "imageUrl": "/images/playlists/ai-pick-2.jpg"
  },
  {
    "id": "playlist-ai-pick-3",
    "title": "AI Mix #3",
    "subtitle": "Curated for you",
    "imageUrl": "/images/playlists/ai-pick-3.jpg"
  },
  {
    "id": "playlist-ai-pick-4",
    "title": "AI Mix #4",
    "subtitle": "Curated for you",
    "imageUrl": "/images/playlists/ai-pick-4.jpg"
  },
  {
    "id": "playlist-ai-pick-5",
    "title": "AI Mix #5",
    "subtitle": "Curated for you",
    "imageUrl": "/images/playlists/ai-pick-5.jpg"
  },
  {
    "id": "playlist-ai-pick-6",
    "title": "AI Mix #6",
    "subtitle": "Curated for you",
    "imageUrl": "/images/playlists/ai-pick-6.jpg"
  },
  {
    "id": "playlist-ai-pick-7",
    "title": "AI Mix #7",
    "subtitle": "Curated for you",
    "imageUrl": "/images/playlists/ai-pick-7.jpg"
  },
  {
    "id": "playlist-ai-pick-8",
    "title": "AI Mix #8",
    "subtitle": "Curated for you",
    "imageUrl": "/images/playlists/ai-pick-8.jpg"
  },
  {
    "id": "playlist-because-am-1",
    "title": "Arctic Monkeys Mix 1",
    "subtitle": "Because you like Arctic Monkeys",
    "imageUrl": "/images/playlists/because-am-1.jpg"
  },
  {
    "id": "playlist-because-am-2",
    "title": "Arctic Monkeys Mix 2",
    "subtitle": "Because you like Arctic Monkeys",
    "imageUrl": "/images/playlists/because-am-2.jpg"
  },
  {
    "id": "playlist-because-am-3",
    "title": "Arctic Monkeys Mix 3",
    "subtitle": "Because you like Arctic Monkeys",
    "imageUrl": "/images/playlists/because-am-3.jpg"
  },
  {
    "id": "playlist-because-am-4",
    "title": "Arctic Monkeys Mix 4",
    "subtitle": "Because you like Arctic Monkeys",
    "imageUrl": "/images/playlists/because-am-4.jpg"
  },
  {
    "id": "playlist-because-am-5",
    "title": "Arctic Monkeys Mix 5",
    "subtitle": "Because you like Arctic Monkeys",
    "imageUrl": "/images/playlists/because-am-5.jpg"
  },
  {
    "id": "playlist-because-am-6",
    "title": "Arctic Monkeys Mix 6",
    "subtitle": "Because you like Arctic Monkeys",
    "imageUrl": "/images/playlists/because-am-6.jpg"
  },
  {
    "id": "playlist-because-weeknd-1",
    "title": "The Weeknd Mix 1",
    "subtitle": "Because you like The Weeknd",
    "imageUrl": "/images/playlists/because-weeknd-1.jpg"
  },
  {
    "id": "playlist-because-weeknd-2",
    "title": "The Weeknd Mix 2",
    "subtitle": "Because you like The Weeknd",
    "imageUrl": "/images/playlists/because-weeknd-2.jpg"
  },
  {
    "id": "playlist-because-weeknd-3",
    "title": "The Weeknd Mix 3",
    "subtitle": "Because you like The Weeknd",
    "imageUrl": "/images/playlists/because-weeknd-3.jpg"
  },
  {
    "id": "playlist-because-weeknd-4",
    "title": "The Weeknd Mix 4",
    "subtitle": "Because you like The Weeknd",
    "imageUrl": "/images/playlists/because-weeknd-4.jpg"
  },
  {
    "id": "playlist-because-weeknd-5",
    "title": "The Weeknd Mix 5",
    "subtitle": "Because you like The Weeknd",
    "imageUrl": "/images/playlists/because-weeknd-5.jpg"
  },
  {
    "id": "playlist-because-weeknd-6",
    "title": "The Weeknd Mix 6",
    "subtitle": "Because you like The Weeknd",
    "imageUrl": "/images/playlists/because-weeknd-6.jpg"
  },
  {
    "id": "playlist-editors-1",
    "title": "Editor's Pick #1",
    "subtitle": "Hand-picked by our team",
    "imageUrl": "/images/playlists/editors-1.jpg"
  },
  {
    "id": "playlist-editors-2",
    "title": "Editor's Pick #2",
    "subtitle": "Hand-picked by our team",
    "imageUrl": "/images/playlists/editors-2.jpg"
  },
  {
    "id": "playlist-editors-3",
    "title": "Editor's Pick #3",
    "subtitle": "Hand-picked by our team",
    "imageUrl": "/images/playlists/editors-3.jpg"
  },
  {
    "id": "playlist-editors-4",
    "title": "Editor's Pick #4",
    "subtitle": "Hand-picked by our team",
    "imageUrl": "/images/playlists/editors-4.jpg"
  },
  {
    "id": "playlist-editors-5",
    "title": "Editor's Pick #5",
    "subtitle": "Hand-picked by our team",
    "imageUrl": "/images/playlists/editors-5.jpg"
  },
  {
    "id": "playlist-editors-6",
    "title": "Editor's Pick #6",
    "subtitle": "Hand-picked by our team",
    "imageUrl": "/images/playlists/editors-6.jpg"
  },
  {
    "id": "playlist-editors-7",
    "title": "Editor's Pick #7",
    "subtitle": "Hand-picked by our team",
    "imageUrl": "/images/playlists/editors-7.jpg"
  },
  {
    "id": "playlist-editors-8",
    "title": "Editor's Pick #8",
    "subtitle": "Hand-picked by our team",
    "imageUrl": "/images/playlists/editors-8.jpg"
  }
];

export const ALBUM_BY_ID = new Map(ALBUM_METADATA.map((album) => [album.id, album]));
